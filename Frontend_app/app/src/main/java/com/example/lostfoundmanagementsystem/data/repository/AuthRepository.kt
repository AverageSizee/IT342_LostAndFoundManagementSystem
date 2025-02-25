package com.example.lostfoundmanagementsystem.data.repository

import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.data.model.LoginResponse
import com.example.lostfoundmanagementsystem.data.model.RegisterResponse
import com.example.lostfoundmanagementsystem.data.model.User
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import retrofit2.Response

class AuthRepository {
    private val api = RetrofitClient.instance

    suspend fun registerUser(user: User): Response<RegisterResponse> {
        return api.register(user)
    }

    suspend fun loginUser(loginRequest: LoginRequest): Response<Map<String, Any>> {
        return api.login(loginRequest)
    }
}