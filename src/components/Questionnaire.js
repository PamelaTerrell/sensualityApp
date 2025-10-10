import React, { useEffect, useMemo, useState } from "react";

const questions = [
  { id: 1,  dim: "Touch", text: "Unhurried physical touch increases your desire." },
  { id: 2,  dim: "Touch", text: "Gentle pressure (e.g., a slow back-of-hand trace) heightens arousal." },
  { id: 3,  dim: "Music", text: "Sensual music or rhythm helps you drop into the mood." },
  { id: 4,  dim: "Visual", text: "Visual cues (outfit, lighting, body language) enhance your desire." },
  { id: 5,  dim: "Visual", text: "Warm, flattering lighting makes you feel more aroused." },
  { id: 6,  dim: "Scent", text: "Scent (natural skin, perfume, candles) meaningfully affects your desire." },
  { id: 7,  dim: "Taste", text: "Taste (wine, chocolate, flavored lip balm) adds to sensual enjoyment." },
  { id: 8,  dim: "Pace",  text: "Slow pacing and synced breathing help you feel turned on." },
  { id: 9,  dim: "Fantasy", text: "Anticipation and imagination (suggestive messages, daydreaming) build desire." },
  { id: 10, dim: "Environment", text: "A tidy, cozy environment helps you relax into sensuality." },
  { id: 11, dim: "Communication", text: "Verbal reassurance and attunement increase your arousal." },
  { id: 12, dim: "Anticipation", text: "Teasing or a slow build makes the experience more exciting." },
  { id: 13, dim: "Novelty", text: "Trying something slightly new (within your comfort) boosts your desire." },
  { id: 14, dim: "Power", text: "Gentle power dynamics (giving or receiving guidance) can feel erotic for you." },
  { id: 15, dim: "Aftercare", text: "Aftercare (cuddling, affirmations, softness) matters for your overall arousal." },
  { id: 16, dim: "Context", text: "Low stress and feeling emotionally safe are essential for desire." },
  { id: 17, dim: "Self-image", text: "Feeling confident in your body or outfit increases your desire." },
  { id: 18, dim: "Pace", text: "Resisting urgency and savoring each moment makes desire deepen naturally." },
  { id: 19, dim: "Connection", text: "You feel most aroused when there is mutual, enthusiastic response rather than obligation." }
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

  // Load initial answers when returning from results
  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      setResponses(initial);
      // mark filled ones as touched so UI looks consistent
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

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const submitNow = () => {
    if (!complete) {
      const allTouched = questions.reduce((acc, q) => ({ ...acc, [q.id]: true }), {});
      setTouched(allTouched);
      const firstMissing = questions.find((q) => !responses[q.id]);
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submitNow();
        }
      }}
    >
      <header className="q-header">
        <h2 className="q-title">Sensuality &amp; Desire Questionnaire</h2>
        <p className="q-subtitle">
          Explore what heightens your desire across touch, sound, sight, scent, and emotional pacing.
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
              aria-invalid={showError ? "true" : "false"}
            >
              <legend className="q-text">
                <span style={{ opacity: 0.7, fontWeight: 500, marginRight: 8 }}>
                  {q.dim} ·
                </span>
                {q.text}
              </legend>

              <div className="likert" role="radiogroup" aria-label={q.text}>
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

              {showError && <p className="q-hint">Please choose one option.</p>}
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
          aria-disabled={!complete}
        >
          See My Insights
        </button>
      </div>
    </form>
  );
};

export default Questionnaire;
