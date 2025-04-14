import { useState, useEffect } from "react";
import { Box, Container, Button, TextField, Avatar, Typography } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8080/user/getcurrentuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setUser(data);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
        setPhone(data.phone);
        setPreview(data.profilePicture);
      } catch (error) {
        console.error("Error fetching user info", error);
        navigate("/");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (file) formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:8080/user/upload/user/${user.schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#5a1818" }}>
      <Header /><br></br><br></br>
      <Typography variant="h3" align="center" color="white" sx={{ mt: 5, fontWeight: "bold" }}>
        Profile Settings
      </Typography>
      <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>

        {/* Profile Display */}
        <Box
          sx={{backgroundColor: "white", borderRadius: "10px", padding: "20px", width: "400px", height: "600px", boxShadow: 3, ml: 3}}
        >
          <Avatar src={preview} sx={{ width: 120, height: 120, mb: 2, mx: "auto" }} />

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Reusable row component */}
            {[
              { label: "Name:", value: `${user.firstname} ${user.lastname}`, fontSize: "30px" },
              { label: "Birthdate:", value: user.birthdate || "Not Provided" },
              { label: "Email:", value: user.email },
              { label: "Phone:", value: user.phone },
            ].map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    width: "120px",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontSize: item.fontSize || "16px",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>



        {/* Profile Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "600px", ml: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: "400px", color: "white" }}>Update Email</Typography>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: "400px", color: "white" }}>Update Phone</Typography>
            <TextField value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth sx={{ backgroundColor: "white" }}/>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: "400px", color: "white" }}>Change Password</Typography>
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ backgroundColor: "white" }}/>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography sx={{ width: "400px", color: "white" }}>Confirm Password</Typography>
            <TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth sx={{ backgroundColor: "white" }}/>
          </Box>

          <Button type="submit" variant="contained" 
          disabled={loading} sx={{ backgroundColor: "gold", color: "black", ml: "240px" }}
          >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
       
        </Box>

      </Container>
      <Footer />
    </Box>
  );
};

export default UpdateProfilePage;
