import React, { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import Result from './components/Result';
import background from './assets/lingerie.jpg';

import './App.css';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  const handleFormSubmit = (answers) => {
    setResponses(answers);
    setSubmitted(true);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div className="App" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '10px', padding: '2rem' }}>
        <h1>Exploring Sensuality & Sexual Desire</h1>
        {!submitted ? (
          <Questionnaire onSubmit={handleFormSubmit} />
        ) : (
          <Result answers={responses} />
        )}
      </div>
    </div>
  );
}


export default App;
