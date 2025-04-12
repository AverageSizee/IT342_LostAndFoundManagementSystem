import { useState } from "react"
import axios from "axios"
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem } from "@mui/material"
import { Close as CloseIcon, UploadFile as UploadFileIcon } from "@mui/icons-material"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import InputAdornment from "@mui/material/InputAdornment";
import { API_CONFIG } from '../config/apiConfig';

const ReportLostItem = ({ open, onClose, userID }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    foundDate: "",
    status: "",
    claimDate: "",
    location: "",
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewURL, setPreviewURL] = useState("")
  const [loading, setLoading] = useState(false)

  const locations = ["RTl", "NGE", "GLE", "ALLIED", "ESPACIO", "STUDYAREA", "GMART", "GLINK"]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewURL(URL.createObjectURL(file))
    }
  }

  const handleReport = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No authentication token found! Please log in.");
      return;
    }
  
    if (!userID) {
      alert("User ID is missing!");
      return;
    }
  
    try {
      setLoading(true);
  
      const formDataToSend = new FormData();
  
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }
  
      // Append JSON data as a Blob
      formDataToSend.append(
        "item",
        new Blob(
          [JSON.stringify({
            itemName: formData.itemName,
            description: formData.description,
            foundDate: formData.foundDate,
            location: formData.location,
            status: formData.status || "Lost",
          })],
          { type: "application/json" }
        )
      );
  
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/items/report/${userID}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error reporting lost item:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="report-lost-item-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            bgcolor: "#800000",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
            CIT-U Lost & Found
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
          <Box
            sx={{
              flex: 1,
              padding: "30px",
              bgcolor: "white",
              borderRadius: { xs: "0", md: "0 0 0 15px" },
              textAlign: "center",
              color: "#333",
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "24px", mb: 2, color: "#800000" }}>
              Report Lost Item
            </Typography>
            <form onSubmit={handleReport}>
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#800000" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#800000" },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#800000" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#800000" },
                }}
              />
            <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
            <TextField
                fullWidth
                label="Found Date"
                name="foundDate"
                type="date"
                value={formData.foundDate}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#800000" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#800000" },
                }}
            />
            <CalendarTodayIcon
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: "10px", 
                    transform: "translateY(-50%)", 
                    fontSize: 30, 
                    pointerEvents: "none", 
                    opacity: 0.6, 
                }}
            />
            </Box>
              {/* Location Dropdown */}
              <TextField
                select
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#800000" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#800000" },
                }}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  bgcolor: "#f0ad4e",
                  color: "white",
                  "&:hover": { bgcolor: "#ec971f" },
                  textTransform: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Reporting..." : "Report Item"}
              </Button>
            </form>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "whitesmoke",
              borderRadius: { xs: "0", md: "0 15px 15px 0" },
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              backgroundImage: previewURL ? `url(${previewURL})` : "none",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {previewURL && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            )}

            <input accept="image/*" type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="file-upload">
              <Button component="span" variant="contained" startIcon={<UploadFileIcon />} sx={{ bgcolor: "#800000", color: "white" }}>
                Upload Image
              </Button>
            </label>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default ReportLostItem
