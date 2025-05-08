import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Typography
} from "@mui/material";

const ClaimRequestsList = ({ claims, onApproveClaim, onDenyClaim }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 2, overflow: "hidden" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Claim Requests
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: "#D9D9D9" }}>
                        <TableRow>
                            <TableCell><strong>Image</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Location Found</strong></TableCell>
                            <TableCell><strong>Date Found</strong></TableCell>
                            <TableCell><strong>Item Status</strong></TableCell>
                            <TableCell><strong>Claimed By</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {claims
                    .filter((claim) => claim.item?.status === "Confirmed")
                    .map((claim) => (
                            <TableRow key={claim.requestId} sx={{ backgroundColor: "#EAEAEA" }}>
                                <TableCell>
                                    <img
                                        src={
                                            claim.item?.imageUrl?.startsWith("http")
                                                ? claim.item.imageUrl
                                                : `${API_CONFIG.BASE_URL}/uploads/${claim.item?.imageUrl}`
                                        }
                                        alt={claim.item?.itemName || "Item"}
                                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                                    />
                                </TableCell>
                                <TableCell>{claim.item?.itemName || "-"}</TableCell>
                                <TableCell>{claim.item?.location || "N/A"}</TableCell>
                                <TableCell>{claim.item?.foundDate || "N/A"}</TableCell>
                                <TableCell>{claim.item?.status || "N/A"}</TableCell>
                                <TableCell>
                                    {claim.user
                                        ? `${claim.user.firstname} ${claim.user.lastname}`
                                        : "Unknown"}
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onApproveClaim(claim.requestId)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => onDenyClaim(claim.requestId)}
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
        </Paper>
    );
};

export default ClaimRequestsList;
