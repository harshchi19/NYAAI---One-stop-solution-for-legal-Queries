import React from 'react';

const Dropdown = ({ label, options, selectedValue, onChange, includeAllOption }) => {
  return (
    <div className="drop-div">
      <style>
        {`
          select.custom-dropdown option:hover {
            background-color: #f5e642; /* Light golden color */
            color: black;
          }
          select.custom-dropdown option:checked {
            background-color: #f5e642; /* Light golden color */
            color: black;
            font-weight: bold; /* Make selected option text bold */
          }
        `}
      </style>
      <h2>{label}:</h2>
      <select
        value={selectedValue}
        onChange={onChange}
        className="custom-dropdown"
        style={{
          border: '1px solid lightgray',
          borderRadius: '10px',
          backgroundColor: 'white',
          color: 'black',
          padding: '10px',
          marginRight: '20px',
          marginLeft: '20px',
          width: '402px',
          height: 'auto',
          fontSize: '19px',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: 'normal',
          letterSpacing: '-0.19px',
          fontFamily: 'Urbanist',
          cursor: 'pointer',
          appearance: 'none',
        }}
      >
        <option value="">{label}</option>
        {includeAllOption && <option value="all">All Specializations</option>}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
