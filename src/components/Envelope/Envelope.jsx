import { useState, useEffect } from "react";
import "./Envelope.scss";

// ======================== CONFIGURATION ========================
// Time (ms) before the envelope auto-opens if the user hasn't clicked
const AUTO_OPEN_DELAY = 500000;

// Animation durations (ms) — tweak these to adjust the feel
const TIMINGS = {
  flapDuration: 800, // How long the flap takes to rotate open
  revealOverlap: 300, // Start revealing slightly before flap finishes (smoother)
  letterDuration: 900, // How long the letter slides up
  exitDuration: 800, // How long the envelope slides off-screen
};

export default function Envelope({ onComplete }) {
  // Phase flow: "closed" → "opening" → "revealing" → "exiting" → onComplete()
  const [phase, setPhase] = useState("closed");

  // Lock scrolling while envelope is mounted, and reset scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-open timer
  useEffect(() => {
    if (phase !== "closed") return;
    const timer = setTimeout(handleOpen, AUTO_OPEN_DELAY);
    return () => clearTimeout(timer);
  }, [phase]);

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("opening");

    // Start revealing the letter slightly before flap finishes for smooth overlap
    setTimeout(
      () => setPhase("revealing"),
      TIMINGS.flapDuration - TIMINGS.revealOverlap,
    );

    // After letter has slid up, start the exit
    setTimeout(
      () => setPhase("exiting"),
      TIMINGS.flapDuration + TIMINGS.letterDuration - TIMINGS.revealOverlap,
    );

    // After exit animation, unmount
    setTimeout(
      () => onComplete(),
      TIMINGS.flapDuration +
        TIMINGS.letterDuration +
        TIMINGS.exitDuration -
        TIMINGS.revealOverlap,
    );
  }

  return (
    <div className={`envelope envelope--${phase}`} onClick={handleOpen}>
      <div className="envelope__body">
        {/* __inner has overflow:hidden to clip the letter inside the envelope */}
        <div className="envelope__inner">
          <div className="envelope__back" />
          <div className="envelope__sides" />
          <div className="envelope__letter">
            {/* ENHANCEMENT: Add more decorative content — borders, monogram, ornaments */}
            <div className="envelope__letter-content">
              <h1>You're Invited</h1>
            </div>
          </div>
          <div className="envelope__front" />
        </div>

        {/* Flap and seal are outside __inner so they aren't clipped by overflow:hidden */}
        <div className="envelope__flap" />
        {/* ENHANCEMENT: Replace heart with an SVG wax seal with embossed initials */}
        <div className="envelope__seal">
          <i className="fa-solid fa-heart"></i>
        </div>
      </div>

      {/* ENHANCEMENT: Add a "Tap to open" text hint that fades out on click */}
    </div>
  );
}
