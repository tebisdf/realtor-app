import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import * as serviceWorker from "./serviceWorker";
import { IntlProvider } from "react-intl";
import French from "./lang/fr.json";
import English from "./lang/en.json";
const locale = navigator.language;
let lang;
if (locale === "en") {
  lang = English;
} else {
  lang = French;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntlProvider locale={locale} messages={lang} defaultLocale={English}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </IntlProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// serviceWorker.unregister();
