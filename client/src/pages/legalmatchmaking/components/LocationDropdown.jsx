import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LocationDropdown = ({ onLocationSelect }) => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('/api/lawyers/locations');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations', error);
            }
        };

        fetchLocations();
    }, []);

    const handleChange = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        onLocationSelect(location);
    };

    return (
        <select value={selectedLocation} onChange={handleChange}>
            <option value="">Select a Location</option>
            {locations.map(location => (
                <option key={location} value={location}>{location}</option>
            ))}
        </select>
    );
};

export default LocationDropdown;
