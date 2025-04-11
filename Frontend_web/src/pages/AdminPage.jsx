import React, { useEffect, useState } from "react";
import { 
    Card, CardContent, Typography, TextField, IconButton, Avatar, List, ListItem, 
    ListItemIcon, ListItemText, Button, Grid, CardMedia,Modal,Box,Input
} from "@mui/material";
import { Search, People, Inventory, HourglassEmpty, MoreVert, Edit, Delete, CheckCircle, Assignment } from "@mui/icons-material";
import { API_CONFIG } from '../config/apiConfig';

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState("users");
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [claimRequests, setClaimRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [foundDate, setFoundDate] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState(null); // For file input
    const [imagePreview, setImagePreview] = useState(null); // For image preview

    useEffect(() => {
        if (selectedSection === "users") {
            fetchUsers();
        } else if (selectedSection === "items" || selectedSection === "pendingReview") {
            fetchItems();
        }else if (selectedSection === "claimRequests") {
            fetchClaimRequests();
        }
    }, [selectedSection]);

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/getall`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch Items
    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            console.log(data);
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // Confirm Item Function
    const confirmItem = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/items/confirm/${itemId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setItems(items.map(item => 
                    item.itemID === itemId ? { ...item, status: "Confirmed" } : item
                ));
            } else {
                console.error("Failed to confirm item");
            }
        } catch (error) {
            console.error("Error confirming item:", error);
        }
    };

    // Fetch Claim Requests
    const fetchClaimRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/claims/getall`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            // console.log(data);
            setClaimRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching claim requests:", error);
        }
    };
    // Approve Claim Function
    const approveClaim = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/claims/approve/${requestId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                // Update claim request status to approved
                setClaimRequests(claimRequests.map(request =>
                    request.requestId === requestId ? { ...request, status: "Approved" } : request
                ));
            } else {
                console.error("Failed to approve claim");
            }
        } catch (error) {
            console.error("Error approving claim:", error);
        }
    };

    const markUnclaimed = async (itemId) => {
        try {
            console.log("Marking item as unclaimed:", itemId);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/items/unclaim/${itemId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
                // Update items state instead of claimRequests
                setItems(items.map(item =>
                    item.itemID === itemId 
                        ? { ...item, claimedBy: null, status: "Confirmed" } 
                        : item
                ));
            } else {
                console.error("Failed to mark unclaimed");
            }
        } catch (error) {
            console.error("Error marking unclaimed:", error);
        }
    };
    const deleteClaimRequest = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/claims/delete/${requestId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
                // Remove the deleted request from state
                setClaimRequests(claimRequests.filter(request => request.requestId !== requestId));
            } else {
                console.error("Failed to delete claim request");
            }
        } catch (error) {
            console.error("Error deleting claim request:", error);
        }
    };
    
    const deleteItem = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/items/delete/${itemId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
                setItems(items.filter(item => item.itemID !== itemId));
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };
    const handleEditItem = (item) => {
        setSelectedItem(item);
        setItemName(item.itemName);
        setDescription(item.description);
        setFoundDate(item.foundDate);
        setLocation(item.location);
        setImagePreview(item.imageUrl);  // Set the preview image if any
        setOpen(true);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);  // Preview the image
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("description", description);
        formData.append("foundDate", foundDate);
        formData.append("location", location);
        if (file) {
            formData.append("file", file);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_CONFIG.BASE_URL}/items/update/${selectedItem.itemID}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setItems(items.map(item => item.itemID === updatedItem.itemID ? updatedItem : item));
                setOpen(false);
                setSelectedItem(null);
            } else {
                console.error("Failed to update item");
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };
    

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <List>
                    <ListItem 
                        button 
                        onClick={() => setSelectedSection("users")} 
                        style={selectedSection === "users" ? styles.selectedItem : styles.defaultItem}
                    >
                        <ListItemIcon>
                            <People style={{ color: selectedSection === "users" ? "#007bff" : "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>

                    <ListItem 
                        button 
                        onClick={() => setSelectedSection("items")} 
                        style={selectedSection === "items" ? styles.selectedItem : styles.defaultItem}
                    >
                        <ListItemIcon>
                            <Inventory style={{ color: selectedSection === "items" ? "#007bff" : "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Items" />
                    </ListItem>

                    <ListItem 
                        button 
                        onClick={() => setSelectedSection("pendingReview")} 
                        style={selectedSection === "pendingReview" ? styles.selectedItem : styles.defaultItem}
                    >
                        <ListItemIcon>
                            <HourglassEmpty style={{ color: selectedSection === "pendingReview" ? "#007bff" : "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Pending Review" />
                    </ListItem>

                    <ListItem 
                        button 
                        onClick={() => setSelectedSection("claimRequests")} 
                        style={selectedSection === "claimRequests" ? styles.selectedItem : styles.defaultItem}
                    >
                        <ListItemIcon>
                            <Assignment style={{ color: selectedSection === "claimRequests" ? "#007bff" : "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Claim Requests" />
                    </ListItem>
                </List>
            </div>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                    <Typography variant="h5">{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}</Typography>
                </div>
                <div style={styles.searchContainer}>
                    <Search />
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Avatar style={styles.profilePic}>A</Avatar>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {selectedSection === "users" ? (
                    users.length > 0 ? (
                        users.map((user) => (
                            <Card key={user.schoolId} style={styles.card}>
                                <CardContent>
                                    <Typography variant="h6">{user.firstname} {user.lastname}</Typography>
                                    <Typography color="textSecondary">{user.email}</Typography>
                                    <Typography variant="body2">{user.role}</Typography>
                                    <div style={styles.buttonContainer}>
                                        <Button variant="contained" color="primary" size="small" startIcon={<Edit />}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" size="small" startIcon={<Delete />}>
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No users found.</Typography>
                    )
                ) : selectedSection === "items" ? (
                    <Grid container spacing={3}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.itemID}>
                        <Card>
                            {/* Item Image */}
                            <CardMedia
                            component="img"
                            height="140"
                            image={item.imageUrl || "/placeholder.svg"}
                            alt={item.itemName}
                            />
                            <CardContent>
                            {/* Item Name */}
                            <Typography variant="h5" gutterBottom>
                                {item.itemName}
                            </Typography>

                            {/* Item Status */}
                            <Typography color="textSecondary">
                                <strong>Status:</strong> {item.status}
                            </Typography>

                            {/* Found Date */}
                            <Typography color="textSecondary">
                                <strong>Found Date:</strong> {item.foundDate || "Unknown"}
                            </Typography>

                            {/* Location */}
                            <Typography color="textSecondary">
                                <strong>Location:</strong> {item.location || "Not specified"}
                            </Typography>

                            {/* Reported By */}
                            <Typography color="textSecondary">
                                <strong>{item.claimedBy ? "Claimed By:" : "Reported By:"}</strong>{" "}
                                {item.claimedBy
                                    ? item.claimedBy.firstname + " " + item.claimedBy.lastname
                                    : item.reportedBy? item.reportedBy.firstname + " " + item.reportedBy.lastname : "Unknown"}
                            </Typography>

                            {/* Claimed By (if applicable) */}
                            {item.isClaimed && (
                                <Typography color="textSecondary">
                                <strong>Claimed By:</strong>{" "}
                                {item.claimedBy ? item.claimedBy.fistname : "Unknown"}
                                </Typography>
                            )}

                            {/* Claim Date (if claimed) */}
                            {item.isClaimed && item.claimDate && (
                                <Typography color="textSecondary">
                                <strong>Claim Date:</strong> {item.claimDate}
                                </Typography>
                            )}
                            {item.claimedBy ? (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small" 
                                    startIcon={<Edit />} 
                                    onClick={() => markUnclaimed(item.itemID)}
                                >
                                    Mark as Unclaimed
                                </Button>
                            ) : null}  
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                size="small" 
                                startIcon={<Delete />} 
                                onClick={() => deleteItem(item.itemID)}
                            >
                                Delete
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="small" 
                                startIcon={<Edit />} 
                                onClick={() => handleEditItem(item)}
                            >
                                Edit
                            </Button>
                            </CardContent>
                        </Card>
                        </Grid>
                    ))}
                    </Grid>
                ) : selectedSection === "pendingReview" ? (
                    <Grid container spacing={3}>
                        {items.filter(item => item.status === "Reported").map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.itemID}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={item.imageUrl || "/placeholder.svg"}
                                        alt={item.itemName}
                                    />
                                    <CardContent>
                                        <Typography variant="h5">{item.itemName}</Typography>
                                        <Typography color="textSecondary"><strong>Status:</strong> {item.status}</Typography>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={<CheckCircle />} 
                                            onClick={() => confirmItem(item.itemID)}
                                        >
                                            Confirm
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : selectedSection === "claimRequests" ? (
                    <Grid container spacing={3}>
                        {claimRequests.map((request) => (
                            <Grid item xs={12} sm={6} md={4} key={request.requestId}>
                                <Card>
                                <CardMedia
                                        component="img"
                                        height="140"
                                        image={request.item.imageUrl || "/placeholder.svg"}
                                        alt={request.itemName}
                                    />
                                    <CardContent>
                                        <Typography variant="h5">{request.item.itemName}</Typography>
                                        <Typography color="textSecondary">{request.reason}</Typography>
                                        <Typography color="textSecondary">
                                            <strong>Status:</strong> {request.status}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<CheckCircle />}
                                            onClick={() => approveClaim(request.requestId)}
                                        >
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            startIcon={<Delete />} 
                                            onClick={() => deleteClaimRequest(request.requestId)}
                                        >
                                            Delete
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) :  (
                    <Typography>No section selected.</Typography>
                )}
            </div>
            {/* Modal for Edit Item */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={styles.modalBox}>
                    <Typography variant="h6">Edit Item</Typography>
                    <TextField
                        label="Item Name"
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="Found Date"
                        fullWidth
                        value={foundDate}
                        onChange={(e) => setFoundDate(e.target.value)}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <Input
                        type="file"
                        onChange={handleFileChange}
                    />
                    <div style={styles.imagePreview}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px" }} />
                        ) : (
                            <Typography>No image selected</Typography>
                        )}
                    </div>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </Box>
            </Modal>
        </div>
    );
};

// ✅ Styles
const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh" },
    sidebar: { width: "250px", backgroundColor: "#282c34", padding: "20px", color: "#fff", position: "fixed", height: "100vh" },
    header: { display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid #ddd", backgroundColor: "#f8f9fa" },
    content: { marginLeft: "250px", padding: "20px" },
    card: { padding: "10px", border: "1px solid #ddd" },
    modalBox: { padding: "20px", backgroundColor: "white", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", boxShadow: 24 },
    imagePreview: { marginTop: "10px" },
};

export default AdminPage;
