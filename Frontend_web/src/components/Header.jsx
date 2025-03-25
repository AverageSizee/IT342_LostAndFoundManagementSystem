import { useState, useEffect } from "react"
import { AppBar, Toolbar, Typography, Box, Button, Container, IconButton, Menu, MenuItem } from "@mui/material"
import { AccountCircle } from "@mui/icons-material"
import axios from "axios";
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import ReportLosTItems from "./ReportLosTItems.jsx"
import { useAuth } from "./AuthProvider"
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/user";


const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [foundItemOpen, setFoundItemOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("Guest")
  const {logout} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
       
        const response = await axios.get(`${API_URL}/getcurrentuser`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsAuthenticated(true);
        setUsername(response.data.schoolId); 

      } catch (error) {
        console.error("Error fetching student ID:", error.response?.data || error.message);
        setIsAuthenticated(false);
      }
    };

    fetchUserInfo(); // Fetch on mount

    // Handle auth status updates when storage changes
    const updateAuthStatus = () => fetchUserInfo();

    window.addEventListener("storage", updateAuthStatus);

    return () => {
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLoginClick = () => {
    handleClose()
    setLoginOpen(true)
  }

  const handleLoginClose = () => {
    setLoginOpen(false)
  }

  const handleRegisterClick = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  const handleRegisterClose = () => {
    setRegisterOpen(false)
  }

  const handleFoundItemClick = () => {
    setFoundItemOpen(true);
  };
  
  const handleFoundItemClose = () => {
    setFoundItemOpen(false);
  };

  const handleLoginFromRegister = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  const handleLogout = () => {
    if (!isAuthenticated) return; 
    logout();
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        "--primary-color": "#7b0000",
        "--secondary-color": "#ffcc00",
        backgroundColor: "var(--primary-color)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1200,
      }}
    >
      <Container>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
          }}
        >
          {/* Logo Section */}
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              src="/public/images/logo.png"
              alt="CIT-U Lost and Found Logo"
              sx={{
                width: "2rem",
                height: "2rem",
                marginRight: "0.5rem",
              }}
            />
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              CIT-U Lost & Found
            </Typography>
          </Box>

          {/* Navigation Links and Profile */}
          <Box display="flex" gap={2} alignItems="center">
          <Button
            href="/"
            sx={{
              position: "relative",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "bold",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              textTransform: "none",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "0px",
                height: "0px",
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "50%",
                transition: "width 0.3s ease-in-out, height 0.3s ease-in-out, top 0.3s ease-in-out, left 0.3s ease-in-out",
                transform: "translate(-50%, -50%)",
                zIndex: -1,
              },
              "&:hover": {
                color: "#800000",
                "&::before": {
                  width: "120%",
                  height: "120%",
                },
              },
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/LostandFoundItems")}
             sx={{
              position: "relative",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "bold",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px", 
              textTransform: "none",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "300%",
                height: "300%",
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "inherit", // Matches the button's border-radius
                transition: "transform 0.3s ease-in-out",
                transform: "translate(-50%, -50%) scale(0)",
                zIndex: -1,
              },
              "&:hover": {
                color: "#800000",
                "&::before": {
                  transform: "translate(-50%, -50%) scale(1)",
                },
              },
            }}
            >
              Lost an Item?
            </Button>
            <Button
            onClick={handleFoundItemClick}
             sx={{
              position: "relative",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "bold",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px", 
              textTransform: "none",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "300%",
                height: "300%",
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "inherit", // Matches the button's border-radius
                transition: "transform 0.3s ease-in-out",
                transform: "translate(-50%, -50%) scale(0)",
                zIndex: -1,
              },
              "&:hover": {
                color: "#800000",
                "&::before": {
                  transform: "translate(-50%, -50%) scale(1)",
                },
              },
            }}
            >
              Found an Item?
            </Button>

            {/* Conditional Rendering for Authentication */}
            {isAuthenticated ? (
                  <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    position: "relative",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    height: "2.25rem", 
                    lineHeight: "1.5rem", 
                    padding: "0 0.75rem",
                    borderRadius: "20px",
                    textTransform: "none",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "300%",
                      height: "200%", 
                      backgroundColor: "rgb(255, 255, 255)",
                      borderRadius: "inherit",
                      transition: "transform 0.3s ease-in-out",
                      transform: "translate(-50%, -50%) scale(0)",
                      zIndex: -1,
                    },
                    "&:hover": {
                      color: "#800000",
                      "&::before": {
                        transform: "translate(-50%, -50%) scale(1)",
                      },
                    },
                  }}
                >
                <IconButton
                  onClick={handleClick}
                  sx={{
                    color: "inherit", 
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  <AccountCircle sx={{ fontSize: 30 }} />
                </IconButton>

                <Typography
                sx={{
                  color: "inherit", 
                  fontWeight: "bold",
                  marginLeft: "8px",
                }}
                >
                  {username}
                </Typography>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{
                    marginTop: "0px",
                    marginLeft: "-20px",
                    "& .MuiPaper-root": {
                      backgroundColor: "#7b0000 !important",
                    },
                    "& .MuiMenuItem-root": {
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#a10000",
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  onClick={handleLoginClick}
                  sx={{
                    position: "relative",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    textTransform: "none",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "0px",
                      height: "0px",
                      backgroundColor: "rgb(255, 255, 255)",
                      borderRadius: "50%",
                      transition: "width 0.3s ease-in-out, height 0.3s ease-in-out, top 0.3s ease-in-out, left 0.3s ease-in-out",
                      transform: "translate(-50%, -50%)",
                      zIndex: -1, 
                    },
                    "&:hover": {
                      color: "#800000",
                      "&::before": {
                        width: "120%",
                        height: "120%",
                      },
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={handleRegisterClick}
                  sx={{
                    position: "relative",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    textTransform: "none",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "0px",
                      height: "0px",
                      backgroundColor: "rgb(255, 255, 255)",
                      borderRadius: "50%",
                      transition: "width 0.3s ease-in-out, height 0.3s ease-in-out, top 0.3s ease-in-out, left 0.3s ease-in-out",
                      transform: "translate(-50%, -50%)",
                      zIndex: -1, 
                    },
                    "&:hover": {
                      color: "#800000",
                      "&::before": {
                        width: "120%",
                        height: "120%",
                      },
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Found Item Modal */}
      <ReportLosTItems open={foundItemOpen} onClose={handleFoundItemClose} userID={username} />

      {/* Login Modal */}
      <Login open={loginOpen} onClose={handleLoginClose} onRegisterClick={handleRegisterClick} />

      {/* Register Modal */}
      <Register open={registerOpen} onClose={handleRegisterClose} onLoginClick={handleLoginFromRegister} />
    </AppBar>
  )
}

export default Header
