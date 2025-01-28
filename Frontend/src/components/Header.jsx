import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material"; // Profile icon

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the dropdown anchor element

  // Function to open the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

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
              {/* Profile Icon on the left */}
              <IconButton
                onClick={handleClick} // Open the dropdown menu
                sx={{
                  color: "white",
                  "&:hover": {
                    color: "rgba(219, 139, 9, 0.76)",
                  },
                }}
              >
                <AccountCircle sx={{ fontSize: 30 }} />
              </IconButton>

              {/* Name (Guest) on the right */}
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  marginLeft: "8px", // Space between the icon and name
                }}
              >
                Guest
              </Typography>
            </Box>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)} // If anchorEl is not null, the menu is open
              onClose={handleClose} // Close the menu when clicked outside
              sx={{
                marginTop: "0px", // Adjusted to bring the menu closer
                marginLeft: "-20px", // Optional: slight adjustment to align the menu closer to the icon
                "& .MuiPaper-root": { // Target only the Paper component inside the Menu
                  backgroundColor: "#7b0000 !important", // Ensure maroon background for the dropdown only
                },
                '& .MuiMenuItem-root': {
                  color: "white", // Ensures white text for menu items
                  '&:hover': {
                    backgroundColor: "#a10000", // Darker maroon on hover
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose}>Login</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
