  import {React,useState,useEffect,useContext} from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import LandingPage from './pages/landing page/LandingPage';
  import MatchMaking from './pages/legalmatchmaking/MatchMaking';
  import LawyerDetail from './pages/legalmatchmaking/components/LawyerDetail';
  import DocGenerator from './pages/docgenerator/DocGenerator';
  import CaseAnalysis from './pages/case analysis/CaseAnalysis';
  import Chatbot from './pages/chatbot/Chatbot';
  import Landing from './pages/landing/Landing';
  import Login from './pages/login-page/Login';
  import ForgotPassword from './pages/login-page/components/ForgotPassword';
  import Sign_Up from './pages/login-page/components/Sign_Up';
  import CApp from './pages/calendar-bot/src/CApp.tsx'
  import PrivateRoute from './PrivateRoutes';
  import LegalNews from './pages/News/LegalNews.jsx';
  import LegalPathFlow from './pages/react-flow/reactflow.jsx';
  import AICourtroom from './pages/ai_courtroom/AICourtroom.jsx';
  import { AuthContext } from './context/AuthContext.jsx';
  import { Toaster } from 'react-hot-toast';  

  const App = () => {

    const { user } = useContext(AuthContext);


    return (
      <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path='/' element={<Landing />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Sign_Up />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/*Private Routes*/}
          <Route element={<PrivateRoute />}>
            <Route path="/homepage" element={<LandingPage />} />
            <Route path="/matchmaking" element={<MatchMaking />} />
            <Route path="/lawyer/:id" element={<LawyerDetail />} />
            <Route path="/docgenerator" element={<DocGenerator />} />
            <Route path="/caseanalysis" element={<CaseAnalysis />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/calendar" element={<CApp />} />
            <Route path="/news" element={<LegalNews />} />
            <Route path="/flow" element={<LegalPathFlow />} />
            <Route path="/ai-courtroom" element={<AICourtroom />} />
          </Route>
        </Routes>
      </Router>
      </>
    );
  };

  export default App;
