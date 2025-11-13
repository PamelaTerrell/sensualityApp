import React, { useMemo } from "react";

/** Dimension map aligned to your 19-question set */
const DIMENSIONS = {
  1: "Touch", 2: "Touch",
  3: "Music",
  4: "Visual", 5: "Visual",
  6: "Scent", 7: "Taste",
  8: "Pace",
  9: "Fantasy",
  10: "Environment",
  11: "Communication",
  12: "Anticipation",
  13: "Novelty",
  14: "Power",
  15: "Aftercare",
  16: "Context",
  17: "Self-image",
  18: "Pace",
  19: "Connection",
};

function normalize(value) {
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "yes") return 5;
    if (v === "no") return 1;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return Math.min(5, Math.max(1, n));
  }
  if (typeof value === "number") return Math.min(5, Math.max(1, value));
  return 0;
}

function tierLabel(avg) {
  if (avg >= 4.2) return "Elevated Responsiveness";
  if (avg >= 3.4) return "Highly Responsive";
  if (avg >= 2.6) return "Situational";
  if (avg >= 1.8) return "Gentle / Selective";
  return "Subtle / Context-dependent";
}

function suggestionFor(top) {
  switch (top) {
    case "Touch":
      return "Lean into warm, unhurried touch—hand massage, slow embraces, or shared stretching that lets your body unwind.";
    case "Music":
      return "Create a mood playlist; soften the lighting and let rhythm guide breathing, pacing, and presence together.";
    case "Visual":
      return "Curate the scene—soft fabrics, flattering light, and outfits that make you feel confident and fully yourself.";
    case "Scent":
      return "Experiment with aroma—skin-close fragrances, a hint of vanilla, fresh linen, or candles that anchor you in the moment.";
    case "Taste":
      return "Add small delights (a square of chocolate, a favorite drink, shared bites) to keep your attention grounded in the senses.";
    case "Pace":
      return "Resist urgency; slow the tempo, sync your breathing, and let anticipation build instead of rushing the moment.";
    case "Fantasy":
      return "Seed the day with imagination—playful messages, shared plans, or daydreams that gently build anticipation.";
    case "Environment":
      return "Shape your surroundings—tidy, cozy spaces with soft textiles and warm light help your body relax and open up.";
    case "Communication":
      return "Use gentle check-ins, appreciation, and reassurance to keep the nervous system calm, connected, and receptive.";
    case "Anticipation":
      return "Let there be a build—tease, pause, and return, so the moment feels intentional, not rushed.";
    case "Novelty":
      return "Introduce one small new element within your comfort zone to spark curiosity and fresh energy.";
    case "Power":
      return "Experiment with light guidance or being guided in ways that feel safe—agree on cues, limits, and mutual enthusiasm.";
    case "Aftercare":
      return "Plan softness afterwards—cuddles, grounding touch, water, or affirming words so the experience feels complete and held.";
    case "Context":
      return "Lower stress first—a warm shower, stretching, or a short walk can reset your system and make space for desire.";
    case "Self-image":
      return "Choose clothing, rituals, or grooming that make you feel good in your body; confidence itself is a strong amplifier.";
    case "Connection":
      return "Prioritize clear, mutual enthusiasm—respond to what feels alive for both of you, and let that guide the pace.";
    default:
      return "Keep following what feels calm, grounded, and mutually connected—small signals often open the most meaningful doors.";
  }
}

const Result = ({ answers = {}, onRestart, onAdjust }) => {
  const stats = useMemo(() => {
    const ids = Object.keys(answers);
    const count = ids.length;
    if (!count) return { count: 0, avg: 0, dims: [], top: undefined };

    let total = 0;
    const byDim = {};
    ids.forEach((idStr) => {
      const id = Number(idStr);
      const dim = DIMENSIONS[id] || "Other";
      const val = normalize(answers[idStr]);
      total += val;
      if (!byDim[dim]) byDim[dim] = { sum: 0, n: 0 };
      byDim[dim].sum += val;
      byDim[dim].n += 1;
    });

    const avg = total / count;
    const dims = Object.entries(byDim).map(([name, { sum, n }]) => ({
      name,
      score: n ? sum / n : 0,
    }));
    dims.sort((a, b) => b.score - a.score);
    const top = dims[0]?.name;

    return { count, avg, dims, top };
  }, [answers]);

  const percent = Math.round((stats.avg / 5) * 100);
  const profile = tierLabel(stats.avg);
  const tip = suggestionFor(stats.top);

  if (stats.count === 0) {
    return (
      <section
        className="result-card"
        role="region"
        aria-labelledby="result-title"
        tabIndex="-1"
      >
        <h2 id="result-title" className="result-title">
          Your Sensuality Profile
        </h2>
        <p className="insight">
          No answers detected. Please complete the questionnaire to see your
          personalized insights.
        </p>
        <div className="result-actions">
          <button
            className="btn-primary"
            onClick={() =>
              onRestart ? onRestart() : window.location.reload()
            }
          >
            Start over
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="result-card"
      role="region"
      aria-labelledby="result-title"
      tabIndex="-1"
    >
      <header className="result-head">
        <h2 id="result-title" className="result-title">
          Your Sensuality Profile
        </h2>
        <span className="result-badge" title="Overall responsiveness tier">
          {profile}
        </span>
      </header>

      <div className="overall">
        <div className="overall-label">
          <span>Overall responsiveness</span>
          <span className="overall-value">{percent}%</span>
        </div>
        <div
          className="meter"
          role="progressbar"
          aria-label="Overall sensual responsiveness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="meter-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="result-note">
          Based on {stats.count} prompts. Higher percentages reflect stronger
          responsiveness to sensual and emotional cues across the quiz.
        </p>
      </div>

      <div className="dim-grid">
        {stats.dims.map((d) => {
          const pct = Math.round((d.score / 5) * 100);
          return (
            <div className="dim-card" key={d.name}>
              <div className="dim-row">
                <span className="dim-name">{d.name}</span>
                <span className="dim-val">{pct}%</span>
              </div>
              <div
                className="meter meter--sm"
                role="progressbar"
                aria-label={`${d.name} responsiveness`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className="meter-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="insight">
        {stats.avg >= 3.4 ? (
          <p>
            You appear{" "}
            <strong>open and responsive across multiple cues</strong>. You may
            find that layering your favorite senses—like touch, music, or
            lighting—creates especially rich, memorable moments.
          </p>
        ) : stats.avg >= 2.6 ? (
          <p>
            Your responsiveness looks{" "}
            <strong>situational and context-dependent</strong>. The right mood,
            timing, and environment can unlock much deeper sensual and emotional
            engagement for you.
          </p>
        ) : (
          <p>
            Your preferences appear{" "}
            <strong>subtle or highly selective</strong>. Going slowly, honoring
            your boundaries, and noticing what genuinely feels inviting can make
            your experiences more grounded and satisfying.
          </p>
        )}

        <p className="tip">
          <em>
            Genuine desire tends to flourish with relaxed pacing, clear
            consent, and mutual enthusiasm—stepping away from urgency often
            invites deeper attunement and shared connection.
          </em>
        </p>

        {stats.top && (
          <p className="tip">
            <strong>Where to focus next:</strong> {tip}
          </p>
        )}
      </div>

      <div className="result-actions">
        <button
          className="btn-primary"
          onClick={() =>
            onRestart ? onRestart() : window.location.reload()
          }
        >
          Start over
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            if (onAdjust) onAdjust();
          }}
        >
          Adjust answers
        </button>
      </div>
    </section>
  );
};

export default Result;
