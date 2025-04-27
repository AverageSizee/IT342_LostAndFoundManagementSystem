package com.example.lostfoundmanagementsystem.ui.lostitems

import android.app.AlertDialog
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import com.bumptech.glide.Glide
import com.example.lostfoundmanagementsystem.CameraFragment
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.databinding.ActivityLostItemsBinding
import com.example.lostfoundmanagementsystem.databinding.DialogClaimItemBinding
import com.example.lostfoundmanagementsystem.ui.fragment.ProfileSettingsFragment
import java.time.LocalDate

class LostItemsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLostItemsBinding

    private val viewModel: LostItemsViewModel by viewModels {
        ViewModelProvider.AndroidViewModelFactory.getInstance(application)
    }

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
            binding.lostItemsRecyclerView.adapter = LostItemAdapter(confirmedItems) { item ->
                showClaimDialog(item)
            }
            binding.swipeRefreshLayout.isRefreshing = false
        }

        // Bottom Navigation
        val homeButton = findViewById<ImageButton>(R.id.homeButton)
        val cameraButton = findViewById<ImageButton>(R.id.cameraButton)
        val profileIcon = findViewById<ImageView>(R.id.profileIcon)

        profileIcon.setOnClickListener {
            binding.fragmentContainer.visibility = View.VISIBLE
            binding.lostItemsRecyclerView.visibility = View.GONE
            binding.swipeRefreshLayout.visibility = View.GONE
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, ProfileSettingsFragment())
                .addToBackStack(null)
                .commit()
        }

        homeButton.setOnClickListener {
            supportFragmentManager.popBackStack()
        }

        cameraButton.setOnClickListener {
            binding.fragmentContainer.visibility = View.VISIBLE
            binding.lostItemsRecyclerView.visibility = View.GONE
            binding.swipeRefreshLayout.visibility = View.GONE
            findViewById<View>(R.id.bottomNavBar).visibility = View.INVISIBLE
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, CameraFragment())
                .addToBackStack(null)
                .commit()
        }

        supportFragmentManager.addOnBackStackChangedListener {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.fragmentContainer)
            when (currentFragment) {
                is CameraFragment -> {
                    binding.fragmentContainer.visibility = View.VISIBLE
                    binding.lostItemsRecyclerView.visibility = View.GONE
                    binding.swipeRefreshLayout.visibility = View.GONE
                    findViewById<View>(R.id.bottomNavBar).visibility = View.INVISIBLE
                }
                is ProfileSettingsFragment -> {
                    binding.fragmentContainer.visibility = View.VISIBLE
                    binding.lostItemsRecyclerView.visibility = View.GONE
                    binding.swipeRefreshLayout.visibility = View.GONE
                    findViewById<View>(R.id.bottomNavBar).visibility = View.VISIBLE
                }
                null -> {
                    binding.fragmentContainer.visibility = View.GONE
                    binding.lostItemsRecyclerView.visibility = View.VISIBLE
                    binding.swipeRefreshLayout.visibility = View.VISIBLE
                    findViewById<View>(R.id.bottomNavBar).visibility = View.VISIBLE
                }
            }
        }

        // 🔍 Search Functionality
        val searchEditText = findViewById<EditText>(R.id.searchEditText)
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s.toString().trim()
                val allItems = viewModel.lostItems.value ?: emptyList()
                val filteredItems = allItems.filter {
                    it.itemName.contains(query, ignoreCase = true) ||
                            it.description.contains(query, ignoreCase = true)
                }.filter { it.status == "Confirmed" }

                binding.lostItemsRecyclerView.adapter = LostItemAdapter(filteredItems) { item ->
                    showClaimDialog(item)
                }
            }

            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun fetchItems(token: String) {
        binding.swipeRefreshLayout.isRefreshing = true
        viewModel.fetchLostItems(token)
    }

    private fun showClaimDialog(item: LostItem) {
        val dialogBinding = DialogClaimItemBinding.inflate(LayoutInflater.from(this))
        val dialog = AlertDialog.Builder(this)
            .setView(dialogBinding.root)
            .setCancelable(true)
            .create()

        // Load image
        Glide.with(this)
            .load(item.imageUrl)
            .placeholder(android.R.drawable.ic_menu_report_image)
            .into(dialogBinding.itemImageView)

        // Set name
        dialogBinding.itemNameText.text = item.itemName

        dialogBinding.submitClaimBtn.setOnClickListener {
            val reason = dialogBinding.reasonInput.text.toString()
            if (reason.isEmpty()) {
                Toast.makeText(this, "Please enter a reason.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val userId = SharedPrefManager.getUser(this)
            val claimDate = LocalDate.now().toString()

            viewModel.submitClaim(userId.toString(), item.itemID, claimDate, reason)
            dialog.dismiss()
        }

        dialog.window?.attributes?.windowAnimations = R.style.DialogAnimation
        dialog.show()
    }

    override fun onBackPressed() {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
        } else {
            super.onBackPressed()
        }
    }
}
