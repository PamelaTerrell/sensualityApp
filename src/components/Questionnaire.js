import React, { useState } from 'react';

const questions = [
  { id: 1, text: "Do you enjoy physical touch as a way to express desire?" },
  { id: 2, text: "Does sensual music enhance your arousal?" },
  { id: 3, text: "Do visual cues (e.g. lingerie, body language) stimulate you?" },
  { id: 4, text: "Does scent (perfume, natural) affect your level of desire?" },
];

const Questionnaire = ({ onSubmit }) => {
  const [responses, setResponses] = useState({});

  const handleChange = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(responses);
  };

  return (
    <form onSubmit={handleSubmit} className="questionnaire">
      <h2>Sensuality & Desire Questionnaire</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>
          <label>
            <input type="radio" name={`q${q.id}`} value="yes" onChange={() => handleChange(q.id, 'yes')} />
            Yes
          </label>
          <label>
            <input type="radio" name={`q${q.id}`} value="no" onChange={() => handleChange(q.id, 'no')} />
            No
          </label>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Questionnaire;
