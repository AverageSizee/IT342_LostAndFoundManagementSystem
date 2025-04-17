package com.example.lostfoundmanagementsystem.ui.report

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lostfoundmanagementsystem.data.model.FoundLostItem
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

class ReportItemViewModel : ViewModel() {

    private val _reportResult = MutableLiveData<Result<LostItem>>()
    val reportResult: LiveData<Result<LostItem>> get() = _reportResult

    fun reportLostItem(
        token: String,
        userId: String,
        itemName: String,
        itemDescription: String,
        location: String,
        foundDate: String,
        imageFile: File?
    ) {
        viewModelScope.launch {
            try {
                try {
                    // Create LostItem object
                    val lostItem = FoundLostItem(itemName, itemDescription, foundDate, "Lost", location)

                    // Convert LostItem object to JSON using Gson
                    val itemJson = Gson().toJson(lostItem)

                    // Convert JSON string to RequestBody
                    val itemRequestBody = itemJson.toRequestBody("application/json".toMediaTypeOrNull())

                    // Handle optional image
                    val imagePart = imageFile?.let {
                        val requestFile = it.asRequestBody("image/*".toMediaTypeOrNull())
                        MultipartBody.Part.createFormData("image", it.name, requestFile)
                    }

                    // Log token and image file details for debugging
//                    Log.d("Debug", "Token: $token")
//                    Log.d("Debug", "Image: ${imageFile?.name ?: "No image"}")

                    val call = RetrofitClient.instance.reportLostItem(
                        token = "Bearer $token", // Pass the token here
                        userID = userId,
                        item = itemRequestBody,
                        imageFile = imagePart
                    )

                    val response = withContext(Dispatchers.IO) { call.execute() }

                    if (response.isSuccessful && response.body() != null) {
                        _reportResult.postValue(Result.success(response.body()!!))
                    } else {
                        val responseBody = response.errorBody()?.string()
//                        Log.e("Debug", "Error: $responseBody")
                        _reportResult.postValue(Result.failure(Exception("Failed: ${response.code()}")))
                    }

                } catch (e: Exception) {
                    _reportResult.postValue(Result.failure(e))
                }
            } catch (e: Exception) {
                _reportResult.postValue(Result.failure(e))
            }
        }
    }
}
