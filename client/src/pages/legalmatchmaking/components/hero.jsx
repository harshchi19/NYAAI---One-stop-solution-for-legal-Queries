import React from 'react';
import heroImage from '../assets/hero_image.svg';
import GradientText from './GradientText';

function Hero() {
    return (
        <div class="hero-container">
        <div class="text-div">
            <h1>Unlock the power of<br/>
            <GradientText
                colors={["rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)", "rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)","rgba(253, 202, 0, 1)"]}
                animationSpeed={5}
                showBorder={false}
                className="gold-colour"
                >Legal Expertise
                </GradientText> Online.</h1>
         </div>
        <div class="image-div">
        <img src={heroImage} alt="Hero Image"/>
        </div>
        </div>
    );
}

export default Hero;