import { useState, useEffect } from "react";
import LocationButton from "../../components/LocationButton/LocationButton";
import YoureInvited from "../../components/YoureInvited/YoureInvited";
import "./Landing.scss";

const STAGGER_DELAY = 500; // ms between each group appearing
const GROUP_COUNT = 10;

export default function Landing({
  reveal = false,
  preAnimateYoureInvited = false,
  onRevealDone,
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!reveal || visibleCount > 0) return;

    for (let i = 1; i <= GROUP_COUNT; i++) {
      setTimeout(() => {
        setVisibleCount(i);
        if (i === GROUP_COUNT && onRevealDone) {
          setTimeout(onRevealDone, 300);
        }
      }, i * STAGGER_DELAY);
    }
  }, [reveal]);

  const groupClass = (index) => {
    // Group 1 (YoureInvited) can be made visible early for the envelope transition overlap
    const visible =
      visibleCount >= index || (preAnimateYoureInvited && index === 1);
    return `landing-reveal ${visible ? "landing-reveal--visible" : ""}`;
  };

  return (
    <section id="landing" className="section">
      <div className="landing-content">
        <div id="landing-youre-invited" className={groupClass(1)}>
          <YoureInvited animate={preAnimateYoureInvited || visibleCount >= 1} />
        </div>
        <div className={groupClass(2)}>
          <p className="font-text landing-text">TO THE WEDDING OF</p>
        </div>
        <div className={groupClass(3)}>
          <p className="font-decorative3 landing-names">JOSIP & STORM</p>
        </div>
        <div className={groupClass(5)}>
          <p className="font-text landing-text on">ON</p>
          <p className="font-text landing-text landing-text--faded landing-text--big">
            Saturday, September 12th
          </p>
          {/* TODO: link to calendar */}
          <p className="font-decorative3 landing-date">12.09.2026</p>
        </div>
        <div className={groupClass(7)}>
          <LocationButton
            texts={[
              "Hotel Storia",
              "Tasovčići bb, 88300, Bosnia & Herzegovina",
            ]}
            link="https://maps.app.goo.gl/Niw21p7dzi6Ryziq9"
          />
          <a href="#rsvp" className="font-text landing-rsvp">
            RSVP by August 29th
          </a>
        </div>
      </div>
    </section>
  );
}
