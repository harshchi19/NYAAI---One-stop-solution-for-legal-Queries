import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddLawyer = () => {
  const [lawyerData, setLawyerData] = useState({
    name: '',
    long_introduction: '',
    location_full_address: '',
    location_city: '',
    experience_years: '',
    email: '',
    social_media_links: '',
    languages: '',
    specializations: '',
    contact_numbers: '',
    court_type: '',
    reviews: '',
    reviewer_names: ''
  });

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/lawyers', {
        ...lawyerData,
        languages: lawyerData.languages.split(',').map(lang => lang.trim()),
        specializations: lawyerData.specializations.split(',').map(spec => spec.trim()),
        contact_numbers: lawyerData.contact_numbers.split(',').map(num => num.trim()),
        reviews: lawyerData.reviews.split(',').map(review => review.trim()),
        reviewer_names: lawyerData.reviewer_names.split(',').map(name => name.trim())
      });
      history.push('/'); // Redirect to home page after submission
    } catch (error) {
      console.error('Error adding lawyer:', error);
    }
  };

  return (
    <div>
      <h1>Add New Lawyer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={lawyerData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Long Introduction:</label>
          <textarea name="long_introduction" value={lawyerData.long_introduction} onChange={handleChange} required />
        </div>
        <div>
          <label>Full Address:</label>
          <input type="text" name="location_full_address" value={lawyerData.location_full_address} onChange={handleChange} required />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="location_city" value={lawyerData.location_city} onChange={handleChange} required />
        </div>
        <div>
          <label>Experience (Years):</label>
          <input type="number" name="experience_years" value={lawyerData.experience_years} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={lawyerData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Social Media Links:</label>
          <input type="url" name="social_media_links" value={lawyerData.social_media_links} onChange={handleChange} />
        </div>
        <div>
          <label>Languages (comma-separated):</label>
          <input type="text" name="languages" value={lawyerData.languages} onChange={handleChange} required />
        </div>
        <div>
          <label>Specializations (comma-separated):</label>
          <input type="text" name="specializations" value={lawyerData.specializations} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Numbers (comma-separated):</label>
          <input type="text" name="contact_numbers" value={lawyerData.contact_numbers} onChange={handleChange} required />
        </div>
        <div>
          <label>Type of Court:</label>
          <input type="text" name="court_type" value={lawyerData.court_type} onChange={handleChange} required />
        </div>
        <div>
          <label>Reviews (comma-separated):</label>
          <input type="text" name="reviews" value={lawyerData.reviews} onChange={handleChange} />
        </div>
        <div>
          <label>Reviewer Names (comma-separated):</label>
          <input type="text" name="reviewer_names" value={lawyerData.reviewer_names} onChange={handleChange} />
        </div>
        <button type="submit">Add Lawyer</button>
      </form>
    </div>
  );
};

export default AddLawyer;
