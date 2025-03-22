import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);//wala ni sud diri lang ni incase gamiton nako, ge try nako backend mo butang session para dili makita info sa user
    const [token, setToken] = useState(localStorage.getItem("token")||'');

    const isAuthenticated = !!token; 

    const loginAction  = async (data) => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", data, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 200 || response.status === 201) {
                const { token, user } = response.data; 
    
                localStorage.setItem("token", token);

                setToken(token);
                setIsAuthenticated(true);
                return;
            }
            throw new Error(response.data.message)
        } catch (error) {
            console.log(error)
        }
        
    }

    const logout = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) return; // Prevent double execution if already logged out
    
        try {
            await axios.post("http://localhost:8080/user/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
           
            setToken('');
    
            localStorage.removeItem("token");
    
            
            setTimeout(() => {
                window.dispatchEvent(new Event("storage"));
            }, 100);
    
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
         <AuthContext.Provider value={{ user, token, isAuthenticated, loginAction, logout }}>
              {children}
        </AuthContext.Provider>
    );
};  
export default AuthProvider;
export const useAuth = () => {
    return useContext(AuthContext);
};