package com.example.lostfoundmanagementsystem.ui.lostitems

import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.example.lostfoundmanagementsystem.CameraFragment
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.databinding.ActivityLostItemsBinding

class LostItemsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLostItemsBinding
    private val viewModel: LostItemsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLostItemsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = SharedPrefManager.getUserToken(this)

        // Setup RecyclerView
        binding.lostItemsRecyclerView.layoutManager = GridLayoutManager(this, 2)
        fetchItems(token.toString())

        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchItems(token.toString())
        }

        // Observe LiveData from ViewModel
        viewModel.lostItems.observe(this) { items ->
            val confirmedItems = items.filter { it.status == "Confirmed" }
            binding.lostItemsRecyclerView.adapter = LostItemAdapter(confirmedItems)
            binding.swipeRefreshLayout.isRefreshing = false
        }

        // Bottom navigation buttons
        val homeButton = findViewById<ImageButton>(R.id.homeButton)
        val cameraButton = findViewById<ImageButton>(R.id.cameraButton)
        val notificationButton = findViewById<ImageButton>(R.id.notificationButton)

        homeButton.setOnClickListener {
            supportFragmentManager.popBackStack() // Return to main screen
        }

        cameraButton.setOnClickListener {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, CameraFragment())
                .addToBackStack(null)
                .commit()
        }

        notificationButton.setOnClickListener {
            // TODO: Implement NotificationFragment if needed
        }

        // 👇 BackStack Listener to toggle visibility automatically
        supportFragmentManager.addOnBackStackChangedListener {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.fragmentContainer)
            val isCameraFragment = currentFragment is CameraFragment

            if (isCameraFragment) {
                binding.fragmentContainer.visibility = View.VISIBLE
                binding.lostItemsRecyclerView.visibility = View.GONE
                binding.swipeRefreshLayout.visibility = View.GONE
                findViewById<View>(R.id.bottomNavBar).visibility = View.INVISIBLE
            } else {
                binding.fragmentContainer.visibility = View.GONE
                binding.lostItemsRecyclerView.visibility = View.VISIBLE
                binding.swipeRefreshLayout.visibility = View.VISIBLE
                findViewById<View>(R.id.bottomNavBar).visibility = View.VISIBLE
            }
        }
    }

    private fun fetchItems(token: String) {
        binding.swipeRefreshLayout.isRefreshing = true
        viewModel.fetchLostItems(token)
    }

    override fun onBackPressed() {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
        } else {
            super.onBackPressed()
        }
    }
}
