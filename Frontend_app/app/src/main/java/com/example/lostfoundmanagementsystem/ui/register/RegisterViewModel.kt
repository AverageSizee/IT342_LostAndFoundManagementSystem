package com.example.lostfoundmanagementsystem.ui.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lostfoundmanagementsystem.data.model.User
import com.example.lostfoundmanagementsystem.data.model.RegisterResponse
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch
import retrofit2.Response

class RegisterViewModel : ViewModel() {
    private val _registerResponse = MutableLiveData<String>()
    val registerResponse: LiveData<String> get() = _registerResponse

    fun register(user: User) {
        viewModelScope.launch {
            try {
                val response: Response<RegisterResponse> = RetrofitClient.instance.register(user)
                if (response.isSuccessful) {
                    _registerResponse.value = "Registration successful"
                } else {
                    _registerResponse.value = "Registration failed: ${response.errorBody()?.string()}"
                }
            } catch (e: Exception) {
                _registerResponse.value = "Error: ${e.message}"
            }
        }
    }
}