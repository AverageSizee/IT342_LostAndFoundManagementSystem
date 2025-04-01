import React, { useEffect, useState } from "react";
import { 
    Card, CardContent, Typography, TextField, IconButton, Avatar, List, ListItem, 
    ListItemIcon, ListItemText, Button, Grid, CardMedia 
} from "@mui/material";
import { Search, People, Inventory, HourglassEmpty, MoreVert, Edit, Delete, CheckCircle, Assignment } from "@mui/icons-material";

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState("users");
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [claimRequests, setClaimRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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
            const response = await fetch("http://localhost:8080/user/getall", {
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
            const response = await fetch("http://localhost:8080/items", {
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
            const response = await fetch(`http://localhost:8080/items/confirm/${itemId}`, {
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
            const response = await fetch("http://localhost:8080/claims/getall", {
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
            const response = await fetch(`http://localhost:8080/claims/approve/${requestId}`, {
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
                                <strong>{item.reportedBy ? "Reported By:" : "Claimed By:"}</strong>{" "}
                                {item.reportedBy
                                    ? item.reportedBy.firstname + " " + item.reportedBy.lastname
                                    : item.claimedBy.firstname + " " + item.claimedBy.lastname}
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) :  (
                    <Typography>No section selected.</Typography>
                )}
            </div>
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
    buttonContainer: { marginTop: "10px", display: "flex", gap: "10px" },
    selectedItem: { backgroundColor: "#ffffff33", borderRadius: "5px" },
    defaultItem: { borderRadius: "5px" },
};

export default AdminPage;
