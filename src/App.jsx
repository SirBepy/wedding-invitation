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

export default function App() {
  const [envelopeDone, setEnvelopeDone] = useState(false);

  return (
    <>
      <Background />
      {!envelopeDone && (
        <Envelope onComplete={() => setEnvelopeDone(true)} />
      )}
      <Navbar hidden={!envelopeDone} />
      <Landing />
      <Details />
      <Timeline />
      <Faqs />
      <Rsvp />
    </>
  );
}
