import React from 'react'
import '../CaseAnalysis.css'
import banner from '../../../assets/case-analysis-banner.png'

const CurvedBanner = () => {
  return (
    <div className="caseanalysis-hero">
     <h1 className='caseanalysis-hero-text'> The Future of Legal Practice <br/> Starts Here </h1>
     <img src={banner} />
     </div>
  );
};

export default CurvedBanner;