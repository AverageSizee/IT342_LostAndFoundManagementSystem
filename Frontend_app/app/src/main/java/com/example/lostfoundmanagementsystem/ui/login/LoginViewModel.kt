package com.example.lostfoundmanagementsystem.ui.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.data.model.LoginResponse
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.lifecycle.viewModelScope
import retrofit2.HttpException
import java.io.IOException

class LoginViewModel : ViewModel() {

    private val _loginResponse = MutableLiveData<LoginResponse?>()
    val loginResponse: LiveData<LoginResponse?> get() = _loginResponse

    private val _loginError = MutableLiveData<String?>()
    val loginError: LiveData<String?> get() = _loginError

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> get() = _isLoading

    fun login(loginRequest: LoginRequest) {
        _isLoading.postValue(true)
        _loginError.postValue(null)

        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.login(loginRequest)
                if (response.isSuccessful && response.body() != null) {
                    val responseBody = response.body()!!

                    val token = responseBody["token"] as? String ?: ""
                    val user = responseBody["user"] as? String ?: ""
                    val role = responseBody["role"] as? String ?: ""

                    if (token.isNotEmpty()) {
                        _loginResponse.postValue(LoginResponse(token, user, role))
                    } else {
                        _loginError.postValue("Invalid credentials")
                    }
                } else {
                    _loginError.postValue("Invalid credentials")
                }
            } catch (e: IOException) {
                // network issue / no connection
                _loginError.postValue("Backend Loading")
            } catch (e: HttpException) {
                _loginError.postValue("Invalid credentials")
            } catch (e: Exception) {
                _loginError.postValue("Backend Loading")
            } finally {
                _isLoading.postValue(false)
            }
        }
    }

    fun updateFcmToken(authToken: String, schoolId: String, fcmToken: String) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.updateFcmToken("Bearer $authToken", schoolId, fcmToken)
                if (response.isSuccessful) {
                    println("FCM token updated successfully")
                } else {
                    println("Failed to update FCM token: ${response.errorBody()?.string()}")
                }
            } catch (e: Exception) {
                println("Error updating FCM token: ${e.message}")
            }
        }
    }
}
