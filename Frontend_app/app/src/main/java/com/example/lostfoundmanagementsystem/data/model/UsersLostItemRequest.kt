package com.example.lostfoundmanagementsystem.data.model

data class UsersLostItemRequest(
    val itemName: String,
    val description: String,
    val location: String
)