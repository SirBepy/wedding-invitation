import { useState, useEffect, useMemo, useRef } from "react";
import "./Envelope.scss";

// ======================== CONFIGURATION ========================
// Time (ms) before the envelope auto-opens if the user hasn't clicked
const AUTO_OPEN_DELAY = 500000;

// Animation durations (ms) — tweak these to adjust the feel
// All timing lives here so you can tune the entire sequence from one place
const TIMINGS = {
  flapDuration: 800, // How long the flap takes to rotate open
  revealOverlap: 300, // Start letter slide slightly before flap finishes (smoother feel)
  revealPause: 0, // Extra pause after flap opens before letter moves (try 300–600 for a beat)
  letterDuration: 900, // How long the letter slides up
  petalDelay: 100, // How long after letter starts moving before petals burst
  exitDuration: 800, // How long the envelope slides off-screen
  expandDelay: 100, // Pause after envelope exits before letter starts expanding
  expandDuration: 600, // How long the letter takes to scale to full viewport
  blendDuration: 400, // How long the letter overlay takes to fade out
};

// ======================== PETALS ========================
const BASE = import.meta.env.BASE_URL;
const PETAL_IMAGES = Array.from(
  { length: 8 },
  (_, i) => `${BASE}icons/petals/img${i + 1}.png`,
);

const PETALS = {
  count: 38,
  minSize: 40, // % of envelope width (relative sizing)
  maxSize: 60, // % of envelope width
  restingY: 200, // % from top — vertical center of the petal cluster
  spreadY: 12, // ±% random scatter around restingY
  spreadX: 100, // total horizontal spread (% of envelope width, centered)
  minDuration: 1.6, // seconds — total animation time
  maxDuration: 2.0, // seconds
  maxDelay: 0.4, // seconds — stagger window
  burstUp: 205, // % of envelope height the petals kick upward at the peak
};

// TODO: bring back the petals
function generatePetals() {
  // return Array.from({ length: PETALS.count }, (_, i) => {
  //   const src = PETAL_IMAGES[Math.floor(Math.random() * PETAL_IMAGES.length)];
  //   const size =
  //     PETALS.minSize + Math.random() * (PETALS.maxSize - PETALS.minSize);
  //   const duration =
  //     PETALS.minDuration +
  //     Math.random() * (PETALS.maxDuration - PETALS.minDuration);
  //   const delay = Math.random() * PETALS.maxDelay;

  //   // Resting position: scattered around center of envelope
  //   const halfSpread = PETALS.spreadX / 2;
  //   const startX = -halfSpread + Math.random() * PETALS.spreadX; // % from center (left:50%)
  //   const startY = PETALS.restingY + (Math.random() - 0.5) * 2 * PETALS.spreadY;

  //   // Burst direction: left-of-center petals fly RIGHT, right-of-center fly LEFT
  //   const burstDir = startX < 0 ? 1 : -1;
  //   const burstX = burstDir * (30 + Math.random() * 60); // % horizontal burst

  //   // Peak height: how far up they kick before falling
  //   const peakY = -(PETALS.burstUp * (0.7 + Math.random() * 0.6)); // % upward from start

  //   // Rotation
  //   const rotFrom = Math.random() * 360;
  //   const rotTo =
  //     rotFrom + (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 270);

  //   return {
  //     id: i,
  //     src,
  //     size: +size.toFixed(1),
  //     duration: +duration.toFixed(2),
  //     delay: +delay.toFixed(2),
  //     startX: +startX.toFixed(1),
  //     startY: +startY.toFixed(1),
  //     burstX: +burstX.toFixed(1),
  //     peakY: +peakY.toFixed(1),
  //     rotFrom: Math.round(rotFrom),
  //     rotTo: Math.round(rotTo),
  //     opacity: +(0.5 + Math.random() * 0.5).toFixed(2),
  //   };
  // });
  return [];
}

