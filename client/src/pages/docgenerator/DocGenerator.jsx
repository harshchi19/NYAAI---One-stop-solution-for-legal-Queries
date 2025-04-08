import React from 'react';
import DocumentForm from './components/DocumentForm';
import Navbar from '../../components/Navbar';

const DocGenerator = () => (
  <div className="docgenerator-main">
    <main>
      <Navbar />
      <DocumentForm />
    </main>
  </div>
);

export default DocGenerator;
