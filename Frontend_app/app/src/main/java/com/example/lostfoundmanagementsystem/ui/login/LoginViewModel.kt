package com.example.lostfoundmanagementsystem.ui.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.data.model.LoginResponse
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.lifecycle.viewModelScope
import retrofit2.Response

class LoginViewModel : ViewModel() {
    private val _loginResponse = MutableLiveData<LoginResponse?>()
    val loginResponse: LiveData<LoginResponse?> get() = _loginResponse

    fun login(loginRequest: LoginRequest) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.login(loginRequest)
                if (response.isSuccessful && response.body() != null) {
                    val responseBody = response.body()!!
                    println("API Response: $responseBody")

                    val token = responseBody["token"] as? String ?: ""
                    val user = responseBody["user"] as? String ?: ""
                    val role = responseBody["role"] as? String ?: ""

                    if (token.isNotEmpty()) {
                        _loginResponse.postValue(LoginResponse(token, user, role))
                    } else {
                        println("Login failed: Token is empty")
                        _loginResponse.postValue(null)
                    }
                } else {
                    println("Login failed: ${response.errorBody()?.string()}")
                    _loginResponse.postValue(null)
                }
            } catch (e: Exception) {
                println("Login error: ${e.message}")
                _loginResponse.postValue(null)
            }
        }
    }
}
