import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.scss";

history.scrollRestoration = "manual";

if (window.location.hash) {
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// TODO: Constantly rotating flowers in the background
// TODO: Writing svg thingy
// TODO: As the envelope falls, already start resizing the card
