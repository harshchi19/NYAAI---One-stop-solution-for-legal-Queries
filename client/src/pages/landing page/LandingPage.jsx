import {React,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Navbar from '../../components/Navbar';
import CurvedBanner from './components/banner';
import logo from '../../assets/logo.png'
import docgenerator from '../../assets/legal doc.png'
import matchmaker from '../../assets/matchmaking.png'
import caseanalysis from '../../assets/caseanalysis.png'
import chtbot from '../../assets/chatbot.png'
import {motion} from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleNavigateToMatchMaking = () => {
    navigate('/matchmaking'); // Redirects to the MatchMaking page
  };

  const handleNavigateToDocGenrator = () => {
    navigate('/docgenerator'); // Redirects to the MatchMaking page
  };

  const handleNavigateToCaseAnalysis = () => {
    navigate('/caseanalysis'); // Redirects to the MatchMaking page
  };

  const handleNavigateToChatbot = () => {
    navigate('/chatbot'); // Redirects to the Chatbot page
  };



  return (
    <div className="landing-page">
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity:0}}
        transition={{duration:1.3}}>
      <Navbar />
      <CurvedBanner />
      <main>
          <div className='card-container'>
          <div className="card">
          <div className="profile-pic">
            <img
              src={matchmaker}
              width="500"
              height="600"
            />
          </div>
          <div className="bottom" style={{'--card-bg': 'linear-gradient(180deg, rgba(255,69,69,1) 0%, rgba(225,167,202,1) 100%)'}}>
            <div className="content">
              <span className="name"> Advocate Ally</span>
              <span className="about-me">
              Find the right lawyer, effortlessly.
              </span>
            </div>
            <div className="bottom-bottom">
              <button className="button" onClick={handleNavigateToMatchMaking}>
          Explore Legal Matchmaking
        </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="profile-pic" >
            <img
              src={chtbot}
            />
          </div>
          <div className="bottom" style={{'--card-bg': "linear-gradient(180deg, rgba(0,107,255,1) 0%, rgba(248,182,248,1) 100%)"}}>
            <div className="content">
              <span className="name">Justice Genie</span>
              <span className="about-me">
              Smart legal advice, instantly.
              </span>
            </div>
            <div className="bottom-bottom">
              <button className="button" onClick={handleNavigateToChatbot}>
          Explore Legal Chatbot
        </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="profile-pic">
            <img
              src={docgenerator}
              width="500"
              height="600"
            />
          </div>
          <div className="bottom" style={{'--card-bg': "linear-gradient(180deg, rgba(255,145,77,1) 0%, rgba(255,222,89,1) 100%)  "}}>
            <div className="content">
              <span className="name">DocDrafter</span>
              <span className="about-me">
              Your legal drafts, automated
              </span>
            </div>
            <div className="bottom-bottom">
              <button className="button" onClick={handleNavigateToDocGenrator}>
          Explore Legal Doc Generator
        </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="profile-pic">
            <img
              src={caseanalysis}
              width="500"
              height="600"
            />
          </div>
          <div className="bottom" style={{'--card-bg': 'linear-gradient(180deg, rgba(3,170,200,1) 0%, rgba(126,217,87,1) 100%)'}}>
            <div className="content">
              <span className="name">Case Compass</span>
              <span className="about-me">
              Analyze and resolve, step by step
              </span>
            </div>
            <div className="bottom-bottom">
              <button className="button" onClick={handleNavigateToCaseAnalysis}>
          Explore Legal Case Analysis
        </button>
            </div>
          </div>
        </div>
        </div>
      </main>
      </motion.div>
      <div className="fixed bottom-4 right-4 z-50">
        <elevenlabs-convai agent-id="FW1OcvnKtOuGDUbFJJQy"></elevenlabs-convai>
      </div>
    </div>
  );
};

export default LandingPage;
