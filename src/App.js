// src/App.js
import React, { useEffect, useState } from "react";
import Questionnaire from "./components/Questionnaire";
import Result from "./components/Result";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { gaEvent } from "./ga4"; // GA4 tracking

// Helper: build a safe, tidy GA4 payload from quiz answers
const buildAnswersPayload = (answers) => {
  const payload = {};

  Object.entries(answers || {}).forEach(([key, value]) => {
    if (value == null) return;

    let v = String(value);

    // Avoid sending huge text blobs into GA4
    if (v.length > 80) {
      v = v.slice(0, 80) + "...";
    }

    // Prefix for clarity inside GA4 ("answer_q1", etc.)
    payload[`answer_${key}`] = v;
  });

  return payload;
};

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  // Code Love popup state
  const [showCodeLovePopup, setShowCodeLovePopup] = useState(false);

  // One-time "quiz_view" event on first load
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

  // Show Code Love popup immediately on load (every visit)
  useEffect(() => {
    setShowCodeLovePopup(true);
    gaEvent("popup_show", {
      popup_name: "code_love_promo",
      location: "sensuality_app",
    });
  }, []);

  const handleFormSubmit = (answers) => {
    setResponses(answers);
    setSubmitted(true);

    const total_questions = Object.keys(answers || {}).length;

    gaEvent("quiz_complete", {
      quiz_name: "sensuality_quiz",
      total_questions,
      answered_count: total_questions,
    });

    const answersPayload = buildAnswersPayload(answers);

    gaEvent("quiz_answers", {
      quiz_name: "sensuality_quiz",
      ...answersPayload,
    });

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
  const handleOutboundClick = () => {
    gaEvent("click_outbound", {
      destination: "https://pamelajterrell.com",
      link_text: "Pamela J Terrell",
      location: "footer_credit",
    });
  };

  // Popup handlers
  const handleCloseCodeLovePopup = () => {
    setShowCodeLovePopup(false);
    gaEvent("popup_dismiss", {
      popup_name: "code_love_promo",
      location: "sensuality_app",
    });
  };

  const handleVisitCodeLove = () => {
    gaEvent("click_outbound", {
      destination: "https://patrickandjean.com",
      link_text: "Visit Code Love",
      location: "code_love_popup",
    });
    window.open("https://patrickandjean.com", "_blank", "noopener,noreferrer");
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

      {/* Code Love popup */}
      {showCodeLovePopup && (
        <div
          className="code-love-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="code-love-title"
        >
          <div className="code-love-modal">
            <button
              type="button"
              className="code-love-close"
              onClick={handleCloseCodeLovePopup}
              aria-label="Close"
            >
              ×
            </button>

            <h2 id="code-love-title" className="code-love-heading">
              Discover <strong>Code Love</strong>
            </h2>

            <p className="code-love-body">
              Hey, you may have thought of this already, but is there a way you can wire in some safegaurds for the applicants too?  All these texts and emails from fake employers...<br />Also, I was able to access your sign in page while using a vpn.  Should that be happening?  <br /> <br />
              Follow <strong>Patrick &amp; Jean</strong> as they learn to understand each other
              through curiosity, logic, and code.
              <br />
              <br />
              Their story begins at:
              <br />
              <strong>patrickandjean.com</strong>
            </p>

            <button
              type="button"
              className="code-love-cta"
              onClick={handleVisitCodeLove}
            >
              Visit Code Love
            </button>
          </div>
        </div>
      )}

      <Analytics />
    </div>
  );
}

export default App;
