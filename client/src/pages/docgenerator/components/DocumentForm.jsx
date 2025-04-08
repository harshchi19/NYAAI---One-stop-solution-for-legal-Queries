import React, { useState } from 'react';
import axios from 'axios';
import './DocumentForm.css';

const documentTypes = [
  'Employment Contract',
  'Non-Disclosure Agreement',
  'Lease Agreement',
  'Service Agreement',
  'Partnership Agreement',
  'Sales Contract',
  'Power of Attorney',
  'Will',
  'Shareholder Agreement',
  'Intellectual Property Assignment',
];

const DocumentForm = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    name: '',
    partiesInvolved: '',
    additionalDetails: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update form state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form to generate document content
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/generate-content',
        formData
      );
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF from content
  const handleGeneratePdf = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/generate-pdf',
        { ...formData, content: generatedContent },
        { responseType: 'blob' }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${formData.documentType}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="doc-container">
      <form onSubmit={handleSubmit} className="document-form">
        <div className="form-row">
          <label htmlFor="documentType">Document Type:</label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Document Type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="name">Your Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="partiesInvolved">Parties Involved:</label>
          <input
            id="partiesInvolved"
            type="text"
            name="partiesInvolved"
            value={formData.partiesInvolved}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="additionalDetails">Additional Details:</label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleInputChange}
            placeholder="Any additional details you want to include..."
          ></textarea>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Document'}
        </button>
      </form>

      <div className="document-preview">
        <h3 className='document-h3'>Generated Document Preview</h3>
        <textarea
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          rows="20"
          placeholder="Your document content will appear here..."
        ></textarea>
        <button onClick={handleGeneratePdf}>Generate PDF</button>
      </div>
    </div>
  );
};

export default DocumentForm;