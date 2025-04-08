import React, { useState } from "react";
import axios from "axios";
import "../CaseAnalysis.css"; // Ensure this import path is correct
import ReactMarkdown from 'react-markdown';

export const Casestudy = ({ apiUrl }) => {
    const [userCase, setUserCase] = useState("");
    const [solution, setSolution] = useState("");
    const [loading, setLoading] = useState(false);

    const solveCaseStudy = async (caseStudy) => {
        setLoading(true);
        const prompt = `
          As a legal expert in Indian law, analyze and provide a solution for the following case study:

          ${caseStudy}

          Provide a detailed analysis including:
          1. A summary of the key legal issues
          2. Potential arguments for both sides
          3. At least three relevant Indian legal precedents (actual previous cases) with brief explanations of how they relate to this case
          4. A suggested course of action based on Indian laws and regulations
          5. Any potential challenges or counterarguments to consider

          Please ensure that the previous cases mentioned are real Indian legal cases with proper citations.
        `;

        console.log(apiUrl);

        try {
            const response = await axios.post(apiUrl, { "contents": [{ "parts": [{ "text": prompt }] }] });
            setSolution(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error generating solution:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="case-container">
                <div className="casename-text">
                    <h3 className="casename-h3">Solve My Case Study</h3>
                    <p className="casename-p">An AI powered Case Study Solver, leveraging various algorithmic techniques to solve complex cases in minutes.</p>
                </div>
            <div className="case-container-div">
                <div className="case-enter_text">Enter your Case Study Scenario</div>
                    <textarea
                        className="case-textarea1"
                        placeholder="Type here...."
                        value={userCase}
                        onChange={(e) => setUserCase(e.target.value)}
                    ></textarea>
                <button className="case-submitbtn" onClick={() => solveCaseStudy(userCase)} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {solution && (
                    <div className="casesolution-container">
                        <div className="casesolution-box">
                            <ReactMarkdown>{solution}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Casestudy;
