import { useState } from "react"
import axios from "axios"
import { Modal, Box, Typography, TextField, Button, IconButton, Grid } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { API_CONFIG } from '../config/apiConfig'
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

const Register = ({ open, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    schoolId: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "student",
    isMicrosoft: false,
    confirmPassword: "",
  })
  const [credentials, setCredentials] = useState({ schoolId: "", password: "" });
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageModalContent, setMessageModalContent] = useState("")

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setMessageModalContent("Passwords do not match!");
      setMessageModalOpen(true);
      return;
    }

    const { confirmPassword, ...requestBody } = formData // Exclude confirmPassword

    try {
      setLoading(true)
      
      // First check if user exists by schoolId
      try {
        const checkUserResponse = await axios.get(`${API_CONFIG.BASE_URL}/user/check-user`, {
          params: { jobTitle: formData.schoolId },
        });

        if (checkUserResponse.data.exists) {
          setMessageModalContent("User with this ID already exists.");
          setMessageModalOpen(true);
          return;
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          setMessageModalContent("Error checking ID availability");
          setMessageModalOpen(true);
          return;
        }
      }

      // Then check if email exists
      try {
        const checkEmailResponse = await axios.get(`${API_CONFIG.BASE_URL}/user/check-email`, {
          params: { email: formData.email },
        });

        if (checkEmailResponse.data.exists) {
          setMessageModalContent("Email already exists. Please use a different email.");
          setMessageModalOpen(true);
          return;
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          setMessageModalContent("Error checking email availability");
          setMessageModalOpen(true);
          return;
        }
      }

      // If email doesn't exist, proceed with registration
      const response = await axios.post(`${API_CONFIG.BASE_URL}/user/register`, requestBody)
      setMessageModalContent("Registration successful!");
      setMessageModalOpen(true);
      setFormData({ schoolId: "", firstname: "", lastname: "", email: "", password: "", confirmPassword: "" }) // Reset form
      credentials.password =  formData.password;
      credentials.schoolId = formData.schoolId;
      try {
        await loginAction(credentials, navigate);
        window.dispatchEvent(new Event("storage"));
        onClose();
        console.log("Login successful");
        setCredentials({});
      } catch (err) {
        console.error("Login error:", err);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessageModalContent("Email already exists. Please use a different email.");
      } else {
        setMessageModalContent(error.response?.data?.message || "Registration failed.");
      }
      setMessageModalOpen(true);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-description"
    >
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
            <Box
              component="img"
              src="/Images/logo.png"
              alt="CIT-U Lost and Found Logo"
              sx={{
                width: "2rem",
                height: "2rem",
                marginRight: "0.5rem",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              CIT-U Lost&Found
            </Typography>
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
            <Typography variant="h4" sx={{ fontSize: "24px", mb: 2, color: "#800000" }}>
              Register
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="ID"
                name="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#800000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#800000",
                  },
                }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#800000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#800000",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#800000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#800000",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#800000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#800000",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#800000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#800000",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#800000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#800000",
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  bgcolor: "#f0ad4e",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ec971f",
                  },
                  textTransform: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Do you have an account?{" "}
                <Button
                  onClick={onLoginClick}
                  sx={{ color: "#800000", fontWeight: "bold", textTransform: "none", p: 0 }}
                >
                  Login here
                </Button>
              </Typography>
            </form>
          </Box>
          <Box
            sx={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: "0", md: "0 15px 15px 0" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              component="img"
              src="/images/studentss.png"
              alt="Students"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8)",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>

    {/* Message Modal */}
    <Modal open={messageModalOpen} onClose={() => setMessageModalOpen(false)}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#800000",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          color: "white",
          width: "300px"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>{messageModalContent}</Typography>
        <Button 
          variant="contained" 
          onClick={() => setMessageModalOpen(false)}
          sx={{ 
            bgcolor: "#f0ad4e", 
            color: "white",
            "&:hover": { bgcolor: "#ec971f" },
            textTransform: "none",
            fontWeight: "bold"
          }}
        >
          OK
        </Button>
      </Box>
    </Modal>
    </>
  )
}

export default Register