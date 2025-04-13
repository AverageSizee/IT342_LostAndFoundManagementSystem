package com.example.lostfoundmanagementsystem

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.Animation
import android.view.animation.RotateAnimation
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.example.lostfoundmanagementsystem.ui.login.LoginActivity

class SplashActivity : AppCompatActivity() {

    private lateinit var logoImageView: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        logoImageView = findViewById(R.id.ivLogo)

        // Create rotation animation
        val rotateAnimation = RotateAnimation(
            0f, 360f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        )
        rotateAnimation.duration = 2000 // 2 seconds
        rotateAnimation.repeatCount = 1 // Repeat once (total of 2 rotations)

        // Start the animation
        logoImageView.startAnimation(rotateAnimation)

        // Navigate to login screen after animation completes
        Handler(Looper.getMainLooper()).postDelayed({
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }, 4000) // 4 seconds total (2 rotations of 2 seconds each)
    }
}
