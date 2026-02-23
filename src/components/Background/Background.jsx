import { useState, useEffect } from "react";
import "./Background.scss";

// ======================== CONFIGURATION ========================

const BASE = import.meta.env.BASE_URL;

// Images picked randomly for the falling effect
const FALLING_IMAGES = [
  `${BASE}icons/petals/img1.png`,
  `${BASE}icons/petals/img2.png`,
  `${BASE}icons/petals/img3.png`,
  `${BASE}icons/petals/img4.png`,
  `${BASE}icons/petals/img5.png`,
  `${BASE}icons/petals/img6.png`,
  `${BASE}icons/petals/img7.png`,
  `${BASE}icons/petals/img8.png`,
];

const FALLING = {
  count: 40, // total elements in the pool
  angleDeg: 95, // general fall direction: 90=straight down, >90=rightward, <90=leftward
  angleVariance: 22, // each element deviates ±this many degrees from angleDeg
  wiggleAmount: 28, // px, amplitude of side-to-side wiggle oscillation
  wiggleDuration: 3.5, // seconds per full wiggle cycle (lower = faster)
  minDuration: 12, // seconds, minimum fall cycle
  maxDuration: 22, // seconds, maximum fall cycle
  minSize: 40, // px
  maxSize: 65, // px
  opacity: 0.11, // max opacity (each flower gets a random fraction of this)
  vanishChance: 0.55, // fraction of flowers that randomly vanish
  vanishMinDuration: 15, // seconds, full vanish cycle length
  vanishMaxDuration: 28, // seconds, full vanish cycle length
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
    const wiggleX = FALLING.wiggleAmount * (0.5 + Math.random() * 0.5);
    const wiggleDelay = +(Math.random() * FALLING.wiggleDuration).toFixed(2);
    const opacity = FALLING.opacity * (0.5 + Math.random() * 0.5);

    const rotFrom = Math.random() * 360;
    const rotDelta =
      (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 240);

    const hasVanish = Math.random() < FALLING.vanishChance;
    const vanishDuration = hasVanish
      ? +(
          FALLING.vanishMinDuration +
          Math.random() *
            (FALLING.vanishMaxDuration - FALLING.vanishMinDuration)
        ).toFixed(2)
      : null;
    const vanishDelay = hasVanish
      ? +(Math.random() * vanishDuration).toFixed(2)
      : null;

    return {
      id,
      src,
      size: Math.round(size),
      fallFromY: Math.round(-(size + 20)),
      fallToY: Math.round(vh + size + 20),
      driftX: Math.round(driftX),
      startLeft: Math.round(startLeft),
      wiggleX: Math.round(wiggleX),
      wiggleDelay,
      opacity: +opacity.toFixed(2),
      duration: +duration.toFixed(2),
      delay: +delay.toFixed(2),
      rotFrom: Math.round(rotFrom),
      rotTo: Math.round(rotFrom + rotDelta),
      hasVanish,
      vanishDuration,
      vanishDelay,
    };
  });
}

// ======================== COMPONENT ========================

export default function Background({ hidden = false }) {
  const [flowers, setFlowers] = useState(generateFallingFlowers);

  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setFlowers(generateFallingFlowers()), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className={`bg ${hidden ? "bg--hidden" : ""}`}>
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
              "--wiggle-x": `${f.wiggleX}px`,
              "--wiggle-duration": `${FALLING.wiggleDuration}s`,
              "--rot-from": `${f.rotFrom}deg`,
              "--rot-to": `${f.rotTo}deg`,
              left: `${f.startLeft}px`,
            }}
          >
            {/* bg-fall-x handles directional drift (X movement matching fall direction) */}
            <div className="bg-fall-x">
              {/* bg-fall-wiggle handles the organic side-to-side oscillation */}
              <div
                className="bg-fall-wiggle"
                style={{ "--wiggle-delay": `${f.wiggleDelay}s` }}
              >
                {f.hasVanish ? (
                  <div
                    className="bg-fall-vanish"
                    style={{
                      "--vanish-duration": `${f.vanishDuration}s`,
                      "--vanish-delay": `${f.vanishDelay}s`,
                    }}
                  >
                    <img
                      src={f.src}
                      className="bg-fall-img"
                      alt=""
                      style={{ width: `${f.size}px`, opacity: f.opacity }}
                    />
                  </div>
                ) : (
                  <img
                    src={f.src}
                    className="bg-fall-img"
                    alt=""
                    style={{ width: `${f.size}px`, opacity: f.opacity }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`bg-corners ${hidden ? "bg--hidden" : ""}`}>
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
