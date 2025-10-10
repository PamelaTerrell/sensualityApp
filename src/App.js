import React, { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import Result from "./components/Result";
import "./App.css";

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  const handleFormSubmit = (answers) => {
    setResponses(answers);
    setSubmitted(true);
    console.log("[Questionnaire submitted]", answers);

    requestAnimationFrame(() => {
      const el = document.querySelector(".result-card");
      if (el) el.focus();
    });
  };

  const handleRestart = () => {
    setResponses({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdjustAnswers = () => {
    // Go back to the questionnaire but keep the current responses
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <main className="card" role="main">
        <header className="title-wrap">
          <h1 className="title">Exploring Sensuality</h1>
          <p className="subtitle">
            Desire, comfort, and connection
          </p>
        </header>

        {!submitted && (
          <figure className="mood-visual">
            <img
              src={`${process.env.PUBLIC_URL}/sensual.png`}
              alt="Soft abstract silk with warm, sensual light"
              loading="eager"
            />
            <figcaption className="sr-only">
              Abstract sensual background evoking warmth and intimacy.
            </figcaption>
          </figure>
        )}

        <section className="content" aria-live="polite" aria-busy={submitted ? "true" : "false"}>
          {!submitted ? (
            <Questionnaire initial={responses} onSubmit={handleFormSubmit} />
          ) : (
            <Result
              answers={responses}
              onRestart={handleRestart}
              onAdjust={handleAdjustAnswers}
            />
          )}
        </section>
      </main>

      <footer className="footer-credit" role="contentinfo">
        <div className="glow-orb" aria-hidden="true"></div>
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://pamelajterrell.com"
            className="credit-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pamela&nbsp;J&nbsp;Terrell
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
