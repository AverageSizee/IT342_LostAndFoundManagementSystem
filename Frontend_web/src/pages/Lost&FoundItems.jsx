import { useState, useEffect } from "react"
import { Box, Typography, Container, Card, CardContent, CardMedia, Grid } from "@mui/material"
import Header from "../components/Header"
import Footer from "../components/Footer"

// Mock data for lost items
const mockLostItems = [
  {
    id: 1,
    name: "Blue Backpack",
    location: "Library",
    date: "2024-02-18",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Silver Watch",
    location: "Cafeteria",
    date: "2024-02-17",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Textbook: Introduction to Psychology",
    location: "Room 101",
    date: "2024-02-16",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "USB Flash Drive",
    location: "Computer Lab",
    date: "2024-02-15",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Red Umbrella",
    location: "Main Entrance",
    date: "2024-02-14",
    image: "/placeholder.svg?height=200&width=200",
  },
  // Add more mock items as needed
]

const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([])

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setLostItems(mockLostItems)
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Main Content */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#800000", textAlign: "center" }}>
          Lost Items
        </Typography>
        <Grid container spacing={3}>
          {lostItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia component="img" height="140" image={item.image} alt={item.name} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {item.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {item.date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}

export default LostItemsPage

