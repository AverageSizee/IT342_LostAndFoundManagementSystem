package com.example.lostfoundmanagementsystem.data.model

data class FoundLostItem(
    val itemName: String,
    val description: String,
    val foundDate: String,
    val status: String,
    val location: String
)