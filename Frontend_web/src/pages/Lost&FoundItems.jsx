import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  TextField,
  Modal,
  InputAdornment,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from '../config/apiConfig';

const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [imagePreviewItem, setImagePreviewItem] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLostItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setReason("");
    setProofImage(null);
    setPreviewImage(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProofImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleClaimSubmit = async () => {
    if (!reason) {
      alert("Please enter a reason for claiming this item.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    try {
      const userResponse = await axios.get(`${API_CONFIG.BASE_URL}/user/getcurrentuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userResponse.data.schoolId;

      if (!userId) {
        alert("Failed to retrieve user ID.");
        return;
      }

      await axios.post(
        `${API_CONFIG.BASE_URL}/claims/request?userId=${userId}&itemId=${selectedItem.itemID}&claimDate=${new Date().toISOString().split("T")[0]}&reason=${encodeURIComponent(reason)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Claim request submitted successfully.");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit claim.");
    }
  };

  const handleImageClick = (item) => {
    setImagePreviewItem(item);
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
    setImagePreviewItem(null);
  };

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? item.category?.toLowerCase().includes(filterCategory.toLowerCase()) : true;
    const matchesLocation = filterLocation ? item.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const matchesDate = filterDate ? item.date === filterDate : true;

    return item.status === "Confirmed" && matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#5a1818" }}>
      <Header />
      <Container sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom sx={{ color: "white", textAlign: "center" }}>
          <br />
          CIT - U LOST & FOUND SYSTEM
          <br />
        </Typography>
        <br />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
          <TextField
            fullWidth
            placeholder="Type in keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, borderRadius: "30px", color: "#000" }}
          />

<Box display="flex" justifyContent="flex-end" gap={2} sx={{ mb: 3 }}>
  <Button
    variant="outlined"
    onClick={() => {
      setSearchTerm("");
      setFilterLocation("");
      setFilterDate("");
      setFilterCategory("");
    }}
    sx={{
      borderRadius: "30px",
      textTransform: "none",
      borderColor: "black",
      color: "black",
      "&:hover": {
        borderColor: "black",
        backgroundColor: "#f0f0f0",
      },
    }}
  >
    Clear Filters
  </Button>
  <Button
    variant="outlined"
    onClick={() => setIsFilterModalOpen(true)}
    sx={{
      borderRadius: "30px",
      textTransform: "none",
      borderColor: "black",
      color: "black",
      "&:hover": {
        borderColor: "black",
        backgroundColor: "#f0f0f0",
      },
    }}
  >
    Advanced Search
  </Button>
</Box>


          {loading ? (
            <Typography textAlign="center">Loading...</Typography>
          ) : error ? (
            <Typography textAlign="center" color="error">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.itemID}>
                    <Box
                      sx={{
                        backgroundColor: "#e1e1e1",
                        borderRadius: 2,
                        overflow: "hidden",
                        textAlign: "center",
                        boxShadow: 2,
                        transition: "0.3s",
                        color: "#000",
                        "&:hover": { boxShadow: 4 },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.itemName}
                        sx={{ width: "100%", height: 250, objectFit: "contain", cursor: "pointer" }}
                        onClick={() => handleImageClick(item)}
                      />
                      <Box px={2} pt={2} textAlign="left">
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {item.itemName}
                        </Typography>
                        <Typography variant="body2">
                          Date Found: <strong>{item.date || "N/A"}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Location: <strong>{item.location || "Unknown"}</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Which office to claim: SSG Office at RTL
                        </Typography>
                      </Box>
                      <Box px={2} pb={2} pt={1}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpen(item)}
                          sx={{
                            backgroundColor: "#800000",
                            borderRadius: "30px",
                            fontWeight: "bold",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#a00000" },
                          }}
                        >
                          CLAIM
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Typography textAlign="center" sx={{ width: "100%" }}>
                  No items found.
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>

      <Footer />

      {/* Claim Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            color: "black",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {selectedItem && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedItem.itemName}
              </Typography>
              <CardMedia
                component="img"
                height="200"
                image={selectedItem.imageUrl || "/placeholder.svg"}
                alt={selectedItem.itemName}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Typography variant="body1">
                <strong>Location:</strong> {selectedItem.location}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedItem.description || "No description available."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Office: SSG Office at RTL
              </Typography>
              <TextField
                fullWidth
                label="Why is this item yours?"
                variant="outlined"
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "16px" }} />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Proof Preview"
                  style={{ width: "100%", marginTop: "10px", borderRadius: "4px" }}
                />
              )}
              <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={handleClaimSubmit}>
                Claim
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Image Preview Modal */}
      <Modal open={isImageModalOpen} onClose={handleImageModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "900px",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            overflow: "hidden",
            flexDirection: "row",
          }}
        >
          {imagePreviewItem && (
            <>
              <Box
                sx={{
                  width: "50%",
                  height: "100%",
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "1px solid #ddd",
                }}
              >
                <img
                  src={imagePreviewItem.imageUrl || "/placeholder.svg"}
                  alt={imagePreviewItem.itemName}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  color: "black",
                  overflowY: "auto",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {imagePreviewItem.itemName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong> {imagePreviewItem.location}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {imagePreviewItem.description || "No description available."}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Office to Claim: SSG Office at RTL
                  </Typography>
                  <TextField
                    fullWidth
                    label="Why is this item yours?"
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{ mt: 2 }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 2, width: "100%", backgroundColor: "#800000", "&:hover": { backgroundColor: "#a00000" } }}
                    onClick={handleClaimSubmit}
                  >
                    Claim
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Filter Modal */}
      <Modal open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
  Filter Lost Items
</Typography>

          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date Found"
            InputLabelProps={{ shrink: true }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => setIsFilterModalOpen(false)}
            sx={{ backgroundColor: "#800000", "&:hover": { backgroundColor: "#a00000" } }}
          >
            Apply Filters
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LostItemsPage;
