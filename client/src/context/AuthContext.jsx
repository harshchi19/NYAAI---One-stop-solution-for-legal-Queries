import { createContext, useState, useEffect } from "react";
import { auth } from "../pages/login-page/components/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
});

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
              const newUser = { fullname: firebaseUser.displayName, email: firebaseUser.email };
              localStorage.setItem("user", JSON.stringify(newUser));
              setUser(newUser);
          }
      } else {
          setUser(null);
          localStorage.removeItem("user"); // Remove user when logged out
      }
  });

  return () => unsubscribe();
}, []);

return (
  <AuthContext.Provider value={{ user, setUser }}>
      {children}
  </AuthContext.Provider>
);
};
  