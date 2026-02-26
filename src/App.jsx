import { useState } from "react";
import Background from "./components/Background/Background";
import Envelope from "./components/Envelope/Envelope";
import Navbar from "./components/Navbar/Navbar";
import Landing from "./sections/Landing/Landing";
import Details from "./sections/Details/Details";
import Timeline from "./sections/Timeline/Timeline";
import Faqs from "./sections/Faqs/Faqs";
import Rsvp from "./sections/Rsvp/Rsvp";
import "./build-info";

// App animation phases:
// "envelope"  — Envelope is running its internal animation. Background hidden.
// "blending"  — Envelope letter fading out, background fading in.
// "revealing" — Envelope unmounted. Landing content stagger begins.
// "done"      — Landing stagger complete. Navbar appears.

export default function App() {
  const [appPhase, setAppPhase] = useState("envelope");
  const [preAnimateYoureInvited, setPreAnimateYoureInvited] = useState(false);

  const showEnvelope = appPhase === "envelope" || appPhase === "blending";
  const showLandingReveal = appPhase === "revealing" || appPhase === "done";

  return (
    <>
      <Background hidden={appPhase === "envelope"} />
      {showEnvelope && (
        <Envelope
          onBlend={() => setAppPhase("blending")}
          onComplete={() => setAppPhase("revealing")}
          onWritingStart={() => setPreAnimateYoureInvited(true)}
        />
      )}
      <Navbar hidden={appPhase !== "done"} />
      <Landing
        reveal={showLandingReveal}
        preAnimateYoureInvited={preAnimateYoureInvited}
        onRevealDone={() => setAppPhase("done")}
      />
      <Details />
      <Timeline />
      <Faqs />
      <Rsvp />
    </>
  );
}
