package com.example.lostfoundmanagementsystem

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.ui.MainActivity

class LandingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_landing)

        val signedInTextView = findViewById<TextView>(R.id.signedInTextView)
        val tokenTextView = findViewById<TextView>(R.id.tokenTextView)
        val showTokenButton = findViewById<Button>(R.id.showTokenButton)
        val logoutButton = findViewById<Button>(R.id.logoutButton)

        // Retrieve the stored user and token
        val user = SharedPrefManager.getUser(this)  // Assuming there's a method to get the stored user ID
        val token = SharedPrefManager.getUserToken(this)

        // Display the signed-in user
        signedInTextView.text = "Signed in as: $user"

        // Set button click listener to display token
        showTokenButton.setOnClickListener {
            tokenTextView.text = "Token: $token"
        }

        logoutButton.setOnClickListener {
            // Clear stored session/token
            SharedPrefManager.clearUser(this)

            // Redirect to MainActivity
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK // Clears backstack
            startActivity(intent)
        }
    }
}
