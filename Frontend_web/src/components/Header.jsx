
import { useState } from "react"
import { AppBar, Toolbar, Typography, Box, Button, Container, IconButton, Menu, MenuItem } from "@mui/material"
import { AccountCircle } from "@mui/icons-material"
import Login from "./Login.jsx" 
import Register from "./Register.jsx"

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false) 
  const [registerOpen, setRegisterOpen] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLoginClick = () => {
    handleClose() // Close the menu
    setLoginOpen(true) // Open the login modal
  }

  const handleLoginClose = () => {
    setLoginOpen(false) // Close the login modal
  }
  const handleRegisterClick = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  const handleRegisterClose = () => {
    setRegisterOpen(false)
  }

  const handleLoginFromRegister = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
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
              href="/home"
              sx={{
                color: "white",
                fontSize: "0.9rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  color: "rgba(219, 139, 9, 0.76)",
                },
              }}
            >
              Home
            </Button>
            <Button
              href="/register_item"
              sx={{
                color: "white",
                fontSize: "0.9rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  color: "rgba(219, 139, 9, 0.76)",
                },
              }}
            >
              Lost & Found an Item?
            </Button>

            {/* Profile Icon and Name */}
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={handleClick}
                sx={{
                  color: "white",
                  "&:hover": {
                    color: "rgba(219, 139, 9, 0.76)",
                  },
                }}
              >
                <AccountCircle sx={{ fontSize: 30 }} />
              </IconButton>

              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  marginLeft: "8px",
                }}
              >
                Guest
              </Typography>
            </Box>

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
              <MenuItem onClick={handleLoginClick}>Login</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Login Modal */}
            <Login open={loginOpen} onClose={handleLoginClose} onRegisterClick={handleRegisterClick} />

      {/* Register Modal */}
            <Register open={registerOpen} onClose={handleRegisterClose} onLoginClick={handleLoginFromRegister} />
    </AppBar>
  )
}

export default Header