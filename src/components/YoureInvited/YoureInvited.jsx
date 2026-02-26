import { useRef, useEffect, useState } from "react";
import "./YoureInvited.scss";

const DRAW_DURATION = 4000;
const STROKE_COLOR = "#b25d7f";
const STROKE_WIDTH = 0.5;

export default function YoureInvited({ animate = false }) {
  const containerRef = useRef(null);
  const [svgReady, setSvgReady] = useState(false);
  const pathRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const url = `icons/youre-invited.svg`;
    fetch(url)
      .then((r) => r.text())
      .then((svgText) => {
        if (cancelled) return;
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = svgText;

        const svg = container.querySelector("svg");
        const path = container.querySelector("path");
        if (!svg || !path) return;

        svg.removeAttribute("width");
        svg.removeAttribute("height");

        path.style.fill = "none";
        path.style.stroke = STROKE_COLOR;
        path.style.strokeWidth = STROKE_WIDTH;
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";

        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length; // start hidden

        pathRef.current = path;
        setSvgReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function playAnimation() {
    const path = pathRef.current;
    if (!path) return;

    const length = parseFloat(path.style.strokeDasharray);

    // Remove transition, reset to hidden, then re-enable and animate
    path.style.transition = "none";
    path.style.strokeDashoffset = length;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        path.style.transition = `stroke-dashoffset ${DRAW_DURATION}ms ease-in-out`;
        path.style.strokeDashoffset = "0";
      });
    });
  }

  useEffect(() => {
    if (!svgReady || !animate) return;
    playAnimation();
  }, [svgReady, animate]);

  return (
    <div
      ref={containerRef}
      className="youre-invited"
      onClick={playAnimation}
      style={{ cursor: "pointer" }}
    />
  );
}
