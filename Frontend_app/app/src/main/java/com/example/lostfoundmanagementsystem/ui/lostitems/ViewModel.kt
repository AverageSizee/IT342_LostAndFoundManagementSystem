package com.example.lostfoundmanagementsystem.ui.lostitems

import android.app.Application
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch

class LostItemsViewModel(application: Application) : AndroidViewModel(application) {
    private val _lostItems = MutableLiveData<List<LostItem>>()
    val lostItems: LiveData<List<LostItem>> get() = _lostItems

    fun fetchLostItems(token: String) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getLostItems("Bearer $token")
                if (response.isSuccessful) {
                    _lostItems.postValue(response.body())
//                    Log.e("ClaimDebug", response.body().toString())
                } else {
                    println("Error fetching items: ${response.errorBody()?.string()}")
                    _lostItems.postValue(emptyList())
                }
            } catch (e: Exception) {
                println("Exception: ${e.message}")
                _lostItems.postValue(emptyList())
            }
        }
    }
    fun submitClaim(userId: String, itemId: Long, claimDate: String, reason: String) {
        viewModelScope.launch {
            try {
                val token = SharedPrefManager.getUserToken(getApplication())
                if (token.isNullOrEmpty()) {
                    Log.e("ClaimDebug", "❌ Token is missing")
                    return@launch
                }

                Log.d("ClaimDebug", "Sending claim: userId=$userId, itemId=$itemId, claimDate=$claimDate, reason=$reason")

                val response = RetrofitClient.instance.submitClaimRequest(
                    token = "Bearer $token",
                    user = userId,
                    item = itemId,
                    claimDate = claimDate,
                    reason = reason
                )

                if (response.isSuccessful) {
                    val message = response.body()?.string()
                    Log.d("ClaimDebug", "✅ Success: $message")
                    Toast.makeText(getApplication(), message ?: "Claim submitted!", Toast.LENGTH_SHORT).show()
                } else {
                    val error = response.errorBody()?.string()
                    Log.e("ClaimDebug", "❌ Error: ${response.code()} - $error")
                    Toast.makeText(getApplication(), "Failed to submit claim", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e("ClaimDebug", "❌ Exception submitting claim", e)
            }
        }
    }

}
