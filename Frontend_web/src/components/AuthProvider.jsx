import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);//wala ni sud diri lang ni incase gamiton nako, ge try nako backend mo butang session para dili makita info sa user
    const [token, setToken] = useState(localStorage.getItem("token")||'');

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });

    const loginAction  = async (data) => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", data, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 200 || response.status === 201) {
                const { token, user } = response.data; 
    
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("token", token);
                localStorage.setItem("user", user); 
    
                setUser(user);
                setToken(token);
                return;
            }
            throw new Error(response.data.message)
        } catch (error) {
            console.log(error)
        }
        
    }

    const logout = () => {
        setUser(null);
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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