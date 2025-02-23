import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider"
const ProtectedRoute = ({ children }) => {
    const {isAuthenticated} = useAuth();

    if(!isAuthenticated) 
        return <Navigate to = "/"/>;
    else 
        return children;
}

export default ProtectedRoute