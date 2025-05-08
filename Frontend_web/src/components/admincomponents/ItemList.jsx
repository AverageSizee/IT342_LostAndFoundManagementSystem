import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const ItemList = ({ items, onDelete, onEdit, onMarkAsUnclaimed }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0); // Tab state (0 = Active, 1 = Archived)

  const handleDelete = (itemID) => {
    setCurrentItem(items.find((item) => item.itemID === itemID));
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    onDelete(currentItem.itemID);
    setOpenDeleteConfirmModal(false);
  };

  const handleEdit = (itemID) => {
    const itemToEdit = items.find((item) => item.itemID === itemID);
    setCurrentItem(itemToEdit);
    setOpenEditModal(true);
  };

  const handleMarkAsUnclaimed = (itemID) => {
    onMarkAsUnclaimed(itemID);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentItem(null);
  };

  const handleSaveEdit = () => {
    onEdit(currentItem);
    setOpenEditModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const safeCurrentItem = currentItem || {};

  // Filter items based on the tab selection (Active or Archived)
  const filteredItems = items.filter((item) => {
    const query = searchTerm.toLowerCase();
    const isActiveTab = activeTab === 0; // 0 for Active, 1 for Archived
    const isItemActive = item.status === "Confirmed";  // Active items should have "Confirmed"
    const isItemArchived = item.status === "Claimed";  // Archived items should have "Claimed"

    return (
        (isActiveTab && isItemActive) || (activeTab === 1 && isItemArchived)
    ) && (
        item.itemName.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.foundDate.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );
});


  return (
    <Paper sx={{ p: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Tabs for Active and Archived Items */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newTab) => setActiveTab(newTab)}
          aria-label="Item Status Tabs"
        >
          <Tab label="Active Items" />
          <Tab label="Claimed (Archived) Items" />
        </Tabs>
      </Box>

      {/* Search Input */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Item List
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

      {/* Item Table */}
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
              <TableCell><strong>Reported By</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.itemID}
                sx={{
                  backgroundColor: item.status === "Claimed" ? "#e0e0e0" : "#EAEAEA",
                }}
              >
                <TableCell>
                  <img
                    src={item.imageUrl?.startsWith("http") ? item.imageUrl : `${API_CONFIG.BASE_URL}/uploads/${item.imageUrl}`}
                    alt={item.itemName}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{item.itemName || "-"}</TableCell>
                <TableCell>{item.location || "Not specified"}</TableCell>
                <TableCell>{item.foundDate || "Unknown"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.claimedBy ? `${item.claimedBy.firstname} ${item.claimedBy.lastname}` : "N/A"}
                </TableCell>
                <TableCell>
                  {item.reportedBy ? `${item.reportedBy.firstname} ${item.reportedBy.lastname}` : "N/A"}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(item.itemID)}
                      disabled={item.status === "Claimed"}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(item.itemID)}
                      disabled={item.status === "Claimed"}
                    >
                      Delete
                    </Button>
                    {item.claimedBy && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleMarkAsUnclaimed(item.itemID)}
                      >
                        Mark as Unclaimed
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            name="itemName"
            value={safeCurrentItem.itemName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            label="Location Found"
            name="location"
            value={safeCurrentItem.location || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date Found"
            name="foundDate"
            type="date"
            value={safeCurrentItem.foundDate || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteConfirmModal}
        onClose={() => setOpenDeleteConfirmModal(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ItemList;
