package com.example.lostfoundmanagementsystem.ui.fragment

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lostfoundmanagementsystem.data.model.UsersLostItemRequest
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException
import java.net.SocketTimeoutException
import java.net.UnknownHostException

class ProfileSettingsViewModel : ViewModel() {
    companion object {
        private const val TAG = "LostItem" // Main tag for all logs
    }

    private val _addLostItemResponse = MutableLiveData<Boolean>()
    val addLostItemResponse: LiveData<Boolean> get() = _addLostItemResponse

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage

    private val _isLoading = MutableLiveData<Boolean>(false)
    val isLoading: LiveData<Boolean> get() = _isLoading

    fun addLostItem(itemName: String, description: String, location: String, userId: String, token: String) {
        viewModelScope.launch {
            _isLoading.postValue(true)

            try {
                // Format the token with "Bearer " prefix if it doesn't already have it
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"

                // Log the token (first few characters for security)
                Log.d(TAG, "Using token: ${formattedToken.take(15)}...")
                Log.d(TAG, "Adding item for user ID: $userId")

                // Create the request without user ID
                val lostItemRequest = UsersLostItemRequest(itemName, description, location)

                // Try the new endpoint first
                try {
                    val response = RetrofitClient.instance.addUsersLostItem(formattedToken, userId, lostItemRequest)

                    if (response.isSuccessful) {
                        Log.d(TAG, "Item added successfully: $itemName")
                        _addLostItemResponse.postValue(true)
                    } else {
                        throw HttpException(response)
                    }
                } catch (e: Exception) {
                    // If the new endpoint fails, try the original endpoint as fallback
                    Log.w(TAG, "New endpoint failed, trying original endpoint", e)

                    val originalRequest = UsersLostItemRequest(itemName, description, location)
                    val response = RetrofitClient.instance.addUsersLostItem(formattedToken, userId, originalRequest)

                    if (response.isSuccessful) {
                        Log.d(TAG, "Item added successfully with original endpoint: $itemName")
                        _addLostItemResponse.postValue(true)
                    } else {
                        // Server returned an error response
                        val errorCode = response.code()
                        val errorBody = response.errorBody()?.string() ?: "Unknown server error"

                        Log.e("$TAG-SERVER", "Error $errorCode: $errorBody")

                        // Special handling for 401 errors
                        if (errorCode == 401) {
                            _errorMessage.postValue("Authentication error: Your session may have expired. Please log in again.")
                            Log.e("$TAG-SERVER", "401 Unauthorized - Token issue. Token starts with: ${formattedToken.take(15)}...")
                        } else {
                            _errorMessage.postValue("Server error: $errorCode")
                        }

                        _addLostItemResponse.postValue(false)
                    }
                }
            } catch (e: HttpException) {
                // HTTP exceptions (4xx, 5xx responses)
                Log.e("$TAG-SERVER", "HTTP Exception: ${e.code()}", e)

                if (e.code() == 401) {
                    _errorMessage.postValue("Authentication error: Your session may have expired. Please log in again.")
                } else {
                    _errorMessage.postValue("Server error: ${e.code()}")
                }

                _addLostItemResponse.postValue(false)
            } catch (e: UnknownHostException) {
                // No internet connection or DNS failure
                Log.e("$TAG-NETWORK", "No internet connection", e)
                _errorMessage.postValue("Network error: No internet connection")
                _addLostItemResponse.postValue(false)
            } catch (e: SocketTimeoutException) {
                // Connection timeout
                Log.e("$TAG-NETWORK", "Connection timeout", e)
                _errorMessage.postValue("Network error: Connection timed out")
                _addLostItemResponse.postValue(false)
            } catch (e: IOException) {
                // Network or conversion errors
                Log.e("$TAG-NETWORK", "IO Exception", e)
                _errorMessage.postValue("Network error: ${e.message}")
                _addLostItemResponse.postValue(false)
            } catch (e: Exception) {
                // Any other exceptions (client-side)
                Log.e("$TAG-APP", "App exception", e)
                _errorMessage.postValue("App error: ${e.message}")
                _addLostItemResponse.postValue(false)
            } finally {
                _isLoading.postValue(false)
            }
        }
    }
}
