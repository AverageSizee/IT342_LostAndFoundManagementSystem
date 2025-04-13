package com.example.lostfoundmanagementsystem.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.lostfoundmanagementsystem.LandingActivity
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.ui.lostitems.LostItemsActivity

class LoginActivity : AppCompatActivity() {
    private val loginViewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val schoolIdInput = findViewById<EditText>(R.id.schoolIdInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val loginButton = findViewById<Button>(R.id.loginButton)

        loginButton.setOnClickListener {
            val schoolId = schoolIdInput.text.toString()
            val password = passwordInput.text.toString()

            if (schoolId.isNotEmpty() && password.isNotEmpty()) {
                loginViewModel.login(LoginRequest(schoolId, password))
                Toast.makeText(this, "User: $schoolId pass: $password", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }

        loginViewModel.loginResponse.observe(this) { response ->
            if (response != null && response.token.isNotEmpty()) {
                Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show()
                SharedPrefManager.saveUser(this, response.user, response.token)

                val intent = Intent(this, LostItemsActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
            } else {
                Toast.makeText(this, "Login failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
