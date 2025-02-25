package com.example.lostfoundmanagementsystem.data.network

import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.data.model.LoginResponse
import com.example.lostfoundmanagementsystem.data.model.RegisterResponse
import com.example.lostfoundmanagementsystem.data.model.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("user/register")
    suspend  fun register(@Body user: User): Response<RegisterResponse>

    @POST("user/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<Map<String, Any>>
}

data class AuthResponse(val token: String, val message: String)