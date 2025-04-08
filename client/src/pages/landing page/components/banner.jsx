import React, { useContext } from "react";
import { AuthContext  } from '/src/context/AuthContext';
import '../LandingPage.css';
import banner from '../../../assets/banner.png';

const CurvedBanner = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="homepage-hero">
      <h1 className='homepage-hero-text'>Namaste, {user ? user.fullname : 'NyaAIites'}</h1>
      <img src={banner} alt="Banner" />
    </div>
  );
};

export default CurvedBanner;
