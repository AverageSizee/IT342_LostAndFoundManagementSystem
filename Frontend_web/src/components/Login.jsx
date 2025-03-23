import { useState } from "react";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Login = ({ open, onClose, onRegisterClick }) => {
  const [credentials, setCredentials] = useState({ schoolId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {loginAction} = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await loginAction(credentials, navigate);
      window.dispatchEvent(new Event("storage"));
      onClose();
      console.log("Login successful");
      // Handle successful login (e.g., store token, redirect user)
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
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
            <Typography variant="body2" sx={{ mt: 1 }}>Don't have an account? <Button onClick={onRegisterClick} sx={{ color: "#800000", fontWeight: "bold", textTransform: "none", p: 0 }}>Sign-up</Button></Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><a href="#" style={{ color: "#800000", fontWeight: "bold", textDecoration: "none" }}>Forgot Password</a></Typography>
          </Box>
          <Box sx={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: { xs: "0", md: "0 15px 15px 0" }, display: { xs: "none", md: "block" } }}>
            <Box component="img" src="/public/images/studentss.png" alt="Students" sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Login;
