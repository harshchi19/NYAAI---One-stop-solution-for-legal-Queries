import React, { useState,useContext } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import character from "../assets/login-character.png";
import { auth } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, updateProfile, TwitterAuthProvider } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {AuthContext  } from '/src/context/AuthContext';
import '../Login.css';

const Sign_in = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTwitterSignIn = async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Twitter User Info:", user);
  
      // Update global state
      setUser({
        fullname: user.displayName || "Twitter User",
        email: user.email,
      });
  
      toast.success(`Welcome, ${user.displayName || "Twitter User"}!`);
      navigate('/homepage', { replace: true });
    } catch (error) {
      console.error("Error signing in with Twitter:", error.code, error.message);
      toast.error(`Twitter sign-in failed: ${error.message}`);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
  
    if (!fullname.trim()) {
      toast.error("Please enter your full name");
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update display name if needed
      if (!user.displayName || user.displayName === "NULL") {
        await updateProfile(user, { displayName: fullname });
      }
  
      const userData = {
        fullname: fullname,
        email: user.email
      };
  
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
  
      toast.success('Signed in successfully!');
      setTimeout(() => {
        navigate('/homepage', { replace: true });
      }, 100);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Google User Info:", user);
  
      // Update global state
      setUser({
        fullname: user.displayName || "User", // Fallback if displayName is null
        email: user.email,
      });
  
      toast.success(`Welcome, ${user.displayName || "User"}!`);
      navigate('/homepage', { replace: true });
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error(error);
    }
  };
  

  return (
    <div>
        <Navbar />
        <div className='outer-container'>
            <div className='div-container'>
                <div className='Character-box'>
                    <img 
                        className='Character-img'
                        src = {character}
                    />
                </div>
                <div className='Login-box'>
                    <div className='welcome'>Welcome</div>
                    <div className='sub-welcome'>We are glad to see you back with us</div>
                    <form className='login-form' onSubmit={handleEmailSignIn}>
                        <div>
                            <label htmlFor="text" className='-label'>Name</label>
                                <input
                                
                                type="text"
                                required
                                className="email-box in"
                                placeholder="Username"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                />
                        </div>
                        <div>
                            <label htmlFor="email" className='-label'>Email Address</label>
                                <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="email-box in"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                        </div>
                        <div>
                            <label htmlFor="password" className='-label'>Password</label>
                                <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="password-box in"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                        </div>
                        <div className='forget-pass'>
                            <a href='/forgot-password' className='forget-password'>Forgot Password</a>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="sign-in-button"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>
                    <div className='line'>
                        <div className='line-div'></div>
                        <div className='other-options-login'>Login with others</div>
                        <div className='line-div'></div>
                    </div> 
                    <div className='buttons'>
                        <button
                            type='button'
                            className='google-signin-button'
                            onClick={handleGoogleSignIn}
                        >
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='google-icon'>
                            <path d="M25.4992 13.2889C25.4992 12.22 25.4124 11.44 25.2246 10.6311H13.0098V15.4555H20.1796C20.0351 16.6544 19.2545 18.46 17.5198 19.6733L17.4955 19.8348L21.3576 22.8244L21.6252 22.8511C24.0825 20.5833 25.4992 17.2466 25.4992 13.2889Z" fill="#4285F4"/>
                            <path d="M13.0099 26C16.5225 26 19.4713 24.8444 21.6253 22.8511L17.5199 19.6733C16.4213 20.4388 14.9468 20.9733 13.0099 20.9733C9.5695 20.9733 6.64954 18.7056 5.60865 15.5711L5.45608 15.5841L1.44021 18.6896L1.3877 18.8355C3.52707 23.0822 7.92152 26 13.0099 26Z" fill="#34A853"/>
                            <path d="M5.60864 15.5711C5.33399 14.7623 5.17504 13.8955 5.17504 13C5.17504 12.1044 5.33399 11.2378 5.59419 10.4289L5.58691 10.2566L1.52072 7.10117L1.38768 7.1644C0.505944 8.92664 0 10.9056 0 13C0 15.0944 0.505944 17.0733 1.38768 18.8355L5.60864 15.5711Z" fill="#FBBC05"/>
                            <path d="M13.0099 5.02663C15.4528 5.02663 17.1007 6.08107 18.0403 6.96224L21.712 3.38C19.457 1.28556 16.5225 0 13.0099 0C7.92152 0 3.52707 2.91775 1.3877 7.16439L5.5942 10.4289C6.64954 7.29444 9.5695 5.02663 13.0099 5.02663Z" fill="#EB4335"/>
                            </svg>
                            <p className='btn-text'>Login with Google</p>
                        </button>
                        <button
                            type='button'
                            className='google-signin-button'
                            onClick={handleTwitterSignIn}
                        >
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.6 0H15.0537L9.69372 7.20035L16 17H11.0629L7.19314 11.0578L2.77029 17H0.314286L6.04686 9.29587L0 0.00133983H5.06286L8.55543 5.43175L12.6 0ZM11.7371 15.2743H13.0971L4.32 1.63596H2.86171L11.7371 15.2743Z" fill="black"/>
                            </svg>
                            <p className='btn-text'>Login with Twitter</p>
                        </button>
                    </div>   
                </div>
            </div>
        </div>
    </div>
)
}

export default Sign_in;