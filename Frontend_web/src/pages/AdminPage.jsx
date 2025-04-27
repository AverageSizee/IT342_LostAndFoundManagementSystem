import React, { useState, useEffect } from "react";
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  TextField, Paper, InputAdornment, Typography 
} from "@mui/material";
import { 
  Search, People, Inventory, HourglassEmpty, Assignment 
} from "@mui/icons-material";
import Header from "../components/Header";
import UserList from "../components/admincomponents/UserList";
import ItemList from "../components/admincomponents/ItemList";
import PendingReviewList from "../components/admincomponents/PendingReviewList";
import ClaimRequestsList from "../components/admincomponents/ClaimRequestList";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [claimRequests, setClaimRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedSection === "users" && users.length === 0) {
      fetchUsers();
    } else if ((selectedSection === "items" || selectedSection === "pendingReview") && items.length === 0) {
      fetchItems();
    } else if (selectedSection === "claimRequests" && claimRequests.length === 0) {
      fetchClaimRequests();
    }
  }, [selectedSection, users, items, claimRequests]); // Replace length checks with actual data checks
  


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
      // console.log("Fetched items:", data); // Debugging line
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

  const approveClaim = async (requestId, itemId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/claims/approve/${requestId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            // Step 1: Update the item’s status to "Claimed" in the Item List
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.itemID === itemId ? { ...item, status: "Claimed" } : item
                )
            );

            // Step 2: Remove the claim request from the Claim Requests List
            setClaimRequests((prevClaims) =>
                prevClaims.filter((claim) => claim.requestId !== requestId)
            );
        } else {
            console.error("Failed to approve claim");
        }
    } catch (error) {
        console.error("Error approving claim:", error);
    }
};


  const denyClaim = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/claims/deny/${requestId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setClaimRequests(prev => prev.filter(request => request.requestId !== requestId));
      } else {
        console.error("Failed to deny claim");
      }
    } catch (error) {
      console.error("Error denying claim:", error);
    }
  };

  const handleReReview = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/claims/rereview/${itemId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const updatedItems = items.map((item) =>
          item.itemID === itemId ? { ...item, status: "Reported" } : item
        );
        setItems(updatedItems); // Update the item's status on the frontend
      } else {
        console.error("Failed to re-review item");
      }
    } catch (error) {
      console.error("Error re-reviewing item:", error);
    }
  };
  


  const handleUpdateItem = async (updatedItem) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/items/update/${updatedItem.itemID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });
  
      if (response.ok) {
        const updatedItemData = await response.json();
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemID === updatedItemData.itemID ? updatedItemData : item
          )
        );
      } else {
        console.error("Failed to update item:", await response.text());
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (itemID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/items/delete/${itemID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setItems(items.filter(item => item.itemID !== itemID));
      } else {
        console.error("Failed to delete item:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const markAsUnclaimed = async (itemId) => {
    
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/items/${itemId}/unclaim`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log("Item marked as unclaimed.");
    } else {
      console.error("Failed to update item status.");
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
        body: JSON.stringify(updatedUser),
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

        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#7C0000', borderRadius: 2, m: 3, color: '#FFF', mt: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
            {selectedSection === "items" && (
              <ItemList items={items} onEdit={handleUpdateItem} onDelete={handleDeleteItem}  onMarkAsUnclaimed={markAsUnclaimed}/>
            )}
            {selectedSection === "pendingReview" && (
              <PendingReviewList items={items} onApprove={confirmItem} onDeny={denyClaim}  onReReview={handleReReview}/>
            )}
            {selectedSection === "claimRequests" && (
              <ClaimRequestsList claims={claimRequests} onApproveClaim={(requestId, itemId) => approveClaim(requestId, itemId)}
              onDenyClaim={denyClaim} />
          
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
