import React, { useState, useEffect } from "react";
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  TextField, Avatar, IconButton, Button, Paper, InputAdornment, Toolbar,
  Typography // Add this import
} from "@mui/material";
import { 
  Search, People, Inventory, HourglassEmpty, Assignment
} from "@mui/icons-material";
import Header from "../components/Header";
import UserList from "../components/admin/UserList";
import ItemList from "../components/admin/ItemList";
import PendingReviewList from "../components/admin/PendingReviewList";
import ClaimRequestsList from "../components/admin/ClaimRequestList";

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
    } else if (selectedSection === "claimRequests") {
        fetchClaimRequests();
    }
}, [selectedSection]);

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

const fetchItems = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/items", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
};

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

const fetchClaimRequests = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/claims/getall", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setClaimRequests(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Error fetching claim requests:", error);
    }
};

const approveClaim = async (requestId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/claims/approve/${requestId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
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

const denyItem = async (itemId) => {
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/items/deny/${itemId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
          setItems(items.filter(item => item.itemID !== itemId));
      } else {
          console.error("Failed to deny item");
      }
  } catch (error) {
      console.error("Error denying item:", error);
  }
};


const handleUpdateUser = async (updatedUser) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/user/update/${updatedUser.schoolId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                role: updatedUser.role,
                // Include password only if being updated
                ...(updatedUser.password && { password: updatedUser.password })
            }),
        });
        
        if (response.ok) {
            const updatedUserData = await response.json();
            setUsers(users.map(user => 
                user.schoolId === updatedUser.schoolId ? updatedUserData : user
            ));
        } else {
            console.error("Failed to update user:", await response.text());
        }
    } catch (error) {
        console.error("Error updating user:", error);
    }
};


const handleDeleteUser = async (schoolId) => {
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/user/delete/${schoolId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
          setUsers(users.filter(user => user.schoolId !== schoolId));
      } else {
          console.error("Failed to delete user");
      }
  } catch (error) {
      console.error("Error deleting user:", error);
  }
};



return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#7C0000' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, backgroundColor: '#7C0000', minHeight: 'calc(100vh - 64px)', mt: '64px' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: 240, 
              boxSizing: 'border-box',
              bgcolor: '#FFF',
              color: '#000',
              mt: '64px'
            },
          }}
        >
          <List>
            {[
              { text: 'Users', icon: <People />, value: 'users' },
              { text: 'Item List', icon: <Inventory />, value: 'items' },
              { text: 'Pending', icon: <HourglassEmpty />, value: 'pendingReview' },
              { text: 'Claims', icon: <Assignment />, value: 'claimRequests' },
            ].map((item) => (
              <ListItem 
                  component="div" 
                  key={item.value}
                  selected={selectedSection === item.value}
                  onClick={() => setSelectedSection(item.value)}
                  sx={{
                    bgcolor: selectedSection === item.value ? '#EEE' : 'inherit',
                    borderRadius: '5px',
                    my: 0.5,
                    mx: 1,
                    cursor: 'pointer' 
                  }}
                >

                <ListItemIcon sx={{ color: selectedSection === item.value ? '#7C0000' : '#000' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
  
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#7C0000', borderRadius: 2, m: 3, color: '#FFF', mt: '12px' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FFF' }}>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </Typography>
            {selectedSection === "users" && (
            <TextField
                size="small"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search sx={{ color: '#FFF' }} />
                    </InputAdornment>
                ),
                }}
                sx={{ input: { color: '#FFF' }, backgroundColor: '#550000', borderRadius: 1 }}
            />
            )}

          </Box>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#FFF' }}>
          {selectedSection === "users" && (
          <UserList users={users} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />
          )}
            {selectedSection === "items" && <ItemList items={items} />}
            {selectedSection === "pendingReview" && <PendingReviewList items={items} />}
            {selectedSection === "claimRequests" && <ClaimRequestsList claims={claimRequests} onApproveClaim={approveClaim} />}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
  
    };

    export default AdminPage;
