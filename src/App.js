import React, { useEffect, useState } from "react"; // ✅ includes both hooks
import Questionnaire from "./components/Questionnaire";
import Result from "./components/Result";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { gaEvent } from "./ga4"; // only if you added GA4 tracking earlier


function App() {
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  // Send a one-time "quiz_view" event on first load (StrictMode-safe)
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("ga_quiz_view_sent")) {
        gaEvent("quiz_view", { quiz_name: "sensuality_quiz" });
        sessionStorage.setItem("ga_quiz_view_sent", "1");
      }
    } catch {
      gaEvent("quiz_view", { quiz_name: "sensuality_quiz" });
    }
  }, []);

  const handleFormSubmit = (answers) => {
    setResponses(answers);
    setSubmitted(true);

    // Fire quiz_complete with quick stats
    const total_questions = Object.keys(answers || {}).length;
    gaEvent("quiz_complete", {
      quiz_name: "sensuality_quiz",
      total_questions,
      answered_count: total_questions,
    });

    // Move focus to result card for a11y
    requestAnimationFrame(() => {
      const el = document.querySelector(".result-card");
      if (el) el.focus();
    });
  };

  const handleRestart = () => {
    setResponses({});
    setSubmitted(false);
    gaEvent("quiz_restart", { quiz_name: "sensuality_quiz" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdjustAnswers = () => {
    setSubmitted(false);
    gaEvent("quiz_adjust", { quiz_name: "sensuality_quiz" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Outbound link tracking for the footer credit
  const handleOutboundClick = (e) => {
    gaEvent("click_outbound", {
      destination: "https://pamelajterrell.com",
      link_text: "Pamela J Terrell",
      location: "footer_credit",
    });
  };

  return (
    <div className="app-shell">
      <main className="card" role="main">
        <header className="title-wrap">
          <h1 className="title">Exploring Sensuality</h1>
          <p className="subtitle">Discover how your senses shape desire</p>
        </header>

        {!submitted && (
          <figure className="mood-visual">
            <img
              src={`${process.env.PUBLIC_URL}/sensual.png`}
              alt="Soft abstract silk with warm, sensual light"
              loading="eager"
            />
          </figure>
        )}

        <section className="content" aria-live="polite">
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
            onClick={handleOutboundClick}
          >
            Pamela&nbsp;J&nbsp;Terrell
          </a>
        </p>
      </footer>

      <Analytics />
    </div>
  );
}

export default App;
