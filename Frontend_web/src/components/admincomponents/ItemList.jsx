import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, InputAdornment, Button } from "@mui/material";
import { Search } from "@mui/icons-material";

const ItemList = ({ items, onApprove, onDeny }) => { // Add onApprove and onDeny props
    return (
        <Paper sx={{ p: 2, borderRadius: 2, overflow: "hidden" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, display: "flex", alignItems: "center" }}>
                <TextField
                    size="small"
                    placeholder="Search"
                    sx={{
                        backgroundColor: "#EEE",
                        borderRadius: 1,
                        mr: 2,
                        "& .MuiInputBase-input": { color: "#000" },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: "#D9D9D9" }}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Location Found</strong></TableCell>
                            <TableCell><strong>Date Found</strong></TableCell>
                            <TableCell><strong>Item Status</strong></TableCell>
                            <TableCell><strong>Reported by</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.itemID} sx={{ backgroundColor: "#EAEAEA" }}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.location || "Not specified"}</TableCell>
                                <TableCell>{item.foundDate || "Unknown"}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.reportedBy ? item.reportedBy.firstname + " " + item.reportedBy.lastname : "-"}</TableCell>
                                <TableCell align="right">
                                    {/* Approve and Deny Buttons */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mr: 2 }}
                                        onClick={() => onApprove(item.itemID)} // Call approve action
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => onDeny(item.itemID)} // Call deny action
                                    >
                                        Deny
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ItemList;
