import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CardMedia, Box, TextField, InputAdornment, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

const PendingReviewList = ({ items, onApprove, onDeny }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter items based on search input
    const filteredItems = items.filter(item =>
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.foundDate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            {/* Title & Search Bar */}
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, width: "300px" }}
                />
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Image</strong></TableCell>
                            <TableCell><strong>Location Found</strong></TableCell>
                            <TableCell><strong>Date Found</strong></TableCell>
                            <TableCell><strong>Item Status</strong></TableCell>
                            <TableCell><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.map((item) => (
                            <TableRow key={item.itemID}>
                                <TableCell>
                                    <CardMedia
                                        component="img"
                                        height="50"
                                        image={item.imageUrl || "/placeholder.svg"}
                                        alt={item.itemName}
                                        style={{ borderRadius: "5px" }}
                                    />
                                </TableCell>
                                <TableCell>{item.location || "Not specified"}</TableCell>
                                <TableCell>{item.foundDate || "Unknown"}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => onApprove(item.itemID)}
                                        >
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            onClick={() => onDeny(item.itemID)}
                                        >
                                            Deny
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PendingReviewList;
