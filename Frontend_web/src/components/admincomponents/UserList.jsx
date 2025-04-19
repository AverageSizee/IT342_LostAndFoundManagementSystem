import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    Box,
    TextField
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserList = ({ users, onUpdateUser, onDeleteUser }) => {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});

    const handleOpen = (user) => {
        setSelectedUser(user);
        setEditedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdateUser(editedUser);
        handleClose();
    };

    

    return (
        <>
            {users.length > 0 ? (
                users.map((user) => (
                    <Card key={user.schoolId} style={styles.card}>
                        <CardContent>
                            <Typography variant="h6">{user.firstname} {user.lastname}</Typography>
                            <Typography color="textSecondary">{user.email}</Typography>
                            <Typography variant="body2">{user.role}</Typography>
                            <div style={styles.buttonContainer}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => handleOpen(user)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    startIcon={<Delete />}
                                    onClick={() => onDeleteUser(user.schoolId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No users found.</Typography>
            )}

            {/* Edit Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={styles.modalBox}>
                    <Typography variant="h6">Edit User</Typography>
                    <TextField
                        label="First Name"
                        name="firstname"
                        value={editedUser.firstname || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        name="lastname"
                        value={editedUser.lastname || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={editedUser.email || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Role"
                        name="role"
                        value={editedUser.role || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <div style={styles.buttonContainer}>
                        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

const styles = {
    card: { padding: "10px", border: "1px solid #ddd", marginBottom: "10px" },
    buttonContainer: { marginTop: "10px", display: "flex", gap: "10px" },
    modalBox: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        backgroundColor: "white",
        padding: "20px",
        boxShadow: 24,
        borderRadius: "8px"
    }
};

export default UserList;
