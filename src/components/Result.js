import React from 'react';

const Result = ({ answers }) => {
  const yesCount = Object.values(answers).filter(a => a === 'yes').length;

  return (
    <div className="results">
      <h2>Your Sensuality Profile</h2>
      <p>You responded "Yes" to {yesCount} out of {Object.keys(answers).length} prompts.</p>

      {yesCount >= 3 ? (
        <p>You appear to be highly in tune with your sensual side and responsive to various stimuli.</p>
      ) : (
        <p>You may have a more selective or situational approach to sensuality and desire.</p>
      )}
    </div>
  );
};

export default Result;
