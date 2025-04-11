import { useState, useEffect } from "react";
import { Box, Container, Button, TextField, Avatar } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from '../config/apiConfig';

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State for user data
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current user information when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/user/getcurrentuser`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setUser(response.data);
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setPreview(response.data.profilePicture); // Assuming the response contains the profile picture URL
      } catch (error) {
        console.error("Error fetching user info", error);
        navigate("/");
      }
    };

    fetchUserInfo();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (firstname) formData.append("firstname", firstname);
    if (lastname) formData.append("lastname", lastname);
    if (password) formData.append("password", password);
    if (file) formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/user/upload/user/${user?.schoolId}`, // Using user.schoolId from the fetched user data
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}` // Include the token for authentication
          } 
        }
      );
      // console.log("Profile updated successfully", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Error updating profile, please try again!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Display loading state until user data is fetched
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        <Avatar src={preview} sx={{ width: 100, height: 100, mb: 2 }} />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <TextField 
          label="First Name" 
          value={firstname} 
          onChange={(e) => setFirstname(e.target.value)} 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          label="Last Name" 
          value={lastname} 
          onChange={(e) => setLastname(e.target.value)} 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          fullWidth 
          margin="normal" 
        />
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default UpdateProfilePage;
