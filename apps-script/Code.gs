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
    colIndex[h] = i;
  });

  const now = new Date();
  const updates = [];

  people.forEach((person) => {
    // person.rowNumber is the actual sheet row (1-based)
    // data array index is rowNumber - 1
    const dataIndex = person.rowNumber - 1;

    if (dataIndex >= 1 && dataIndex < data.length) {
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
    sendNotification(updates);
  }

  return { success: true, updated: updates.length };
}

function sendNotification(people) {
  const lines = people.map((p) => `${p.name}: ${p.status}`);
  const subject = `Wedding RSVP: ${people.map((p) => p.name).join(", ")}`;
  const body = `New RSVP submission:\n\n${lines.join("\n")}\n\nSubmitted at: ${new Date().toLocaleString()}`;

  NOTIFICATION_EMAILS.forEach((a) => {console.log(a)})

  MailApp.sendEmail(NOTIFICATION_EMAILS, subject, body);
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
