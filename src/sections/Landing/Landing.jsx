import LocationButton from "../../components/LocationButton/LocationButton";
import "./Landing.scss";

export default function Landing() {
  return (
    <section id="landing" className="section">
      <div className="landing-content">
        <h1>You're Invited</h1>
        <p className="font-text landing-text">TO THE WEDDING OF</p>
        <p className="font-decorative3 landing-names">JOSIP & STORM</p>
        <p className="font-text landing-text on">ON</p>
        <p className="font-text landing-text landing-text--faded landing-text--big">
          Saturday, September 12th
        </p>
        {/* TODO: link to calendar */}
        <p className="font-decorative3 landing-date">12.09.2026</p>
        <LocationButton
          texts={["Hotel Storia", "Tasovčići bb, 88300, Bosnia & Herzegovina"]}
          link="https://maps.app.goo.gl/Niw21p7dzi6Ryziq9"
        />
        <a href="#rsvp" className="font-text landing-rsvp">
          RSVP by August 29th
        </a>
      </div>
    </section>
  );
}
