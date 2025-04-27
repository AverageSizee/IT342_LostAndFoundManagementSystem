package com.example.lostfoundmanagementsystem.data.model

data class LostItem(
    val itemID: Long,
    val itemName: String,
    val location: String,
    val status: String,
    val description: String,
    val imageUrl: String? // Assuming it's a URL or Base64 string
)
