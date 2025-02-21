import { Box, Container, Button } from "@mui/material"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";
import {useAuth} from "../components/AuthProvider";

const LogoutPage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            bgcolor: "#f0ad4e",
            color: "white",
            "&:hover": {
              bgcolor: "#ec971f",
            },
            textTransform: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Logout
        </Button>
      </Container>

      <Footer />
    </Box>
  )
}

export default LogoutPage