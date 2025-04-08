import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LawyerDetail from './components/LawyerDetail'
import LawyerCard from './components/NewLawyerCard';
import Dropdown from './components/Dropdown';
import Hero from './components/Hero';
import Navbar from '../../components/Navbar';
import './Matchmaker.css';
import emptyImage from './assets/Empty-bro.png'


const MatchMaking = () => {
  const [locations, setLocations] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lawyers/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lawyers/specializations');
        setSpecializations(response.data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const fetchLawyers = async () => {
        try {
          const specializationQuery = selectedSpecialization === 'all' ? '' : `&specialization=${selectedSpecialization}`;
          const response = await axios.get(`http://localhost:5000/api/lawyers?city=${selectedLocation}${specializationQuery}`);
          setLawyers(response.data);
        } catch (error) {
          console.error('Error fetching lawyers:', error);
        }
      };
      fetchLawyers();
    }
  }, [selectedLocation, selectedSpecialization]);

  return (
          <div>
            <Navbar />
            <Hero />
            <div className='dropdown-div'>
              <Dropdown
                label="Select Location"
                options={locations}
                selectedValue={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
              <Dropdown
                label="Select Specialization"
                options={specializations}
                selectedValue={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                includeAllOption
              />
            </div>
            {lawyers.length === 0 && selectedLocation && selectedSpecialization && (
              <div className="no-lawyers-found">
                <h2 className="no-lawyers-heading">Oops! <br /> No lawyers found in this category.</h2>
                <img src={emptyImage} alt="No Lawyers Found" className="no-lawyers-image" />
              </div>
            )}
            <ul>
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </ul>
          </div>
  );
};

export default MatchMaking;
