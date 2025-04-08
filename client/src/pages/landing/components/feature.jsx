import React from 'react';
import './component.css'; 
import genai from '../assets/chatb.png'

const Features = () => {

    const FeatureCard = ({ title, description, className }) => {
        return (
          <div className={`feature-card ${className}`}>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        );
      };

    return (
        <div>
            <div className='feature-title'>Features of NyaAI</div>
            <div className='feature-subtitle'>
                <p>Explore features that boost your productivity. From document automation</p>
                <p>to advanced research, we've got the hard work covered.</p>
            </div>
            <div className="legal-services-container">
                <div className="legal-services-grid">
                    <div className="large-card">
                    <div className='lc-h'>Find Lawyers</div>
                    <p className='lc-p'>Connect with experienced lawyers across different domains based on your case requirements and preferences.</p>
                    <img src='https://res.cloudinary.com/da3alyb5h/image/upload/v1740421880/Legal_Match.jpg' alt='Legal' className='legal_match_img'/>
                    </div>
                    
                    <div className="wide-card">
                    <img src='https://res.cloudinary.com/da3alyb5h/image/upload/v1743225017/Chatbot_query_b0vqvx.png' alt='Legal' className='chatbot_img'/>
                    <div className='wc-h'>Ask Queries</div>
                    <p className='wc-p'>Get instant answers to legal queries, simplified explanations, and case law insights with our AI-driven chatbot.</p>
                    </div>
                    
                    {/* <div className="tall-card">
                    <div className='lc-h'>Draft Legal Docs</div>
                    <p className='tc-p'>Generate contracts, agreements, and legal documents with ease, customized to your specific needs.</p>
                    <img src='https://res.cloudinary.com/da3alyb5h/image/upload/v1740421880/Doc.jpg' alt='Legal' className='doc_img'/>
                    </div> */}
                    
                    <div className="tall-card">
                    <div className='lc-h'>Solve Case Study</div>
                    <p className='tc-p'>Analyze past cases, extract key arguments, and gain AI-powered recommendations for legal strategies</p>
                    <img src='https://res.cloudinary.com/da3alyb5h/image/upload/v1743225018/Verdict_vista_ctkv87.png' alt='Legal' className='doc_img'/>
                    </div>

                    {/* <div className="yellow-card">
                    <div className='yc-h'>Gen-AI Powered</div>
                    <p className='yc-p'>From deciphering complex terms to understanding rights, we've got you covered.</p>
                     </div> */}
                    
                    <div className="yellow-card">
                    <div className='yc-h'>Voice Assistant for Scheduling</div>
                    <p className='yc-p'>Effortlessly manage appointments, court schedules, and lawyer meetings with voice commands. Syncs with calendar, sends reminders, and prevents scheduling conflicts.</p>
                     </div>

                    <div className="service-card1">
                    <div className='sc-h'>Gen-AI Powered</div>
                    <p className='tc-p'>Our Gen AI-powered assistant helps you decipher complex legal terms, understand your rights, and navigate legal procedures with clear, reliable explanations.</p>
                    </div>
                </div>
                </div>
        </div>
    )
}

export default Features;