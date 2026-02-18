import Navbar from "./components/Navbar/Navbar";
import Landing from "./sections/Landing/Landing";
import Details from "./sections/Details/Details";
import Timeline from "./sections/Timeline/Timeline";
import Faqs from "./sections/Faqs/Faqs";
import Rsvp from "./sections/Rsvp/Rsvp";

export default function App() {
  return (
    <>
      <Navbar />
      <Landing />
      <Details />
      <Timeline />
      <Faqs />
      <Rsvp />
    </>
  );
}
