import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import lawyericon from '../assets/lawyer_icon.png'
import SpotlightCard from './spotlightcard';
import Carousel from './caraousel';
import Stepper, { Step } from './StepperCard'
import ReactDOM from 'react-dom';

const meetfunction = async (lawyerId) =>{
  let response = await axios.post('http://localhost:5000/payment', { lawyerId })
  if(response && response.status === 200 ){
    window.location.href = response.data.url
    console.log(response.data)}
}

const LawyerDetail = () => {
  const [name, setName] = useState('');
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [isStepperOpen, setIsStepperOpen] = useState(false);
  
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lawyers/${id}`);
        setLawyer(response.data);
      } catch (error) {
        console.error('Error fetching lawyer details:', error);
      }
    };
    fetchLawyer();
  }, [id]);


  if (!lawyer) {
    return <p>Loading...</p>;
  }

  return (
      <div className='lawyer-detail-background'>
        <Link to="/matchmaking"><span className="material-symbols-outlined details-back-button" style={{fontSize:'40px', color:'#000', margin: "0px auto"}}>arrow_back</span> </Link>
        <div className='lawyer-detail-innerbox'>
          <div className="black-strip"></div>  
          <img 
                src={lawyer.image_url || lawyericon}
                alt={lawyer.name}
                className="lawyer-detail-profile-image"
              />
          <h1>{lawyer.name}</h1>
          <div className='bento-grid'>
              <div className="bento-item bento-1">
                <div className="bento-1-container">
                  <div className="bento-1-part part-1">
                      <p style={{fontSize: '1.2rem'}}>{lawyer.long_introduction}</p>
                  </div>
                  <div className="bento-1-part part-2">
      
                      <div className="specializations">
                          {lawyer.specializations.map((spec, index) => (
                            <span key={index} className="golden-specialization-pill">
                              {spec}
                            </span>
                          ))}
                      </div>
                  </div>
                  <div className="bento-1-part part-3">
                      <p><span className="material-symbols-outlined">translate</span> <strong>Languages:</strong> {lawyer.languages.join(', ')}</p>
                      <p><span className="material-symbols-outlined">gavel</span> <strong>Type of Court:</strong> {lawyer.court_type}</p>
                      <p><span className="material-symbols-outlined">balance</span> <strong>Bar Council Number:</strong> ADH/120/123 </p>
                  </div>
                </div>
              </div>


              <div className="bento-item bento-2">
              <div className="scheduler-card">
                  <span className="material-symbols-outlined" style={{fontSize:'40px', color:'#000', margin: "0px auto"}}>Event</span>
                  <p class="scheduler-heading">Schedule an Appointment</p>
                  <p class="scheduler-information">Book Your Legal Consultation at <br/> Your Convenience.</p>
                  <button className="scheduler-button">Book Now</button>
                </div>
                <SpotlightCard>
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" focusable="false" class="chakra-icon css-1sxnxce" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path></svg>
                    <p class="spotcard-heading">Connect Now</p>
                    <p class="spotcard-information">Get direct access to {lawyer.name}'s contact information.</p>
                    <button className='spotcard-button' onClick={() => setIsStepperOpen(true)}>Learn more</button>
                    {isStepperOpen &&  ReactDOM.createPortal (
                    <div className="detail-modal-overlay">
                      <div className="detail-modal-content">
                        <button className="close-button" onClick={() => setIsStepperOpen(false)}>×</button>
                        <Stepper
                          initialStep={1}
                          onStepChange={(step) => console.log(step)}
                          onFinalStepCompleted={() => {
                            setIsStepperOpen(false);
                            meetfunction(lawyer.id);
                          }}
                          backButtonText="Previous"
                          nextButtonText="Next"
                        >
                              <Step>
                                <h2 style={{fontSize:"1.5rem"}}>Unlock Direct Access</h2>
                                <p style={{fontSize:"1.2rem", fontWeight:"600"}}> Get instant access to the lawyer's phone number and email upon payment.
                                You're just one step away from direct legal assistance!</p>
                              </Step>                    
                              <Step>
                              <h2 style={{fontSize:"1.5rem", marginBottom:"2%"}}>Confirm your Email</h2>
                              <p style={{fontSize:"1.2rem", fontWeight:"600",marginBottom:"2%"}}>Enter your email to receive the lawyer’s contact details in your inbox as well.</p>
                                <input
                                  value={name}
                                  onChange={(e) => {
                                    console.log("Input changed:", e.target.value);
                                    setName(e.target.value);
                                }}
                                  placeholder="Your name?"
                                  style={{width:"94%"}}
                                />
                              </Step>
                              <Step>
                                <h2 style={{fontSize:"1.5rem"}}>Complete Your Payment</h2>
                                <p style={{fontSize:"1.2rem", fontWeight:"600"}}>Complete your payment of ₹100 to unlock the lawyer’s contact details instantly.</p>
                              </Step>
                            </Stepper>
                            </div>
                            </div>, document.body
                          )}
              </SpotlightCard>
              </div>


              <div className="bento-item bento-3">
              <iframe src={lawyer.map_url}
                      style={{width: "100%", height: "100%", border: "0"}} 
                      allowfullscreen="" loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
              </iframe>
              </div>
              
              <div className="bento-item bento-4">                
                    <Carousel
                      lawyerId={id}
                      baseWidth={350}
                      autoplay={true}
                      autoplayDelay={1500}
                      pauseOnHover={true}
                      loop={true}
                      round={false}
                    />
              </div>
              <div className="bento-item bento-5">
                <h3 style={{paddingLeft:'3px'}}>Hear it from the Client</h3>
              <ul>
                  {lawyer.reviews.map((review, index) => (
                    <li key={index}>
                      <strong>{lawyer.reviewer_names[index]}:</strong> <br/>{review}
                    </li>
                  ))}
                </ul>
              </div>
          </div>
        </div>
      </div>


  );
};

export default LawyerDetail;
