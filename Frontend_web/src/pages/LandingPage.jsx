import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(/Images/students-image.png)`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Heading */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "white",
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)", // Add text shadow for better readability
          }}
        >
          CIT - U LOST AND FOUND SYSTEM
        </Typography>

        {/* Call-to-Action Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#ffcc00",
            color: "black",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "#e6b800",
            },
          }}
        >
          Lost or Found Something?
        </Button>
      </Box>
      <Footer />
    </div>
  );
}
