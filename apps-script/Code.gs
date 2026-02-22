/**
 * Wedding RSVP - Google Apps Script Backend
 *
 * Setup:
 * 1. Create a Google Sheet with required columns: name | groupId | status | respondedAt
 *    - Columns can be in ANY order
 *    - You can add additional columns (e.g., phone, email) - they won't be touched
 * 2. Open Extensions > Apps Script
 * 3. Paste this code into Code.gs
 * 4. Deploy > New deployment > Web app > Execute as: Me, Access: Anyone
 * 5. Copy the deployment URL into your .env as VITE_APPS_SCRIPT_URL
 *
 * Email notifications:
 * Set NOTIFICATION_EMAILS below to receive emails when guests RSVP.
 */

const SHEET_NAME = "RSVP Status";
const NOTIFICATION_EMAILS = ["josipmuzic99@gmail.com", "storm.theobald@gmail.com];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, ...payload } = body;

    let result;

    switch (action) {
      case "getGuests":
        result = getGuests(payload.groupId);
        break;
      case "submitRsvp":
        result = submitRsvp(payload.people);
        break;
      default:
        return jsonResponse({ error: "Unknown action" }, 400);
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function getGuests(groupId) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const colIndex = {};
  headers.forEach((h, i) => {
    colIndex[h.replaceAll(" ", "").toLowerCase()] = i;
  });

  const guests = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const guest = {
      rowNumber: i + 1,
      name: row[colIndex["name"]],
      groupId: String(row[colIndex["groupid"]]),
      status: row[colIndex["status"]] || "",
      respondedAt: row[colIndex["respondedat"]]
        ? formatDate(row[colIndex["respondedat"]])
        : "",
    };

    if (!groupId || guest.groupId === groupId) {
      guests.push(guest);
    }
  }

  return { guests };
}

function submitRsvp(people) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const colIndex = {};
  headers.forEach((h, i) => {
    colIndex[h.replaceAll(" ", "").toLowerCase()] = i;
  });

  const now = new Date();
  const updates = [];
  const overwrites = [];

  people.forEach((person) => {
    // person.rowNumber is the actual sheet row (1-based)
    // data array index is rowNumber - 1
    const dataIndex = person.rowNumber - 1;

    if (dataIndex >= 1 && dataIndex < data.length) {
      const currentStatus = data[dataIndex][colIndex["status"]] || "";

      if (currentStatus && currentStatus !== person.status) {
        overwrites.push({
          name: person.name,
          previousStatus: currentStatus,
          newStatus: person.status,
        });
      }

      sheet
        .getRange(person.rowNumber, colIndex["status"] + 1)
        .setValue(person.status);
      sheet
        .getRange(person.rowNumber, colIndex["respondedat"] + 1)
        .setValue(now);
      updates.push(person);
    }
  });

  if (NOTIFICATION_EMAILS && updates.length > 0) {
    try {
      sendNotification(updates, overwrites);
    } catch (emailErr) {
      console.error(
        "[sendNotification] Failed to send email:",
        emailErr.message,
        emailErr.stack,
      );
    }
  }

  return { success: true, updated: updates.length };
}

function sendNotification(updates, overwrites) {
  console.log(
    "[sendNotification] Called with",
    updates.length,
    "update(s),",
    (overwrites || []).length,
    "overwrite(s)",
  );

  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  console.log("[sendNotification] Sheet URL:", sheetUrl);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  console.log("[sendNotification] Headers:", JSON.stringify(headers));

  const colIndex = {};
  headers.forEach((h, i) => {
    colIndex[h.replaceAll(" ", "").toLowerCase()] = i;
  });
  console.log("[sendNotification] colIndex:", JSON.stringify(colIndex));

  const allGuests = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[colIndex["name"]]) continue;
    allGuests.push({
      name: row[colIndex["name"]],
      status: row[colIndex["status"]] || "",
      respondedAt: row[colIndex["respondedat"]] || null,
    });
  }
  console.log("[sendNotification] Loaded", allGuests.length, "guests");

  const subject = `Wedding RSVP: ${updates.map((p) => p.name).join(", ")}`;
  console.log("[sendNotification] Building HTML...");
  const htmlBody = buildEmailHtml(updates, overwrites, allGuests, sheetUrl);
  console.log(
    "[sendNotification] HTML built, length:",
    htmlBody.length,
    "chars",
  );

  console.log(
    "[sendNotification] Sending email to:",
    NOTIFICATION_EMAILS.join(","),
  );
  MailApp.sendEmail({
    to: NOTIFICATION_EMAILS.join(","),
    subject,
    htmlBody,
  });
  console.log("[sendNotification] Email sent successfully");
}

