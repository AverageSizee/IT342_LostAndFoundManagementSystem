import { useState } from "react";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button, IconButton, CircularProgress } from "@mui/material";
import { Close as CloseIcon, Microsoft as MicrosoftIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { PublicClientApplication } from "@azure/msal-browser";
import { API_CONFIG } from '../config/apiConfig';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin, // Use current origin for redirect
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const Login = ({ open, onClose, onRegisterClick }) => {
  const [credentials, setCredentials] = useState({ schoolId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAction } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAction(credentials, navigate);
      window.dispatchEvent(new Event("storage"));
      onClose();
      setLoading(false);
      console.log("Login successful");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await msalInstance.initialize();
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["User.Read"],
      });
      //console.log("Microsoft login successful:", loginResponse);
      
      const userAccessToken = loginResponse.accessToken;
  
      // Fetch user details from Microsoft Graph API using Axios
      const userResponse = await axios.get("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
  
      const userData = userResponse.data;
      //console.log("User details:", userData);
  
      // Extract jobTitle from userData
      const jobTitle = userData.jobTitle || "Unknown"; 
      // Check if user exists in the database
      const checkUserResponse = await axios.get(`${API_CONFIG.BASE_URL}/user/check-user`, {
        params: { jobTitle },
      });
  
      if (checkUserResponse.data.exists) {
        // If user exists, proceed to login endpoint
        console.log("User exists, logging in...");
        credentials.password =  userData.id;
        credentials.schoolId = userData.jobTitle;
        try {
          await loginAction(credentials, navigate);
          window.dispatchEvent(new Event("storage"));
          onClose();
          setLoading(false);
          console.log("Login successful");
          setCredentials({});
        } catch (err) {
          setLoading(false);
          console.error("Login error:", err);
        }
      } else {
        try {
          console.log("User not found, registering...");
      
          // Prepare user registration data
          const requestBody = {
            schoolId: userData.jobTitle,
            firstname: userData.displayName,
            lastname: userData.surname,
            email: userData.mail,
            password: userData.id,
            role: "student",
          };
      
          // Send registration request
          const response = await axios.post(`${API_CONFIG.BASE_URL}/user/register`, requestBody);
      
          // Notify user of successful registration
          alert("Registration successful!");
      
          // (Optional) Perform any additional actions after registration
          credentials.password =  userData.id;
          credentials.schoolId = userData.jobTitle;
          try {
            await loginAction(credentials, navigate);
            window.dispatchEvent(new Event("storage"));
            onClose();
            setLoading(false);
            console.log("Login successful");
            setCredentials({});
          } catch (err) {
            console.error("Login error:", err);
          }
        } catch (error) {
          setLoading(false);
          alert(error.response?.data?.message || "Registration failed.");
        }
      }
  
      onClose();
    } catch (err) {
      setLoading(false);
      console.error("Microsoft login error:", err);
    }
  };

  return (
<>
      {/* Loading Modal */}
      <Modal open={loading}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#800000", // Maroon background
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "white", mb: 2 }} />
          <Typography variant="h6">Logging in...</Typography>
        </Box>
      </Modal>
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title" aria-describedby="login-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            bgcolor: "#800000",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="img" src="/public/images/logo.png" alt="CIT-U Lost and Found Logo" sx={{ width: "2rem", height: "2rem", marginRight: "0.5rem" }} />
            <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>CIT-U Lost&Found</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
          <Box
            sx={{
              flex: 1,
              padding: "30px",
              bgcolor: "white",
              borderRadius: { xs: "0", md: "0 0 0 15px" },
              textAlign: "center",
              color: "#333",
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "24px", mb: 2, color: "#800000" }}>Log In</Typography>
            <form onSubmit={handleLogin}>
              <TextField fullWidth label="School ID" variant="outlined" margin="normal" required name="schoolId" value={credentials.schoolId} onChange={handleChange}
                sx={{"& .MuiOutlinedInput-root": {"&.Mui-focused fieldset": { borderColor: "#800000" }}, "& .MuiInputLabel-root.Mui-focused": { color: "#800000" }}} />
              <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" required name="password" value={credentials.password} onChange={handleChange}
                sx={{"& .MuiOutlinedInput-root": {"&.Mui-focused fieldset": { borderColor: "#800000" }}, "& .MuiInputLabel-root.Mui-focused": { color: "#800000" }}} />
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, bgcolor: "#f0ad4e", color: "white", "&:hover": { bgcolor: "#ec971f" }, textTransform: "none", borderRadius: "5px", padding: "10px", fontSize: "16px", fontWeight: "bold" }}>Log In</Button>
            </form>

            {/* Microsoft Login Button at the Bottom */}
            <Typography sx={{ fontSize: "14px", color: "#888", mt: 1, mb: 2 }}>or</Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleMicrosoftLogin}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "none",
                borderColor: "#0078D4",
                color: "#0078D4",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#E3F2FD" },
              }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Logo" style={{ width: 20, marginRight: 8 }} />
              Sign in with Microsoft
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>Don't have an account? <Button onClick={onRegisterClick} sx={{ color: "#800000", fontWeight: "bold", textTransform: "none", p: 0 }}>Sign-up</Button></Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><a href="#" style={{ color: "#800000", fontWeight: "bold", textDecoration: "none" }}>Forgot Password</a></Typography>
          </Box>
          <Box sx={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: { xs: "0", md: "0 15px 15px 0" }, display: { xs: "none", md: "block" } }}>
            <Box component="img" src="/images/studentss.png" alt="Students" sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
          </Box>
        </Box>
      </Box>
    </Modal>
    </>
  );
};

export default Login;