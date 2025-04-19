package com.example.loginapp.utils

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.view.View

object AnimationUtils {

    // Create a rotation animation
    fun createRotateAnimation(view: View, duration: Long = 1000) {
        ObjectAnimator.ofFloat(view, View.ROTATION, 0f, 360f).apply {
            this.duration = duration
            start()
        }
    }

    // Create sequential animations for a list of views
    fun animateViewsSequentially(views: List<View>, duration: Long = 300, delay: Long = 150) {
        val animations = views.mapIndexed { index, view ->
            ObjectAnimator.ofFloat(view, View.ALPHA, 0f, 1f).apply {
                this.duration = duration
                startDelay = index * delay
            }
        }

        AnimatorSet().apply {
            playSequentially(animations)
            start()
        }
    }
}
