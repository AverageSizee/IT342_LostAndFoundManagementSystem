import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { API_CONFIG } from '../config/apiConfig';
const API_URL = `${API_CONFIG.BASE_URL}/user`;

const AdminProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/getcurrentrole`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsAdmin(response.data.role === "admin"); // Check if role is ADMIN
            } catch (error) {
                console.error("Error fetching role:", error.response?.data || error.message);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    if (loading) return <p>Loading...</p>; 

    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminProtectedRoute;
