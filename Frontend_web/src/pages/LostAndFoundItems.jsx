// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Container,
//   Card,
//   CardContent,
//   CardMedia,
//   Grid,
//   Button,
//   Modal,
//   TextField,
// } from "@mui/material";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const LostItemsPage = () => {
//   const [lostItems, setLostItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [reason, setReason] = useState("");
//   const [proofImage, setProofImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const fetchLostItems = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Unauthorized: No token found");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:8080/items", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setLostItems(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch items");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLostItems();
//   }, []);

//   // Handle item click to open modal
//   const handleOpen = (item) => {
//     setSelectedItem(item);
//     setReason("");
//     setProofImage(null);
//     setPreviewImage(null);
//     setOpen(true);
//   };

//   // Handle closing modal
//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Handle image upload
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setProofImage(file);
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   // Handle claim submission
//   const handleClaimSubmit = async () => {
//     if (!reason) {
//       alert("Please enter a reason for claiming this item.");
//       return;
//     }
  
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       alert("Unauthorized: No token found");
//       return;
//     }
  
//     try {
//       // Fetch the userId first
//       const userResponse = await axios.get("http://localhost:8080/user/getcurrentuser", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       const userId = userResponse.data.schoolId; // Adjust based on API response
  
//       if (!userId) {
//         alert("Failed to retrieve user ID.");
//         return;
//       }
      
//       // console.log("User ID:", userId);
//       // console.log("Item ID:", selectedItem.itemID);
//       // console.log("Claim Date:", new Date().toISOString().split("T")[0]);
//       // console.log("Reason:", reason);
//       // Proceed with claim submission
//       await axios.post(
//         `http://localhost:8080/claims/request?userId=${userId}&itemId=${selectedItem.itemID}&claimDate=${new Date().toISOString().split("T")[0]}&reason=${encodeURIComponent(reason)}`,
//         {}, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       alert("Claim request submitted successfully.");
//       handleClose();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to submit claim.");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       <Header />

//       <Container sx={{ flexGrow: 1, py: 4 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           sx={{ color: "#800000", textAlign: "center" }}
//         >
//           Lost Items
//         </Typography>

