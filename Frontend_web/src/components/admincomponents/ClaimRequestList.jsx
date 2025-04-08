import React from "react";
import { Grid, Card, CardContent, Typography, Button, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { CheckCircle, Edit, Delete } from "@mui/icons-material";

const ClaimRequestsList = ({ claims, onApproveClaim, onEditClaim, onDeleteClaim }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image Name</TableCell>
                        <TableCell>Location Found</TableCell>
                        <TableCell>Date Found</TableCell>
                        <TableCell>Item Status</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Marked as Claimed</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {claims.map((claim) => (
                        <TableRow key={claim.requestId}>
                            <TableCell>
                                <CardMedia
                                    component="img"
                                    height="50"
                                    image={claim.item.imageUrl || "/placeholder.svg"}
                                    alt={claim.itemName}
                                />
                            </TableCell>
                            <TableCell>{claim.locationFound}</TableCell>
                            <TableCell>{claim.dateFound}</TableCell>
                            <TableCell>{claim.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckCircle />}
                                    onClick={() => onApproveClaim(claim.requestId)}
                                >
                                    Approve
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<Edit />}
                                    onClick={() => onEditClaim(claim.requestId)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color={claim.claimed ? "success" : "default"}
                                    onClick={() => onApproveClaim(claim.requestId)}
                                >
                                    {claim.claimed ? "Yes" : "No"}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() => onDeleteClaim(claim.requestId)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClaimRequestsList;
