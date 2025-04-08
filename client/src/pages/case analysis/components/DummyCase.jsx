import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const legalDomains = [
  "Criminal Law",
  "Civil Law",
  "Constitutional Law",
  "Corporate and Commercial Law",
  "Family Law",
  "Labor and Employment Law",
  "Environmental Law",
  "Intellectual Property Law",
  "Tax Law",
  "Administrative Law",
];

export const DummyCase = ({ apiUrl }) => {
  const [selectedDomain, setSelectedDomain] = useState(legalDomains[0]);
  const [dummyCase, setDummyCase] = useState(null);
  const [dummySolution, setDummySolution] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDummyCase = async (domain) => {
    setLoading(true);
    const casePrompt = `
      Generate a complex legal case study scenario related to Indian ${domain} where a lawyer might get stuck during a hearing. Include details about the case, the point of contention, and any relevant background information. Focus on Indian legal context and issues specific to ${domain}.
    `;

    try {
      const caseResponse = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: casePrompt }] }],
      });
      setDummyCase(caseResponse.data.candidates[0].content.parts[0].text);
      setDummySolution(null); // Reset the solution when a new case is generated
    } catch (error) {
      console.error("Error generating dummy case:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDummySolution = async (domain, caseText) => {
    setLoading(true);
    const solutionPrompt = `
      Provide a detailed solution and analysis for the following Indian legal case study in the domain of ${domain}:

      ${caseText}

      Your analysis should include:
      1. A summary of the key legal issues
      2. Potential arguments for both sides
      3. At least three relevant Indian legal precedents (actual previous cases) with brief explanations of how they relate to this case
      4. A suggested course of action based on Indian laws and regulations
      5. Any potential challenges or counterarguments to consider

      Please ensure that the previous cases mentioned are real Indian legal cases with proper citations.
    `;

    try {
      const solutionResponse = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: solutionPrompt }] }],
      });

      setDummySolution(solutionResponse.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error generating dummy solution:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="case-container">
      <div className="casename-text">
                    <h3 className="casename-h3">Dummy Case</h3>
                    <p className="casename-p">An AI powered Dummy Case Genrator, leveraging various algorithmic techniques to provide you complex cases in minutes.</p>
      </div>
      <div className="case-container2">
        <div className="CaseType">
          <div className="case">
            Select Case Type:
            <input
              type="text"
              placeholder="Case"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              onClick={() => setSelectedDomain("")}
              list="legalDomains"
            />
            <datalist id="legalDomains">
              {legalDomains.map((domain, index) => (
                <option key={index} value={domain} />
              ))}
            </datalist>
          </div>
          <button
            className="dum-btn"
            onClick={() => generateDummyCase(selectedDomain)} // Pass the domain here
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {dummyCase && (
        <>
        <div className="t">Case Problem Statement:</div>
          <div className="text-area-container1">
            <div className="textarea2">
      <ReactMarkdown>{dummyCase}</ReactMarkdown>
    </div>
          </div>
          </>
        )}

        {dummyCase && (
          <button
            className="dum-btn"
            style={{"margin": "1% 1.5%", "width":"max-content"}}
            onClick={() => generateDummySolution(selectedDomain, dummyCase)} // Generate solution only when the button is clicked
            disabled={loading}
          >
            {loading ? "Checking Solution..." : "Check Solution"}
          </button>
        )}

        {dummySolution && (
          <div className="casesolution-container">
            <div className="casesolution-box">
              <ReactMarkdown>{dummySolution}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DummyCase;