//         {loading ? (
//           <Typography textAlign="center">Loading...</Typography>
//         ) : error ? (
//           <Typography textAlign="center" color="error">
//             {error}
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {lostItems.length > 0 ? (
//               lostItems.filter((item) => item.status === "Confirmed").length >
//               0 ? (
//                 lostItems
//                   .filter((item) => item.status === "Confirmed")
//                   .map((item) => (
//                     <Grid item xs={12} sm={6} md={4} key={item.itemID}>
//                       <Card
//                         sx={{
//                           height: "100%",
//                           display: "flex",
//                           flexDirection: "column",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => handleOpen(item)}
//                       >
//                         <CardMedia
//                           component="img"
//                           height="140"
//                           image={item.imageUrl || "/placeholder.svg?height=200&width=200"}
//                           alt={item.itemName}
//                         />
//                         <CardContent sx={{ flexGrow: 1 }}>
//                           <Typography gutterBottom variant="h5" component="div">
//                             {item.itemName}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Location: {item.location || "Unknown"}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Date: {item.date || "No date available"}
//                           </Typography>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   ))
//               ) : (
//                 <Typography textAlign="center" sx={{ width: "100%" }}>
//                   No lost items found.
//                 </Typography>
//               )
//             ) : (
//               <Typography textAlign="center" sx={{ width: "100%" }}>
//                 No lost items found.
//               </Typography>
//             )}
//           </Grid>
//         )}
//       </Container>

//       <Footer />

//       {/* Modal for Claiming Item */}
//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           {selectedItem && (
//             <>
//               <Typography variant="h5" gutterBottom>
//                 {selectedItem.itemName}
//               </Typography>
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={selectedItem.imageUrl || "/placeholder.svg"}
//                 alt={selectedItem.itemName}
//                 sx={{ borderRadius: 2, mb: 2 }}
//               />
//               <Typography variant="body1">
//                 <strong>Location:</strong> {selectedItem.location}
//               </Typography>
//               <Typography variant="body1">
//                 <strong>Description:</strong> {selectedItem.description || "No description available."}
//               </Typography>

//               <TextField
//                 fullWidth
//                 label="Why is this item yours?"
//                 variant="outlined"
//                 multiline
//                 rows={3}
//                 sx={{ mt: 2 }}
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />

//               {/* File Upload */}
//               <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "16px" }} />
//               {previewImage && (
//                 <img
//                   src={previewImage}
//                   alt="Proof Preview"
//                   style={{ width: "100%", marginTop: "10px", borderRadius: "4px" }}
//                 />
//               )}

//               <Button variant="contained" sx={{ mt: 2, width: "100%" }} onClick={handleClaimSubmit}>
//                 Claim
//               </Button>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };
// export default LostItemsPage;
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Modal,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
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
        const response = await axios.get("http://localhost:8080/items", {
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

  const handleClose = () => {
    setOpen(false);
  };

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
      const userResponse = await axios.get("http://localhost:8080/user/getcurrentuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userResponse.data.schoolId;

      if (!userId) {
        alert("Failed to retrieve user ID.");
        return;
      }

      await axios.post(
        `http://localhost:8080/claims/request?userId=${userId}&itemId=${selectedItem.itemID}&claimDate=${new Date().toISOString().split("T")[0]}&reason=${encodeURIComponent(reason)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Claim request submitted successfully.");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit claim.");
    }
  };

  const addRecentSearch = (term) => {
    const trimmed = term.trim();
    if (trimmed && !recentSearches.includes(trimmed)) {
      setRecentSearches([trimmed, ...recentSearches.slice(0, 4)]);
    }
  };
  

  const removeRecentSearch = (term) => {
    setRecentSearches(recentSearches.filter((t) => t !== term));
  };

  const filteredItems = searchTerm
    ? lostItems.filter(
        (item) =>
          item.status === "Confirmed" &&
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : lostItems.filter((item) => item.status === "Confirmed");
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#5a1818" }}>
      <Header />
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "white", textAlign: "center" }}
        >
          <br></br>
          CIT - U LOST & FOUND SYSTEM
          <br></br>
        </Typography>
        <br></br>
        {/* Search Bar */}
        <Box
                  sx={{backgroundColor: "white", borderRadius: "10px", padding: "20px"}}
                >
        <TextField
          fullWidth
          placeholder="Type in keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate(`/search?query=${searchTerm}`);
            }
          }}
          
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            //backgroundColor: "#f1f1f1",
            borderRadius: "30px",
            color: "#000",
          }}
        />

        {/* Recent Searches */}
        {!searchTerm && recentSearches.filter(term => term.trim() !== "").length > 0 && (
          <Box textAlign="center" mb={3}>
            <Typography variant="subtitle1">Recent Searches</Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={1}>
              {recentSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onDelete={() => removeRecentSearch(term)}
                  sx={{ backgroundColor: "#e0e0e0" }}
                />
              ))}
            </Box>
          </Box>
        )}

        {searchTerm && (
          <Typography variant="h6" textAlign="center" gutterBottom>
            Results for: <strong>{searchTerm}</strong>
          </Typography>
        )}

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
                  <Card
                    sx={{
                      backgroundColor: "#e1e1e1",
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: 130,
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 4 },
                    }}
                    onClick={() => handleOpen(item)}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        objectFit: "cover",
                        mr: 2,
                      }}
                      image={item.imageUrl || "/placeholder.svg"}
                      alt={item.itemName}
                    />

                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      <Typography variant="subtitle1" noWrap>
                        {item.itemName} found at {item.location || "Unknown"}
                      </Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        Date Found: {item.date || "No date available"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Office: {item.office || "Not specified"}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 1,
                          px: 2,
                          backgroundColor: "#800000",
                          "&:hover": { backgroundColor: "#a00000" },
                        }}
                      >
                        CLAIM
                      </Button> */}
                    </Box>
                  </Card>
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

      {/* Modal for Claiming Item */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            color: "black"
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
                Office: {selectedItem.office || "Not specified"}
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
    </Box>
  );
};

export default LostItemsPage;