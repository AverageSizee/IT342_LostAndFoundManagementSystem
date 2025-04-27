package com.example.lostfoundmanagementsystem.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.lostfoundmanagementsystem.R
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.data.model.LoginRequest
import com.example.lostfoundmanagementsystem.ui.lostitems.LostItemsActivity
import com.google.firebase.messaging.FirebaseMessaging

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
                showToast("Logging in...")
            } else {
                showToast("Fill in all fields")
            }
        }

        loginViewModel.isLoading.observe(this) { isLoading ->
            loginButton.isEnabled = !isLoading
            loginButton.text = if (isLoading) "Logging in..." else "Log in"
        }

        loginViewModel.loginResponse.observe(this) { response ->
            if (!isFinishing && !isDestroyed && response != null && response.token.isNotEmpty()) {
                showToast("Login Successful")

                SharedPrefManager.saveUser(this, response.user, response.token)

                FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val fcmToken = task.result
                        loginViewModel.updateFcmToken(response.token, response.user, fcmToken)
                    }
                }

                startActivity(Intent(this, LostItemsActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                })
            }
        }

// ✅ Observe login errors
        loginViewModel.loginError.observe(this) { errorMessage ->
            errorMessage?.let {
                showToast(it)
            }
        }
    }

    private fun showToast(message: String) {
        if (!isFinishing && !isDestroyed) {
            Toast.makeText(applicationContext, message, Toast.LENGTH_SHORT).show()
        }
    }
}
