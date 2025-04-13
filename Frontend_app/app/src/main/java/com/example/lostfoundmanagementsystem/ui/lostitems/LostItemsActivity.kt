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

    private var isInFragment = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLostItemsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = SharedPrefManager.getUserToken(this)

        binding.lostItemsRecyclerView.layoutManager = GridLayoutManager(this, 2)
        fetchItems(token.toString())

        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchItems(token.toString())
        }

        viewModel.lostItems.observe(this) { items ->
            val confirmedItems = items.filter { it.status == "Confirmed" }
            binding.lostItemsRecyclerView.adapter = LostItemAdapter(confirmedItems)
            binding.swipeRefreshLayout.isRefreshing = false
        }

        val homeButton = findViewById<ImageButton>(R.id.homeButton)
        val cameraButton = findViewById<ImageButton>(R.id.cameraButton)
        val notificationButton = findViewById<ImageButton>(R.id.notificationButton)

        homeButton.setOnClickListener {
            exitFragmentView() // Just show main view
        }

        cameraButton.setOnClickListener {
            binding.fragmentContainer.visibility = View.VISIBLE

            // Hide the recycler and UI overlays
            findViewById<View>(R.id.bottomNavBar).visibility = View.INVISIBLE

            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, CameraFragment())
                .addToBackStack(null)
                .commit()
        }

        notificationButton.setOnClickListener {
            // TODO: Replace with NotificationFragment() if you have one
            // enterFragmentView(NotificationFragment())
        }
    }

    private fun fetchItems(token: String) {
        binding.swipeRefreshLayout.isRefreshing = true
        viewModel.fetchLostItems(token)
    }

    private fun enterFragmentView(fragment: androidx.fragment.app.Fragment) {
        isInFragment = true
        binding.swipeRefreshLayout.visibility = View.GONE
        binding.lostItemsRecyclerView.visibility = View.GONE
        binding.fragmentContainer.visibility = View.VISIBLE

        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .addToBackStack(null)
            .commit()
    }

    private fun exitFragmentView() {
        isInFragment = false
        findViewById<View>(R.id.bottomNavBar).visibility = View.VISIBLE

        supportFragmentManager.popBackStack()
    }


    override fun onBackPressed() {
        if (isInFragment) {
            exitFragmentView()
        } else {
            super.onBackPressed()
        }
    }
}
