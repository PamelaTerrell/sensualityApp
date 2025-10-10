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
  if (avg >= 1.8) return "Gentle/Selective";
  return "Subtle/Context-dependent";
}

function suggestionFor(top) {
  switch (top) {
    case "Touch": return "Lean into warm, unhurried touch—hand massage, slow embraces, or shared stretching.";
    case "Music": return "Build a mood playlist; dim lights and let rhythm guide breathing and pacing.";
    case "Visual": return "Curate the scene—soft fabrics, flattering light, outfits that make you feel radiant.";
    case "Scent": return "Experiment with aroma—skin-close fragrances, a hint of vanilla, or fresh linen.";
    case "Taste": return "Add small delights (a square of chocolate, a sip of wine) to anchor attention in the senses.";
    case "Pace": return "Resist urgency; slow the tempo and sync breathing—let anticipation deepen naturally.";
    case "Fantasy": return "Seed the day with imagination—suggestive notes or daydreams that build anticipation.";
    case "Environment": return "Tidy, cozy spaces reduce distraction—soft textiles and warm light deepen relaxation.";
    case "Communication": return "Gentle check-ins and reassurance keep the nervous system calm and open.";
    case "Anticipation": return "Tease, pause, and return—let the build make the moment feel inevitable.";
    case "Novelty": return "Try one small new element within your comfort zone to spark curiosity.";
    case "Power": return "Light guidance or being guided can heighten focus—agree on signals and limits.";
    case "Aftercare": return "Plan softness after—cuddles, water, affirmations—to make the experience feel complete.";
    case "Context": return "Lower stress first—warm shower, stretch, or a short walk can reset the tone.";
    case "Self-image": return "Wear something that makes you feel great—confidence is a powerful accelerator.";
    case "Connection": return "Prioritize mutual enthusiasm—respond to what feels alive for both of you.";
    default: return "Follow what feels calm, grounded, and connected—small signals often open big doors.";
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
      <section className="result-card" role="region" aria-labelledby="result-title" tabIndex="-1">
        <h2 id="result-title" className="result-title">Your Sensuality Profile</h2>
        <p className="insight">No answers detected. Please complete the questionnaire to see your results.</p>
        <div className="result-actions">
          <button className="btn-primary" onClick={() => (onRestart ? onRestart() : window.location.reload())}>
            Start over
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="result-card" role="region" aria-labelledby="result-title" tabIndex="-1">
      <header className="result-head">
        <h2 id="result-title" className="result-title">Your Sensuality Profile</h2>
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
          aria-label="Overall responsiveness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="meter-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="result-note">
          Based on {stats.count} prompts. Scale adapts to Yes/No (mapped to low/high) or 1–5 choices.
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
            You seem <strong>open and responsive</strong> across multiple cues. Try layering your favorites for deeper immersion.
          </p>
        ) : stats.avg >= 2.6 ? (
          <p>
            Your responsiveness looks <strong>situational</strong>—the right context unlocks more. Small shifts in mood and setting can
            make a big difference.
          </p>
        ) : (
          <p>
            Your preferences appear <strong>subtle or selective</strong>. Go slow and notice the signals that reliably feel calming and
            inviting.
          </p>
        )}

        <p className="tip">
          <em>
            Genuine desire thrives with relaxed pacing and enthusiastic connection—resisting urgency invites deeper attunement and
            mutual excitement.
          </em>
        </p>

        {stats.top && (
          <p className="tip">
            <strong>Next step:</strong> {tip}
          </p>
        )}
      </div>

      <div className="result-actions">
        <button
          className="btn-primary"
          onClick={() => (onRestart ? onRestart() : window.location.reload())}
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
