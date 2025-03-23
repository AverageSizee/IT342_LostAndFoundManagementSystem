import { useState, useEffect } from "react"
import axios from "axios"
import { Box, Typography, Container, Card, CardContent, CardMedia, Grid } from "@mui/material"
import Header from "../components/Header"
import Footer from "../components/Footer"

const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLostItems = async () => {
      const token = localStorage.getItem("token") // Get token from localStorage

      if (!token) {
        setError("Unauthorized: No token found")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("http://localhost:8080/items", {
          headers: { Authorization: `Bearer ${token}` } // Attach token in headers
        })
        setLostItems(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch items")
      } finally {
        setLoading(false)
      }
    }

    fetchLostItems()
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Main Content */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#800000", textAlign: "center" }}>
          Lost Items
        </Typography>

        {loading ? (
          <Typography textAlign="center">Loading...</Typography>
        ) : error ? (
          <Typography textAlign="center" color="error">{error}</Typography>
        ) : (
        <Grid container spacing={3}>
          {lostItems.length > 0 ? (
            lostItems.filter((item) => item.status === "Confirmed").length > 0 ? (
              lostItems
                .filter((item) => item.status === "Confirmed") // Filter confirmed items
                .map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.itemID}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image || "/placeholder.svg?height=200&width=200"} // Fallback to placeholder image
                        alt={item.itemName}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.itemName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Location: {item.location || "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {item.date || "No date available"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            ) : (
              <Typography textAlign="center" sx={{ width: "100%" }}>
                No lost items found.
              </Typography>
            )
          ) : (
            <Typography textAlign="center" sx={{ width: "100%" }}>
              No lost items found.
            </Typography>
          )}
        </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  )
}

export default LostItemsPage
