package com.example.lostfoundmanagementsystem.ui.lostitems

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.data.network.RetrofitClient
import kotlinx.coroutines.launch

class LostItemsViewModel : ViewModel() {
    private val _lostItems = MutableLiveData<List<LostItem>>()
    val lostItems: LiveData<List<LostItem>> get() = _lostItems

    fun fetchLostItems(token: String) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getLostItems("Bearer $token")
                if (response.isSuccessful) {
                    _lostItems.postValue(response.body())
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
}
