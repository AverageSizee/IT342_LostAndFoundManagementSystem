import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import Footer from "../components/Footer";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const initialSearch = query.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [recentSearches, setRecentSearches] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLostItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const filteredItems = lostItems.filter(
    (item) =>
      item.status === "Confirmed" &&
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addRecentSearch = (term) => {
    if (term && !recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  const removeRecentSearch = (term) => {
    setRecentSearches(recentSearches.filter((t) => t !== term));
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm);
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#5a1818"}}>
    <Header />

    <Container sx={{ flexGrow: 1, py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "white", textAlign: "center" }}
      >
        <br></br>
        CIT - U LOST & FOUND SYSTEM
        <br></br>
      </Typography>
      <br></br>
  <Box
    sx={{
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "20px",
    }}
  >
    <TextField
      fullWidth
      placeholder="Type in keywords..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{
        mb: 3,
        //backgroundColor: "#f1f1f1",
        borderRadius: "30px",
        color: "#000",
      }}
    />
          {recentSearches.length > 0 && (
            <Box textAlign="center" mb={3}>
              <Typography variant="subtitle1">Recent Searches</Typography>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={1}>
                {recentSearches.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    onClick={() => {
                      setSearchTerm(term);
                      navigate(`/search?query=${term}`);
                    }}
                    onDelete={() => removeRecentSearch(term)}
                    sx={{ backgroundColor: "#e0e0e0", color: "#000" }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {searchTerm && (
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#000", fontWeight: "bold", textAlign: "center" }}
            >
              Results for: <span style={{ fontWeight: 400 }}>{searchTerm}</span>
            </Typography>
          )}

          {loading ? (
            <Typography textAlign="center">Loading...</Typography>
          ) : error ? (
            <Typography textAlign="center" color="error">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.itemID}>
                    
                  </Grid>
                ))
              ) : (
                <Typography textAlign="center" sx={{ width: "100%" }}>
                  No matching items found.
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Search;
