import { Toaster } from 'react-hot-toast';
import Sign_in from './components/Sign_in';
import './Login.css'
import React from 'react';

function Login() {
  return (
    <>
      <Toaster position="top-right" />
      <Sign_in />
    </>
  );
}

export default Login;