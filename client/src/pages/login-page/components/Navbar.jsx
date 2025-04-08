import React from "react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const HandleSingnUp = () => {
        if (location.pathname === "/login") {
          navigate("/register");
        } else if (location.pathname === "/register") {
          navigate("/login");
        }
      };

    return (
        <nav>
            <img 
                src = {logo}
                width = '58px'
                height= '58px'
            />
            <div className="nav-title"><b>NyaAI</b></div>
            <button className="register-button" type="button" onClick={HandleSingnUp}>
                <b className="signup-register-button">{location.pathname === "/login" ? "Register / SignUp" : "Continue to Login"}</b>    
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="licon" >
                    <circle cx="20.5" cy="20.5" r="20.5" fill="black"  />
                    <g filter="url(#filter0_d_118_53)" className="arrow">
                        <path  d="M28.8937 15.0908C28.9412 14.629 28.8038 14.1671 28.5116 13.8063C28.2195 13.4455 27.7963 13.2151 27.3346 13.1655L17.4805 12.1298C17.2517 12.1058 17.0204 12.127 16.7999 12.1924C16.5793 12.2577 16.3737 12.3658 16.195 12.5106C15.8339 12.803 15.6038 13.2268 15.5552 13.6889C15.5066 14.151 15.6436 14.6134 15.936 14.9745C16.2284 15.3355 16.6522 15.5657 17.1143 15.6142L22.7627 16.2079L12.9814 24.1286C12.6204 24.4209 12.3903 24.8447 12.3418 25.3067C12.2932 25.7687 12.4302 26.2311 12.7225 26.5921C13.0149 26.9531 13.4387 27.1832 13.9007 27.2318C14.3627 27.2803 14.825 27.1434 15.186 26.851L24.9673 18.9303L24.3736 24.5787C24.3495 24.8075 24.3708 25.0388 24.4361 25.2594C24.5015 25.4799 24.6096 25.6855 24.7544 25.8643C24.8992 26.043 25.0777 26.1916 25.2799 26.3013C25.4821 26.4111 25.7039 26.48 25.9327 26.504C26.1615 26.5281 26.3928 26.5068 26.6133 26.4415C26.8339 26.3761 27.0395 26.268 27.2182 26.1232C27.397 25.9784 27.5455 25.7999 27.6553 25.5977C27.7651 25.3955 27.834 25.1737 27.858 24.9449L28.8937 15.0908Z" fill="white"/>
                    </g>
                    <defs>
                        <filter id="filter0_d_118_53" x="8.33228" y="9.12021" width="24.5706" height="23.1212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="1"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_118_53"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_118_53" result="shape"/>
                        </filter>
                        <linearGradient id="paint0_linear_118_53" x1="20.5972" y1="6.30769" x2="44.7563" y2="9.87367" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FDCA00"/>
                        <stop offset="1" stop-color="#B78628"/>
                        </linearGradient>
                    </defs>
                </svg>
            </button>
        </nav>
    )
}

export default Navbar