function buildEmailHtml(updates, overwrites, allGuests, sheetUrl) {
  console.log(
    "[buildEmailHtml] total guests:",
    allGuests.length,
    "| updates:",
    updates.length,
    "| overwrites:",
    (overwrites || []).length,
  );
  const total = allGuests.length;
  const coming = allGuests.filter((g) => g.status === "Coming");
  const notComing = allGuests.filter((g) => g.status === "Not Coming");
  const yetToRsvp = allGuests.filter(
    (g) => g.status !== "Coming" && g.status !== "Not Coming",
  );
  const responded = coming.length + notComing.length;
  const pct = total > 0 ? Math.round((responded / total) * 100) : 0;

  // Sort responded guests: date DESC (date only, ignoring time), then Coming before Not Coming within same date
  const truncateToDay = (d) =>
    d instanceof Date ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : new Date(0);

  const respondedGuests = [...coming, ...notComing].sort((a, b) => {
    const dateA = truncateToDay(a.respondedAt);
    const dateB = truncateToDay(b.respondedAt);
    if (dateB - dateA !== 0) return dateB - dateA;
    if (a.status === "Coming" && b.status !== "Coming") return -1;
    if (a.status !== "Coming" && b.status === "Coming") return 1;
    return 0;
  });

  // Build responded rows with date group separators
  let respondedRows = "";
  let lastDateStr = null;
  respondedGuests.forEach((guest) => {
    const dateStr =
      guest.respondedAt instanceof Date
        ? formatDate(guest.respondedAt)
        : "Unknown";

    if (dateStr !== lastDateStr) {
      respondedRows += `
        <tr>
          <td colspan="3" style="background:#e8dff5;padding:6px 14px;font-size:0.82em;font-weight:bold;color:#634981;border-top:2px solid #b25d7f;letter-spacing:0.03em;">
            ${dateStr}
          </td>
        </tr>`;
      lastDateStr = dateStr;
    }

    const isComing = guest.status === "Coming";
    const rowBg = isComing ? "#eaf6eb" : "#fdecea";
    const statusColor = isComing ? "#276228" : "#b71c1c";

    respondedRows += `
      <tr style="background:${rowBg};">
        <td style="padding:7px 14px;border-bottom:1px solid #e0d6f0;">${guest.name}</td>
        <td style="padding:7px 14px;border-bottom:1px solid #e0d6f0;color:${statusColor};font-weight:bold;">${guest.status}</td>
        <td style="padding:7px 14px;border-bottom:1px solid #e0d6f0;color:#888;font-size:0.88em;">${dateStr}</td>
      </tr>`;
  });

  // Yet to RSVP rows (sorted alphabetically by name)
  let yetToRsvpRows = "";
  [...yetToRsvp].sort((a, b) => a.name.localeCompare(b.name)).forEach((guest) => {
    yetToRsvpRows += `
      <tr style="background:#fafafa;">
        <td style="padding:7px 14px;border-bottom:1px solid #ede8f5;color:#555;">${guest.name}</td>
      </tr>`;
  });

  // Overwrites table (only if any)
  let overwritesSection = "";
  if (overwrites && overwrites.length > 0) {
    const overwriteRows = overwrites
      .map(
        (o) => `
      <tr>
        <td style="padding:7px 14px;border-bottom:1px solid #fcd6d6;">${o.name}</td>
        <td style="padding:7px 14px;border-bottom:1px solid #fcd6d6;color:#b71c1c;font-weight:bold;">${o.previousStatus}</td>
        <td style="padding:7px 14px;border-bottom:1px solid #fcd6d6;color:#276228;font-weight:bold;">${o.newStatus}</td>
      </tr>`,
      )
      .join("");

    overwritesSection = `
      <div style="background:white;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #e53935;">
        <h2 style="margin:0 0 12px;color:#b71c1c;font-size:1.05em;">&#9888;&#65039; Status Overwrites Detected</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#fdecea;">
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Name</th>
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Previous</th>
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">New</th>
            </tr>
          </thead>
          <tbody>${overwriteRows}</tbody>
        </table>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#e8e0f0;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:24px auto;background:#f4ecff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.12);">

    <!-- Header -->
    <div style="background:#634981;color:white;padding:32px 24px;text-align:center;">
      <h1 style="margin:0 0 8px;font-size:1.5em;font-weight:normal;letter-spacing:0.02em;">Wedding RSVP Update</h1>
      <p style="margin:0;opacity:0.85;font-size:0.95em;">${updates.map((p) => p.name).join(", ")} just responded</p>
    </div>

    <div style="padding:24px;">

      <!-- Stats -->
      <div style="background:white;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #b25d7f;">
        <h2 style="margin:0 0 12px;color:#634981;font-size:1.05em;">Overall</h2>
        <p style="margin:0 0 14px;font-size:1.35em;font-weight:bold;color:#b25d7f;">${responded} / ${total} responded &nbsp;(${pct}%)</p>
        <table style="border-collapse:collapse;">
          <tr>
            <td style="padding:4px 16px 4px 0;color:#276228;">&#10003; Coming</td>
            <td style="padding:4px 16px 4px 0;font-weight:bold;color:#276228;">${coming.length}</td>
            <td style="padding:4px 0;color:#aaa;font-size:0.88em;">${total > 0 ? Math.round((coming.length / total) * 100) : 0}% of all guests</td>
          </tr>
          <tr>
            <td style="padding:4px 16px 4px 0;color:#b71c1c;">&#10007; Not Coming</td>
            <td style="padding:4px 16px 4px 0;font-weight:bold;color:#b71c1c;">${notComing.length}</td>
            <td style="padding:4px 0;color:#aaa;font-size:0.88em;">${total > 0 ? Math.round((notComing.length / total) * 100) : 0}% of all guests</td>
          </tr>
          <tr>
            <td style="padding:4px 16px 4px 0;color:#777;">&#8987; Yet to respond</td>
            <td style="padding:4px 16px 4px 0;font-weight:bold;color:#777;">${yetToRsvp.length}</td>
            <td style="padding:4px 0;color:#aaa;font-size:0.88em;">${total > 0 ? Math.round((yetToRsvp.length / total) * 100) : 0}% of all guests</td>
          </tr>
        </table>
      </div>

      ${overwritesSection}

      <!-- All responses table -->
      <div style="background:white;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #634981;">
        <h2 style="margin:0 0 12px;color:#634981;font-size:1.05em;">All Responses (${responded})</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#ede4f8;">
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Name</th>
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Status</th>
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Date</th>
            </tr>
          </thead>
          <tbody>${respondedRows}</tbody>
        </table>
      </div>

      <!-- Yet to RSVP table -->
      <div style="background:white;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #9e9e9e;">
        <h2 style="margin:0 0 12px;color:#634981;font-size:1.05em;">&#8987; Yet to RSVP (${yetToRsvp.length})</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px 14px;text-align:left;font-size:0.88em;color:#555;font-weight:bold;">Name</th>
            </tr>
          </thead>
          <tbody>${yetToRsvpRows}</tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="text-align:center;padding:8px 0 4px;color:#aaa;font-size:0.82em;">
        <a href="${sheetUrl}" style="color:#b25d7f;text-decoration:none;font-weight:bold;">View Google Sheet</a>
        &nbsp;&nbsp;&#183;&nbsp;&nbsp;
        ${new Date().toLocaleString()}
      </div>

    </div>
  </div>
</body>
</html>`;
}

function formatDate(date) {
  if (!(date instanceof Date)) return String(date);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "MMM d, yyyy");
}

function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function testSendNotification() {
  const updates = [{ rowNumber: 2, name: "Tester Test", status: "Coming" }];

  const overwrites = [
    { name: "Petra Kovač", previousStatus: "Not Coming", newStatus: "Coming" },
  ];

  sendNotification(updates, overwrites);
}

function testSubmitRsvp() {
  const people = [{ rowNumber: 2, name: "Tester Test", status: "Coming" }];

  const result = submitRsvp(people);
  console.log("[test] Result:", JSON.stringify(result));
}
