import React, { useState } from 'react';
import axios from 'axios';

const AICourtroom = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [caseText, setCaseText] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('file', pdfFile);

    const response = await axios.post('http://localhost:8000/upload/', formData);
    setCaseText(response.data.case_text);
  };

  const handleSimulate = async () => {
    const response = await axios.post('http://localhost:8000/simulate/', { case_text: caseText });
    setResult(response.data);
  };

  return (
    <div className="courtroom-container">
      <h2>⚖️ AI Courtroom</h2>

      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>📤 Upload PDF</button>

      {caseText && (
        <>
          <h3>📜 Case Preview:</h3>
          <pre>{caseText}</pre>
          <button onClick={handleSimulate}>⚖️ Simulate Debate</button>
        </>
      )}

      {result && (
        <div className="results">
          <h3>Defense:</h3>
          {result.defense.map((item, idx) => (
            <p key={idx}><strong>{item.role}</strong>: {item.content}</p>
          ))}
          <h3>Prosecution:</h3>
          {result.prosecution.map((item, idx) => (
            <p key={idx}><strong>{item.role}</strong>: {item.content}</p>
          ))}
          <h3>Rebuttal:</h3>
          {result.rebuttal.map((item, idx) => (
            <p key={idx}><strong>{item.role}</strong>: {item.content}</p>
          ))}
          <h3>Final Verdict:</h3>
          {result.verdict.map((item, idx) => (
            <p key={idx}><strong>{item.role}</strong>: {item.content}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AICourtroom;
