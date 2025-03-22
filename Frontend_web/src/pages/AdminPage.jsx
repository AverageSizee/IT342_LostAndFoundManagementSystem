import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, IconButton, Avatar, Button } from "@mui/material";
import { Search, Add, MoreVert } from "@mui/icons-material";

const AdminPage = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:8080/user/getall", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                console.log("API Response:", data); // Debugging

                if (Array.isArray(data)) {
                    setContacts(data);
                } else {
                    console.error("Expected an array but got:", data);
                    setContacts([]);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchContacts();
    }, []);

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <Button variant="contained" color="primary" startIcon={<Add />}>
                    Create Contact
                </Button>
            </div>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                    <Typography variant="h5">Contacts</Typography>
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
                {contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <Card key={contact.schoolId} style={styles.card}>
                            <CardContent>
                                <Typography variant="h6">{contact.firstname} {contact.lastname}</Typography>
                                <Typography color="textSecondary">{contact.email}</Typography>
                                <Typography variant="body2">{contact.role}</Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No contacts found.</Typography>
                )}
            </div>
        </div>
    );
};

// ✅ React Inline Styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#282c34",
        padding: "20px",
        color: "#fff",
        position: "fixed",
        height: "100vh",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    searchContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    profilePic: {
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
    },
    content: {
        marginLeft: "250px",
        padding: "20px",
    },
    card: {
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ddd",
    },
};

export default AdminPage;
