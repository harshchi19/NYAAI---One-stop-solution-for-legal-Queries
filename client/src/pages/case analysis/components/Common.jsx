import React from "react";

export const Common = ({ onSelect }) => { // Receive onSelect as a prop

    return (
            <div className="case-buttons">
                <button className="case-btn" onClick={() => onSelect('caseStudy')}>Solve My Case Study</button>
                <button className="case-btn" onClick={() => onSelect('dummyCase')}>Practise with Dummy Case</button>
            </div>
    );
}

export default Common;
