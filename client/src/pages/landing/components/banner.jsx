import React from 'react';
import './component.css'; 
import BannerBoy from '../assets/banner_boy.png'
import BannerIcon1 from '../assets/banner_icon_1.png'
import BannerIcon2 from '../assets/banner_icon_2.png'
import BannerIcon3 from '../assets/banner_icon_3.png'
import { useNavigate } from 'react-router-dom'
import GradientText from '../../legalmatchmaking/components/GradientText'

const HeroBanner = () => {
    
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate('/login'); 
      };

    return (
        <div className="land-hero">
            {/* Left Section */}
            <div className="left-section" style={{ animation: 'fadeIn 2s ease-in-out' }}>
                <h1 className="banner-heading"> Smart
                <GradientText
                                    colors={["rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)", "rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)","rgba(253, 202, 0, 1)"]}
                                    animationSpeed={5}
                                    showBorder={false}
                                    className="gold-colour"
                                    >Legal Solutions</GradientText>
                    Powered by AI and Innovation
                </h1>
                <button class="learn-more" id='navgate-btn'>
                    <span class="circle" aria-hidden="true">
                    <span class="icon arrow"></span>
                    </span>
                    <span class="button-text" onClick={handleNavigateToLogin}>Get Started</span>
                    </button>
            </div>

            {/* Center Section */}
            <div className="center-section">
                <img 
                    src={BannerBoy} 
                    alt="Professional Illustration" 
                    className="illustration" 
                />
            </div>

            {/* Right Section */}
            <div className="right-section">
                <div className="icon-circle1">
                    <img src={BannerIcon3} alt="Icon 1" />
                </div>
                <div className="icon-circle2">
                    <img src={BannerIcon1} alt="Icon 2" />
                </div>
                <div className="icon-circle3">
                    <img src={BannerIcon2} alt="Icon 3" />
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
