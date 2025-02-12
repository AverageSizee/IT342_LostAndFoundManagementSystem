import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        "--primary-color": "#7b0000",
        "--secondary-color": "#ffcc00",
        "--text-color": "#333",
        "--background-color": "#f3f3f3",
        fontFamily: "'Roboto', Arial, sans-serif",
        color: "var(--text-color)",
        backgroundColor: "var(--background-color)",
        width: "100%",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        component="footer"
        sx={{
          backgroundColor: "var(--primary-color)",
          color: "white",
          padding: "1.5rem 0",
        }}
      >
        <Container>
          <Box textAlign="center" mb={2}>
            <Typography variant="h6" mb={1}>
              Experience the vibrant atmosphere of CIT University
            </Typography>
            <Typography variant="body2" mb={2}>
              Located at N. Bacalso Ave, Cebu City, Philippines, our campus offers top-notch academic programs...
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--secondary-color)",
                color: "var(--primary-color)",
                padding: "0.5rem 1rem",
                fontWeight: "bold",
                borderRadius: "25px",
                "&:hover": {
                  backgroundColor: "var(--secondary-color)",
                  transform: "scale(1.05)",
                },
              }}
            >
              VISIT US
            </Button>
          </Box>
        </Container>
        <Box sx={{ backgroundColor: "#4d0000", padding: "1.5rem 0" }}>
          <Container>
            <Box textAlign="center">
              <Box
                component="img"
                src="/public/images/logo.png"
                alt="CIT-U Logo"
                sx={{ width: "2.5rem", height: "2.5rem", marginBottom: "0.75rem" }}
              />
              <Typography variant="body1" fontWeight="bold" mb={1}>
                CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", lineHeight: "1.4" }}
              >
                N. Bacalso Avenue, Cebu City, Philippines 6000
                <br />
                +63 32 411 2000 (trunkline)
                <br />
                info@cit.edu
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
