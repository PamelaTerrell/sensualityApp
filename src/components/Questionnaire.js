import React, { useEffect, useMemo, useRef, useState } from "react";
import { gaEvent } from "../ga4"; // ⬅️ GA4 helper

// Reworded to be intimate, sensory, and inclusive – but less explicit
const questions = [
  {
    id: 1,
    dim: "Touch",
    text: "Unhurried, intentional physical touch deepens your sense of connection.",
  },
  {
    id: 2,
    dim: "Touch",
    text: "Gentle, lingering contact (like a slow trace along the hand or arm) heightens your responsiveness.",
  },
  {
    id: 3,
    dim: "Music",
    text: "Music with a sensual or emotional tone helps you ease into a more receptive mood.",
  },
  {
    id: 4,
    dim: "Visual",
    text: "Visual details (outfit, lighting, body language) significantly influence your sense of attraction.",
  },
  {
    id: 5,
    dim: "Visual",
    text: "Warm, flattering lighting makes you feel more open to closeness and intimacy.",
  },
  {
    id: 6,
    dim: "Scent",
    text: "Scent (natural skin, perfume, candles) meaningfully shapes how drawn in you feel.",
  },
  {
    id: 7,
    dim: "Taste",
    text: "Taste (wine, chocolate, shared food, flavored lip balm) adds to your sense of sensual enjoyment.",
  },
  {
    id: 8,
    dim: "Pace",
    text: "Unrushed pacing and synced breathing help you shift into a more sensual, present state.",
  },
  {
    id: 9,
    dim: "Fantasy",
    text: "Anticipation and imagination build your sense of desire and excitement.",
  },
  {
    id: 10,
    dim: "Environment",
    text: "A tidy, cozy environment helps you relax and soften into sensuality.",
  },
  {
    id: 11,
    dim: "Communication",
    text: "Verbal reassurance, attunement, and check-ins increase your comfort and responsiveness.",
  },
  {
    id: 12,
    dim: "Anticipation",
    text: "Teasing, a slow build, or delayed gratification makes the experience feel more charged and alive.",
  },
  {
    id: 13,
    dim: "Novelty",
    text: "Trying something slightly new or different boosts your sense of interest and desire.",
  },
  {
    id: 14,
    dim: "Power",
    text: "A gentle give-and-take around who leads can feel exciting and meaningful to you.",
  },
  {
    id: 15,
    dim: "Aftercare",
    text: "Afterwards, softness (like cuddling, grounding touch, or affirming words) matters to how satisfied you feel.",
  },
  {
    id: 16,
    dim: "Context",
    text: "Low stress and feeling emotionally safe are essential for you to feel genuinely open to intimacy.",
  },
  {
    id: 17,
    dim: "Self-image",
    text: "Feeling confident in your body, outfit, or presence makes desire come more naturally.",
  },
  {
    id: 18,
    dim: "Pace",
    text: "Resisting urgency and savoring each moment lets your desire deepen in a natural way.",
  },
  {
    id: 19,
    dim: "Connection",
    text: "You feel most alive and engaged when there is clear, mutual, enthusiastic responsiveness.",
  },
];

const SCALE = [
  { value: "1", label: "Not at all" },
  { value: "2", label: "A little" },
  { value: "3", label: "Sometimes" },
  { value: "4", label: "Often" },
  { value: "5", label: "Very much" },
];

const Questionnaire = ({ onSubmit, initial }) => {
  const [responses, setResponses] = useState({});
  const [touched, setTouched] = useState({});

  // timing & one-offs
  const mountedAtRef = useRef(performance.now());
  const firstAnswerAtRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      setResponses(initial);
      const touchedInit = {};
      Object.keys(initial).forEach((k) => (touchedInit[k] = true));
      setTouched(touchedInit);
    }
  }, [initial]);

  const complete = useMemo(
    () => questions.every((q) => !!responses[q.id]),
    [responses]
  );
  const answered = useMemo(
    () => questions.filter((q) => !!responses[q.id]).length,
    [responses]
  );

  // Fire progress updates
  useEffect(() => {
    if (answered >= 0) {
      gaEvent("progress_update", {
        quiz_name: "sensuality_quiz",
        answered_count: answered,
        total_questions: questions.length,
      });
    }
  }, [answered]);

  const handleChange = (id, value) => {
    // mark first interaction → quiz_start
    if (!startedRef.current) {
      startedRef.current = true;
      const now = performance.now();
      firstAnswerAtRef.current = now;
      gaEvent("quiz_start", {
        quiz_name: "sensuality_quiz",
        time_to_first_answer_ms: Math.round(now - mountedAtRef.current),
      });
    }

    const qMeta = questions.find((q) => q.id === id);
    setResponses((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));

    gaEvent("select_answer", {
      quiz_name: "sensuality_quiz",
      question_id: String(id),
      dimension: qMeta?.dim || "Unknown",
      answer_value: String(value),
      question_index: questions.findIndex((q) => q.id === id) + 1,
    });
  };

  const submitNow = () => {
    gaEvent("submit_click", {
      quiz_name: "sensuality_quiz",
      complete,
      answered_count: answered,
      total_questions: questions.length,
      time_to_submit_ms: Math.round(performance.now() - mountedAtRef.current),
    });

    if (!complete) {
      // Mark all as touched and focus first missing
      const allTouched = questions.reduce(
        (acc, q) => ({ ...acc, [q.id]: true }),
        {}
      );
      setTouched(allTouched);
      const firstMissing = questions.find((q) => !responses[q.id]);
      gaEvent("submit_incomplete", {
        quiz_name: "sensuality_quiz",
        first_missing_id: firstMissing?.id ? String(firstMissing.id) : null,
        missing_count: questions.length - answered,
      });
      if (firstMissing) {
        const el = document.querySelector(`#q${firstMissing.id}-1`);
        if (el) el.focus();
      }
      return;
    }

    onSubmit(responses);
  };

  return (
    <form
      className="questionnaire"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <header className="q-header">
        <h2 className="q-title">Sensuality &amp; Connection Questionnaire</h2>
        <p className="q-subtitle">
          Explore how touch, sound, sight, scent, pacing, and emotional safety
          shape your experience of desire and intimacy.
        </p>

        <div className="q-progress" aria-live="polite">
          <div
            className="q-progress-bar"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
          <span className="q-progress-label">
            {answered}/{questions.length} answered
          </span>
        </div>
      </header>

      <div className="q-list">
        {questions.map((q) => {
          const current = responses[q.id];
          const showError = touched[q.id] && !current;
          const groupName = `q${q.id}`;
          return (
            <fieldset
              key={q.id}
              className={`q-item ${showError ? "q-item--error" : ""}`}
            >
              <legend className="q-text">
                <span
                  style={{ opacity: 0.7, fontWeight: 500, marginRight: 8 }}
                >
                  {q.dim} ·
                </span>
                {q.text}
              </legend>

              <div className="q-box">
                <div
                  className="likert"
                  role="radiogroup"
                  aria-label={q.text}
                >
                  {SCALE.map((opt) => {
                    const id = `${groupName}-${opt.value}`;
                    return (
                      <div className="likert-option" key={opt.value}>
                        <input
                          id={id}
                          className="likert-input"
                          type="radio"
                          name={groupName}
                          value={opt.value}
                          checked={current === opt.value}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                        />
                        <label htmlFor={id} className="radio-pill">
                          <span className="pill-label">{opt.label}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                {showError && (
                  <p className="q-hint">Please choose one option.</p>
                )}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="q-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={submitNow}
          disabled={!complete}
        >
          See My Insights
        </button>
      </div>
    </form>
  );
};

export default Questionnaire;