export default function Envelope({ onBlend, onComplete }) {
  // Phase flow: "closed" → "opening" → "revealing" → "exiting" → "expanding" → "blending" → onComplete()
  const [phase, setPhase] = useState("closed");
  const petals = useMemo(generatePetals, []);
  const letterRef = useRef(null);
  const [letterRect, setLetterRect] = useState(null);

  const isDetached = ["exiting", "expanding", "blending"].includes(phase);

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

    // When the letter starts moving (flap nearly done + optional pause)
    const revealAt =
      TIMINGS.flapDuration - TIMINGS.revealOverlap + TIMINGS.revealPause;

    // Start revealing the letter (+ petals burst shortly after via petalDelay in CSS)
    setTimeout(() => setPhase("revealing"), revealAt);

    // Snapshot letter rect and start exit (body slides down, letter stays)
    const exitAt = revealAt + TIMINGS.letterDuration;
    setTimeout(() => {
      if (letterRef.current) {
        const rect = letterRef.current.getBoundingClientRect();
        setLetterRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
      setPhase("exiting");
    }, exitAt);

    // After envelope body has slid off, start expanding the letter
    const expandAt = exitAt + TIMINGS.exitDuration + TIMINGS.expandDelay;
    setTimeout(() => setPhase("expanding"), expandAt);

    // After letter has expanded, start blending (fade out letter, fade in bg)
    const blendAt = expandAt + TIMINGS.expandDuration;
    setTimeout(() => {
      setPhase("blending");
      onBlend();
    }, blendAt);

    // After blend completes, tell App we're done
    const doneAt = blendAt + TIMINGS.blendDuration;
    setTimeout(() => onComplete(), blendAt);
  }

  return (
    <div className={`envelope envelope--${phase}`} onClick={handleOpen}>
      <div className="envelope__body">
        {/* __inner has overflow:hidden to clip the letter inside the envelope */}
        <div className="envelope__inner">
          <div className="envelope__back" />
          <div className="envelope__sides" />

          {/* Letter inside body only during early phases */}
          {!isDetached && (
            <div ref={letterRef} className="envelope__letter">
              <div className="envelope__letter-content" />
            </div>
          )}

          {/* Petals sit on top of the letter, under the sides/front.
              Visible once the flap opens, then burst out during revealing. */}
          {/* Petals: 3 nested divs split X / Y / rotation for independent easing
              Outer .envelope__petal — positioned at rest, handles X burst + z-index step
              Middle .envelope__petal-y — handles Y arc (up then down, parabolic)
              Inner img — handles spin */}
          <div className="envelope__petals">
            {petals.map((p) => (
              <div
                key={p.id}
                className="envelope__petal"
                style={{
                  "--petal-x": `${p.startX}%`,
                  "--petal-y": `${p.startY}%`,
                  "--petal-burst-x": `${p.burstX}%`,
                  "--petal-peak-y": `${p.peakY}%`,
                  "--petal-duration": `${p.duration}s`,
                  "--petal-delay": `${p.delay}s`,
                  "--petal-rot-from": `${p.rotFrom}deg`,
                  "--petal-rot-to": `${p.rotTo}deg`,
                }}
              >
                <div className="envelope__petal-y">
                  <img
                    src={p.src}
                    alt=""
                    style={{ width: `${p.size}%`, opacity: p.opacity }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="envelope__front" />
        </div>

        {/* Flap and seal are outside __inner so they aren't clipped by overflow:hidden */}
        <div className="envelope__flap" />
        <div className="envelope__seal">
          <img
            src={`${import.meta.env.BASE_URL}icons/seal.png`}
            alt="wax seal"
          />
        </div>
      </div>

      {/* Detached letter — positioned fixed, outside envelope body */}
      {isDetached && letterRect && (
        <div
          className={`envelope__letter envelope__letter--detached ${
            ["expanding", "blending"].includes(phase)
              ? "envelope__letter--expanded"
              : ""
          } ${phase === "blending" ? "envelope__letter--fading" : ""}`}
          style={{
            "--letter-top": `${letterRect.top}px`,
            "--letter-left": `${letterRect.left}px`,
            "--letter-width": `${letterRect.width}px`,
            "--letter-height": `${letterRect.height}px`,
          }}
        >
          <div className="envelope__letter-content" />
        </div>
      )}

      {/* ENHANCEMENT: Add a "Tap to open" text hint that fades out on click */}
    </div>
  );
}
