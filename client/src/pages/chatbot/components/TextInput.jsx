import React from 'react';
import sendArrow from '../assets/arrow-button.svg'

const TextInput = ({ question, setQuestion, handleClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleClick(); 
    }
  };
  return (
    <div className="text-image">
      <textarea
        className="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        cols={30}
        rows={10}
        placeholder="How can NyaAI help you today?"
        onKeyDown={handleKeyDown}
      ></textarea>
      <div className="img1" onClick={handleClick}>
        <img className="vector" alt="vector" src={sendArrow} />
      </div>
    </div>
  );
};

export default TextInput;
