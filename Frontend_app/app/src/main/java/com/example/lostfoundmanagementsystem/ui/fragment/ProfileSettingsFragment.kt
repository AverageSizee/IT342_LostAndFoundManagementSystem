package com.example.lostfoundmanagementsystem.ui.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.addCallback
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.UsersLostItemRequest

class ProfileSettingsFragment : Fragment() {
    companion object {
        private const val TAG = "LostItem" // Main tag for all logs
    }

    private val viewModel: ProfileSettingsViewModel by viewModels()

    private lateinit var itemNameEditText: EditText
    private lateinit var descriptionEditText: EditText
    private lateinit var locationDropdown: AutoCompleteTextView
    private lateinit var submitButton: Button
    private lateinit var progressBar: ProgressBar

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_profile_settings, container, false)

        itemNameEditText = view.findViewById(R.id.editTextItemName)
        descriptionEditText = view.findViewById(R.id.editTextDescription)
        locationDropdown = view.findViewById(R.id.locationDropdown)
        submitButton = view.findViewById(R.id.buttonSubmit)
        progressBar = view.findViewById(R.id.progressBar)

        // Setup location dropdown
        val locations = arrayOf("RTl", "NGE", "GLE", "ALLIED", "ESPACIO", "STUDYAREA", "GMART", "GLINK")
        val adapter = ArrayAdapter(requireContext(), R.layout.dropdown_item, locations)
        locationDropdown.setAdapter(adapter)

        // Make dropdown show when clicked
        locationDropdown.inputType = 0
        locationDropdown.keyListener = null
        locationDropdown.setOnFocusChangeListener { view, hasFocus ->
            if (hasFocus) {
                (view as AutoCompleteTextView).showDropDown()
            }
        }

        locationDropdown.setOnClickListener {
            (it as AutoCompleteTextView).showDropDown()
        }

        submitButton.setOnClickListener {
            val itemName = itemNameEditText.text.toString()
            val description = descriptionEditText.text.toString()
            val location = locationDropdown.text.toString()

            if (itemName.isBlank() || description.isBlank() || location.isBlank()) {
                Toast.makeText(requireContext(), "Please fill all fields", Toast.LENGTH_SHORT).show()
                Log.w(TAG, "Form validation failed: empty fields")
            } else {
                try {
                    val userId = SharedPrefManager.getUser(requireContext())
                    val token = SharedPrefManager.getUserToken(requireContext())

                    if (userId.isNullOrBlank()) {
                        Log.e("$TAG-APP", "Missing user ID")
                        Toast.makeText(requireContext(), "Authentication error: Missing user ID", Toast.LENGTH_SHORT).show()
                        return@setOnClickListener
                    }

                    if (token.isNullOrBlank()) {
                        Log.e("$TAG-APP", "Missing authentication token")
                        Toast.makeText(requireContext(), "Authentication error: Missing token", Toast.LENGTH_SHORT).show()
                        return@setOnClickListener
                    }

                    // Log token info (first few chars only for security)
                    Log.d(TAG, "User ID: $userId, Token starts with: ${token.take(10)}...")

                    Log.d(TAG, "Submitting item: $itemName at $location")
                    viewModel.addLostItem(itemName, description, location, userId, token)
                } catch (e: Exception) {
                    Log.e("$TAG-APP", "Exception preparing request", e)
                    Toast.makeText(requireContext(), "App error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        // Observe loading state
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.isVisible = isLoading
            submitButton.isEnabled = !isLoading
        }

        // Observe success response
        viewModel.addLostItemResponse.observe(viewLifecycleOwner) { success ->
            if (success) {
                Toast.makeText(requireContext(), "Lost item added successfully", Toast.LENGTH_SHORT).show()
                Log.d(TAG, "Item added successfully")

                // Clear fields
                itemNameEditText.text.clear()
                descriptionEditText.text.clear()
                locationDropdown.text.clear()
            }
        }

        // Observe error message
        viewModel.errorMessage.observe(viewLifecycleOwner) { errorMessage ->
            if (errorMessage.isNotEmpty()) {
                Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_LONG).show()
                Log.e(TAG, "Error shown to user: $errorMessage")
            }
        }

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            parentFragmentManager.popBackStack()
        }
    }
}
