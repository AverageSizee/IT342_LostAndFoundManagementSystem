import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const PendingReviewList = ({ items, onApprove, onDeny }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleApprove = (itemId) => {
    onApprove(itemId);
    setFilteredItems((prev) => prev.filter((item) => item.itemID !== itemId));
  };

  const handleDeny = (itemId) => {
    onDeny(itemId);
    setFilteredItems((prev) => prev.filter((item) => item.itemID !== itemId));
  };

  const filteredData = filteredItems
    .filter((item) => item.status === "Reported")
    .filter((item) =>
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foundDate.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Paper sx={{ p: 2, borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Pending Review Items
        </Typography>
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            backgroundColor: "#EEE",
            borderRadius: 1,
            width: "300px",
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
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#D9D9D9" }}>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Location Found</strong></TableCell>
              <TableCell><strong>Date Found</strong></TableCell>
              <TableCell><strong>Item Status</strong></TableCell>
              <TableCell><strong>Reported By</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.itemID} sx={{ backgroundColor: "#EAEAEA" }}>
                <TableCell>
                  <img
                    src={
                      item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : `http://localhost:8080/uploads/${item.imageUrl}`
                    }
                    alt={item.itemName}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{item.itemName || "-"}</TableCell>
                <TableCell>{item.location || "Not specified"}</TableCell>
                <TableCell>{item.foundDate || "Unknown"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.reportedBy
                    ? `${item.reportedBy.firstname} ${item.reportedBy.lastname}`
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {item.status === "Reported" && (
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(item.itemID)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeny(item.itemID)}
                      >
                        Deny
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PendingReviewList;
