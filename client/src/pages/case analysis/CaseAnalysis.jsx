import { useState } from 'react';
import './CaseAnalysis.css';
import Navbar from '../../components/Navbar';
import Common from './components/Common';
import Casestudy from './components/Casestudy';
import DummyCase from './components/DummyCase';
import CurvedBanner from './components/banner';

const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyA1uc2ju-sLgJ0tiW2yEIIFqqtZemWn2vg";

function CaseAnalysis() {
  const [selectedComponent, setSelectedComponent] = useState(''); // State to track the selected component

  return (
    <>
    <div className='case-container'>
      <Navbar />
      <CurvedBanner />
      <Common onSelect={setSelectedComponent} /> {/* Pass setSelectedComponent as a prop */}
      {selectedComponent === 'caseStudy' && <Casestudy apiUrl={apiUrl} />}
      {selectedComponent === 'dummyCase' && <DummyCase apiUrl={apiUrl} />}
      </div>
    </>
  );
}

export default CaseAnalysis;
