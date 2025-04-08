import {React,useEffect} from 'react';
import { Link } from 'react-router-dom';
import lawyericon from '../assets/lawyer_icon.png';
import { FaBriefcase, FaLanguage, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';


const LawyerCard = ({ lawyer }) => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  console.log(lawyer);
  const lawyerId = lawyer.id
  const decodedImageUrl = lawyer.image_url ? decodeURIComponent(lawyer.image_url) : lawyericon;
  console.log(decodedImageUrl);

  const meetfunction = async (lawyerId) =>{
    let response = await axios.post('http://localhost:5000/payment', { lawyerId })
    if(response && response.status === 200 ){
      window.location.href = response.data.url
      console.log(response.data)}
  }
  
  return (
    <div className="lawyer-card">
      <div className="card-content">
        <div className="image-container">
          <img 
            src={decodedImageUrl}  
            alt={lawyer.name}
            className="profile-image"
          />
        </div>

        
        <div className="content-container">  
          <h2 className="lawyer-name">{lawyer.name}</h2>
          <hr className="separator" />
          <div className="specializations">
            {lawyer.specializations.map((spec, index) => (
              <span key={index} className="specialization-pill">
                {spec}
              </span>
            ))}
          </div>
          

          <p className="match-description">{lawyer.long_introduction}</p>
          <div className="info-points">
            <div className="info-point">
              <FaBriefcase className="info-icon" />
              <span>{lawyer.experience_years}+Yrs Experience</span>
            </div>
            <div className="info-point">
              <FaLanguage className="info-icon" />
              <span>{lawyer.languages.join(', ')}</span>
            </div>
            <div className="info-point">
              <FaMapMarkerAlt className="info-icon" />
              <span>
                {lawyer.location_full_address}, {lawyer.location_city}
              </span>
            </div>
          </div>

          <div className="card-button-container">
            {/* Fillout Embed Button */}
            <div 
              data-fillout-id="idQFi62715us" 
              data-fillout-embed-type="popup" 
              data-fillout-button-text="Connect Now" 
              data-fillout-dynamic-resize 
              data-fillout-button-color="#FCB900" 
              data-fillout-inherit-parameters 
              data-fillout-popup-size="medium"
            ></div>
            <Link to={`/lawyer/${lawyer.id}`}>
              <button className="contact-lawyer-button">More Details</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
