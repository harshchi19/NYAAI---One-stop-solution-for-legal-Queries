    import {React,useState,useContext}  from "react";
    import Navbar from "./Navbar";
    import character from "../assets/register-character.png"
    import { createUserWithEmailAndPassword, sendEmailVerification, TwitterAuthProvider } from "firebase/auth";
    import { auth } from "./lib/firebase";
    import { toast } from "react-hot-toast";
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import {AuthContext  } from '/src/context/AuthContext';
    import { useNavigate } from 'react-router-dom';

    const Sign_Up = () => {
     
        const { setUser } = useContext(AuthContext);
        const navigate = useNavigate();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const [fullname, setFullname] = useState('');

        const handleTwitterSignIn = async () => {
            try {
              const provider = new TwitterAuthProvider();
              const result = await signInWithPopup(auth, provider);
              const user = result.user;
          
              console.log("Twitter User Info:", user);
          
              setUser({
                fullname: user.displayName || "Twitter User", 
                email: user.email,
              });
          
              toast.success(`Welcome, ${user.displayName || "Twitter User"}!`);
              navigate('/homepage');
            } catch (error) {
              console.error("Error signing in with Twitter:", error.code, error.message);
              toast.error(`Twitter sign-in failed: ${error.message}`);
            }
          };
          

          const handleSignUp = async (e) => {
            e.preventDefault();
          
            // 1. Basic empty check
            if (!email || !password) {
              toast.error("Please fill out all fields.");
              return;
            }
          
            // 2. Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              toast.error("Enter a valid email address.");
              return;
            }
          
            // 3. Validate password strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!passwordRegex.test(password)) {
              toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
              return;
            }
          
            setLoading(true);
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
          
              await sendEmailVerification(user);
          
              toast.success("Sign-up successful! Check your email to verify your account.");
              // You can redirect here if needed: navigate("/homepage");
            } catch (error) {
              if (error.code === "auth/email-already-in-use") {
                toast.error("This email is already in use. Try logging in instead.");
              } else {
                toast.error("Sign-up failed. Please try again.");
              }
              console.error("Sign-Up Error:", error);
            } finally {
              setLoading(false);
            }
          };
              

        
        const handleGoogleSignIn = async () => {
            try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast.success('Signed in with Google successfully!');
            navigate('/homepage');
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
                            <div className='welcome'>Sign Up</div>
                            <div className='sub-welcome'>Register and get access to World of Legal</div>
                            <form className='slogin-form' onSubmit={handleSignUp}>
                                <div className="test"> 
                                    <label htmlFor="email" className='-label'>Enter your Email</label>
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
                                <div className="test">
                                    <label htmlFor="password" className='-label'>Create Password</label>
                                        <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="password-box in"
                                        placeholder="Password "
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        />
                                        
                                </div>
                                <div className="password-rule">NOTE : Password must be of minimum 8 character.<br />It must contain an uppercase, a lowercase , a numeric <br /> and a special character.</div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ssign-in-button"
                                >
                                    {loading ? 'Signing in...' : 'Register'}
                                </button>
                            </form>
                            <div className='line'>
                                <div className='line-div'></div>
                                <div className='other-options-login'>Sign Up with others</div>
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
                                    <p className='btn-text'>Sign Up with Google</p>
                                </button>
                                <button
                                    type='button'
                                    className='google-signin-button'
                                    onClick={handleTwitterSignIn}
                                >
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.6 0H15.0537L9.69372 7.20035L16 17H11.0629L7.19314 11.0578L2.77029 17H0.314286L6.04686 9.29587L0 0.00133983H5.06286L8.55543 5.43175L12.6 0ZM11.7371 15.2743H13.0971L4.32 1.63596H2.86171L11.7371 15.2743Z" fill="black"/>
                                    </svg>
                                    <p className='btn-text'>Sign Up with Twitter</p>
                                </button>
                            </div> 
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    export default Sign_Up