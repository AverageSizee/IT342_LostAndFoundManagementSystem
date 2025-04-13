package com.example.lostfoundmanagementsystem.ui.lostitems

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.databinding.ActivityLostItemsBinding

class LostItemsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLostItemsBinding
    private val viewModel: LostItemsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLostItemsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = SharedPrefManager.getUserToken(this)

        binding.lostItemsRecyclerView.layoutManager = GridLayoutManager(this, 2)

        // Load items
        fetchItems(token.toString())

        // Swipe to refresh listener
        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchItems(token.toString()) // Re-fetch on pull down
        }

        // Observe items
        viewModel.lostItems.observe(this) { items ->
            val confirmedItems = items.filter { it.status == "Confirmed" }
            binding.lostItemsRecyclerView.adapter = LostItemAdapter(confirmedItems)
            binding.swipeRefreshLayout.isRefreshing = false // Hide the refresh icon
        }
    }
    private fun fetchItems(token: String) {
        binding.swipeRefreshLayout.isRefreshing = true
        viewModel.fetchLostItems(token)
    }
}