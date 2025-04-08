import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./lib/firebase";
import { toast } from "react-hot-toast";
import logo from "../assets/logo.png";
import fcharacter from "../assets/forget.svg"
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HandleLogin = () => {
    navigate("/login");
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error("Failed to send reset email. Ensure the email is registered.");
      console.error("Error sending reset email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       <nav>
        <img 
            src = {logo}
            width = '58px'
            height= '58px'
        />
       </nav>
       <div className="con-div">
          <div className="forgot-character">
              <img 
                src={fcharacter}
                className="fcharacter"
              />
          </div>
          <div className="forgot-box">
              <div className='welcome'>Forgot Password</div>
              <div className="space">Enter your registered email to receive reset link</div>
              <div className="test"> 
                  <label htmlFor="email" className='-label'>Enter your Email</label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="femail-box in"
                          placeholder="Enter Your Registered Email "
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                </div>

                <button
                    type="submit"
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="fsign-in-button"
                >
                 {loading ? "Sending..." : "Reset Password"}
                </button>

                <div className='line'>
                    <div className='line-div'></div>
                    <div className='other-options-login'>Already have an account ?</div>
                    <div className='line-div'></div>
                </div>
                <button
                  type="submit"
                  onClick={HandleLogin}
                  className="fsign-in-button"
                >
                  Login
                </button>
          </div>
       </div>
    </div> 
  );
}
