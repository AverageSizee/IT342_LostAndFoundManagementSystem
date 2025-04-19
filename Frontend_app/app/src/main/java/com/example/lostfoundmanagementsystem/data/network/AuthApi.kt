package com.example.lostfoundmanagementsystem.data.network

import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.data.model.LoginResponse
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.data.model.RegisterResponse
import com.example.lostfoundmanagementsystem.data.model.User
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query

interface AuthApi {
    @POST("user/register")
    suspend  fun register(@Body user: User): Response<RegisterResponse>

    @POST("user/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<Map<String, Any>>

    @GET("/items")
    suspend fun getLostItems(@Header("Authorization") token: String): Response<List<LostItem>>
    @Multipart
    @POST("items/report/{userID}")
    fun reportLostItem(
        @Header("Authorization") token: String,
        @Path("userID") userID: String,
        @Part("item") item: RequestBody,
        @Part imageFile: MultipartBody.Part? = null
    ): Call<LostItem>
    @POST("user/update-fcm-token")
    suspend fun updateFcmToken(
        @Header("Authorization") token: String,
        @Query("schoolId") schoolId: String,
        @Query("fcmToken") fcmToken: String
    ): Response<Void>
}

data class AuthResponse(val token: String, val message: String)