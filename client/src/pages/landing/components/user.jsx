import React from 'react';
import './component.css'; 
import ClickSpark from '../../../components/cursor';
import legalimage from '../assets/match.png'
import chatimage from '../assets/chatb.png'
import docimage from '../assets/doc.png'
import aiimage from '../assets/ai.png'


const UserBanner = () => {
    
    return (
        <div className="user-hero">
        <ClickSpark>
            <h1 className='user-hero-text'>Who is NyaAI for?</h1>
            <p className='user-hero-secondary-text'>Explore features that boost your productivity. <br/>From document automation to advanced research, we've got the hard work covered.</p>
            <div className='user-cards-div'>
                <div className='user-card'>
                    <div className='user-card-title-info'>
                        <h1 className='user-card-title'>AI for Legal Professionals</h1>
                        <p className='user-card-info'>From contract analysis to case law research, streamline your legal workflow with AI-powered insights.</p>
                    </div>   
                </div>
                <div className='user-card'>
                    <div className='user-card-title-info'>
                        <h1 className='user-card-title'>AI for Law Students</h1>
                        <p className='user-card-info'>Simplify complex legal concepts, access case summaries, and enhance your legal studies efficiently.</p>
                    </div>
                </div>
                <div className='user-card'>
                    <div className='user-card-title-info'>
                        <h1 className='user-card-title'>AI for Businesses</h1>
                        <p className='user-card-info'>Navigate regulatory compliance, draft legal documents, and mitigate risks with AI-driven support.</p>
                    </div>
                </div>
                <div className='user-card'>
                    <div className='user-card-title-info'>
                        <h1 className='user-card-title'>AI for Individuals</h1>
                        <p className='user-card-info'>Get clear explanations of legal terms, rights, and processes to make informed decisions with confidence.</p>
                    </div>
                </div>
            </div>
            </ClickSpark>
        </div>
    );
};

export default UserBanner;
