import { useState } from "react";
import "./Background.scss";

// ======================== CONFIGURATION ========================

const BASE = import.meta.env.BASE_URL;

// Images picked randomly for the falling effect
const FALLING_IMAGES = [
  // `${BASE}icons/flowers/flower_1.webp`,
  // `${BASE}icons/flowers/flower_2.webp`,
  `${BASE}icons/flowers/flower_3.webp`,
];

const FALLING = {
  count: 20, // total elements in the pool
  angleDeg: 95, // general fall direction: 90=straight down, >90=rightward, <90=leftward
  angleVariance: 22, // each element deviates ±this many degrees from angleDeg
  flickerAmount: 28, // px, amplitude of side-to-side flicker oscillation
  flickerDuration: 3.5, // seconds per full flicker cycle (lower = faster)
  minDuration: 12, // seconds, minimum fall cycle
  maxDuration: 22, // seconds, maximum fall cycle
  minSize: 20, // px
  maxSize: 65, // px
  opacity: 0.15, // max opacity (each flower gets a random fraction of this)
};

// Corner flowers — edit position/size/opacity freely
// style accepts any CSS property in camelCase (bottom, left, right, width, transform, opacity…)
const CORNER_LEFT = [
  {
    src: `${BASE}icons/flowers/leaves_2.svg`,
    style: {
      bottom: "60px",
      left: "9px",
      width: "150px",
      transform: "rotate(10deg)",
      opacity: 0.08,
    },
  },
  {
    src: `${BASE}icons/flowers/flower_2.webp`,
    style: {
      bottom: "-30px",
      left: "-70px",
      width: "300px",
      opacity: 0.65,
    },
  },
  {
    src: `${BASE}icons/flowers/flower_1.webp`,
    style: {
      bottom: "-95px",
      left: "140px",
      width: "250px",
      opacity: 0.65,
      transform: "rotate(190deg)",
    },
  },
];

const CORNER_RIGHT = [
  {
    src: `${BASE}icons/flowers/leaves.webp`,
    style: {
      bottom: "250px",
      right: "10px",
      width: "150px",
      transform: "rotate(-60deg)",
      opacity: 0.2,
    },
  },
  {
    src: `${BASE}icons/flowers/leaves_2.svg`,
    style: {
      bottom: "-130px",
      right: "220px",
      width: "140px",
      transform: "scalex(-1) rotate(50deg)",
      opacity: 0.08,
      zIndex: -999,
    },
  },
  {
    src: `${BASE}icons/flowers/flower_3.webp`,
    style: {
      bottom: "-100px",
      right: "-40px",
      width: "350px",
      transform: "rotate(20deg)",
      opacity: 0.2,
      zIndex: 1,
    },
  },
  {
    src: `${BASE}icons/flowers/flower_1.webp`,
    style: {
      bottom: "50px",
      right: "-100px",
      width: "260px",
      transform: "rotate(130deg)",
      opacity: 0.5,
      zIndex: 2,
    },
  },
];

// ======================== HELPERS ========================

function generateFallingFlowers() {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  return Array.from({ length: FALLING.count }, (_, id) => {
    const src =
      FALLING_IMAGES[Math.floor(Math.random() * FALLING_IMAGES.length)];
    const size =
      FALLING.minSize + Math.random() * (FALLING.maxSize - FALLING.minSize);

    // Compute horizontal drift from the chosen angle
    const angleDev = (Math.random() - 0.5) * 2 * FALLING.angleVariance;
    const angleRad = ((FALLING.angleDeg + angleDev - 90) * Math.PI) / 180;
    const totalY = vh + size * 2 + 40;
    const driftX = Math.tan(angleRad) * totalY;

    const duration =
      FALLING.minDuration +
      Math.random() * (FALLING.maxDuration - FALLING.minDuration);
    // Negative delay = flower starts mid-fall at page load, distributing them naturally
    const delay = -Math.random() * duration;

    const startLeft = Math.random() * vw;
    const flickerX = FALLING.flickerAmount * (0.5 + Math.random() * 0.5);
    const opacity = FALLING.opacity * (0.5 + Math.random() * 0.5);

    const rotFrom = Math.random() * 360;
    const rotDelta =
      (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 240);

    return {
      id,
      src,
      size: Math.round(size),
      fallFromY: Math.round(-(size + 20)),
      fallToY: Math.round(vh + size + 20),
      driftX: Math.round(driftX),
      startLeft: Math.round(startLeft),
      flickerX: Math.round(flickerX),
      opacity: +opacity.toFixed(2),
      duration: +duration.toFixed(2),
      delay: +delay.toFixed(2),
      rotFrom: Math.round(rotFrom),
      rotTo: Math.round(rotFrom + rotDelta),
    };
  });
}

// ======================== COMPONENT ========================

export default function Background() {
  // useState initializer runs once on mount — flowers never regenerate on re-render
  const [flowers] = useState(generateFallingFlowers);

  return (
    <>
      <div className="bg">
        {flowers.map((f) => (
          // All CSS custom properties set on the outermost div and inherited by all children
          <div
            key={f.id}
            className="bg-fall-y"
            style={{
              "--fall-from-y": `${f.fallFromY}px`,
              "--fall-to-y": `${f.fallToY}px`,
              "--fall-duration": `${f.duration}s`,
              "--fall-delay": `${f.delay}s`,
              "--drift-x": `${f.driftX}px`,
              "--flicker-x": `${f.flickerX}px`,
              "--flicker-duration": `${FALLING.flickerDuration}s`,
              "--rot-from": `${f.rotFrom}deg`,
              "--rot-to": `${f.rotTo}deg`,
              left: `${f.startLeft}px`,
            }}
          >
            {/* bg-fall-x handles directional drift (X movement matching fall direction) */}
            <div className="bg-fall-x">
              {/* bg-fall-flicker handles the organic side-to-side oscillation */}
              <div className="bg-fall-flicker">
                <img
                  src={f.src}
                  className="bg-fall-img"
                  alt=""
                  style={{ width: `${f.size}px`, opacity: f.opacity }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-corners">
        <div className="bg-corner bg-corner--left">
          {CORNER_LEFT.map((flower, i) => (
            <img
              key={i}
              src={flower.src}
              className="bg-corner-img"
              style={flower.style}
              alt=""
            />
          ))}
        </div>
        <div className="bg-corner bg-corner--right">
          {CORNER_RIGHT.map((flower, i) => (
            <img
              key={i}
              src={flower.src}
              className="bg-corner-img"
              style={flower.style}
              alt=""
            />
          ))}
        </div>
      </div>
    </>
  );
}
