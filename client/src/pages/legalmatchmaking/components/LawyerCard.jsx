import React from 'react';
import { Link } from 'react-router-dom';
import lawyericon from '../assets/lawyer_icon.png'

const LawyerCard = ({ lawyer }) => {
  return (
    <div className='card-div'>
      <div className="parent">
        <div className="lawyer-div1">
          <img 
            src={lawyericon} // Placeholder image, you can replace it with lawyer's image URL
            alt={lawyer.name}
            className="profile-image"
          />
        </div>
        <div className="div2">
          <h2 className="name">{lawyer.name}</h2>
        </div>
        <div className="div3">
          <p className="description">{lawyer.short_introduction}</p>
        </div>
        <div className="div4">
          <span>Specialization:</span> {lawyer.specializations.join(', ')}
        </div>
        <div className="div5">
          <span>Location:</span> {lawyer.location_full_address}, {lawyer.location_city}
        </div>
        <div className="div6">
          <span>Experience:</span> {lawyer.experience_years} Years
        </div>
        <div className="div7">
          <span>Language:</span> {lawyer.languages.join(', ')}
        </div>
      </div>
      <Link to={`/lawyer/${lawyer.id}`}>
        <button className="more-details">More Details</button>
      </Link>
    </div>
  );
};

export default LawyerCard;
