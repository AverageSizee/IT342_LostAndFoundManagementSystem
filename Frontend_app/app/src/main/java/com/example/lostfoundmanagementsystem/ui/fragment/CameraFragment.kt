package com.example.lostfoundmanagementsystem

import android.Manifest
import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.DatePickerDialog
import android.content.ContentValues
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.lostfoundmanagementsystem.data.SharedPrefManager
import com.example.lostfoundmanagementsystem.databinding.FragmentCameraBinding
import com.example.lostfoundmanagementsystem.databinding.LayoutPhotoModalBinding
import com.example.lostfoundmanagementsystem.ui.report.ReportItemViewModel
import com.google.android.material.bottomsheet.BottomSheetDialog
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class CameraFragment : Fragment() {

    private var _binding: FragmentCameraBinding? = null
    private val binding get() = _binding!!

    private var _modalBinding: LayoutPhotoModalBinding? = null
    private val modalBinding get() = _modalBinding!!

    private lateinit var cameraExecutor: ExecutorService
    private var cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
    private var imageCapture: ImageCapture? = null
    private var lastCapturedImageUri: Uri? = null

    companion object {
        private const val CAMERA_PERMISSION_REQUEST = 1001
        private const val FILENAME_FORMAT = "yyyy-MM-dd-HH-mm-ss-SSS"
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCameraBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Add flash overlay for animation
        val flashOverlay = View(requireContext())
        flashOverlay.id = View.generateViewId()
        flashOverlay.layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        flashOverlay.setBackgroundColor(ContextCompat.getColor(requireContext(), R.color.white))
        flashOverlay.alpha = 0f
        flashOverlay.visibility = View.GONE
        (binding.root as ViewGroup).addView(flashOverlay)

        cameraExecutor = Executors.newSingleThreadExecutor()

        // Check and request camera permission if not granted
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA)
            == PackageManager.PERMISSION_GRANTED
        ) {
            startCamera()
        } else {
            requestCameraPermission()
        }

        binding.shutterButton.setOnClickListener {
            // Play shutter animation
            playShutterAnimation(flashOverlay)
            // Take photo
            takePhoto()
        }

        // Flip camera
        binding.flipCameraButton.setOnClickListener {
            cameraSelector = if (cameraSelector == CameraSelector.DEFAULT_BACK_CAMERA)
                CameraSelector.DEFAULT_FRONT_CAMERA
            else
                CameraSelector.DEFAULT_BACK_CAMERA
            startCamera()
        }

        // Back button
        binding.backButton.setOnClickListener {
            requireActivity().onBackPressedDispatcher.onBackPressed()
        }
    }

    private fun playShutterAnimation(flashOverlay: View) {
        // Flash animation
        flashOverlay.visibility = View.VISIBLE

        // Flash animation
        val flashIn = ObjectAnimator.ofFloat(flashOverlay, "alpha", 0f, 0.7f)
        flashIn.duration = 100

        val flashOut = ObjectAnimator.ofFloat(flashOverlay, "alpha", 0.7f, 0f)
        flashOut.duration = 200
        flashOut.startDelay = 100

        // Shutter button animation
        val scaleDownX = ObjectAnimator.ofFloat(binding.shutterButton, "scaleX", 1f, 0.85f)
        val scaleDownY = ObjectAnimator.ofFloat(binding.shutterButton, "scaleY", 1f, 0.85f)
        scaleDownX.duration = 100
        scaleDownY.duration = 100

        val scaleUpX = ObjectAnimator.ofFloat(binding.shutterButton, "scaleX", 0.85f, 1f)
        val scaleUpY = ObjectAnimator.ofFloat(binding.shutterButton, "scaleY", 0.85f, 1f)
        scaleUpX.duration = 200
        scaleUpY.duration = 200
        scaleUpX.interpolator = OvershootInterpolator()
        scaleUpY.interpolator = OvershootInterpolator()

        // Play all animations together
        val animatorSet = AnimatorSet()
        animatorSet.playTogether(flashIn, flashOut, scaleDownX, scaleDownY, scaleUpX, scaleUpY)
        animatorSet.start()
    }

    private fun takePhoto() {
        val imageCapture = imageCapture ?: return

        // Create time stamped name and MediaStore entry
        val name = SimpleDateFormat(FILENAME_FORMAT, Locale.US)
            .format(System.currentTimeMillis())

        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
                put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/LostFound")
            }
        }

        // Create output options object which contains file + metadata
        val outputOptions = ImageCapture.OutputFileOptions
            .Builder(requireContext().contentResolver,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                contentValues)
            .build()

        // Set up image capture listener, which is triggered after photo has been taken
        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(requireContext()),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    Toast.makeText(requireContext(),
                        "Photo capture failed: ${exc.message}",
                        Toast.LENGTH_SHORT).show()
                }

                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    val savedUri = output.savedUri
                    lastCapturedImageUri = savedUri

                    // Show modal with the captured image
                    showPhotoModal(savedUri)
                }
            }
        )
    }

    private fun showPhotoModal(imageUri: Uri?) {
        if (imageUri == null) return

        val bottomSheetDialog = BottomSheetDialog(requireContext(), R.style.BottomSheetDialogTheme)
        _modalBinding = LayoutPhotoModalBinding.inflate(layoutInflater)

        // Set the captured image
        modalBinding.capturedImage.setImageURI(imageUri)

        // Set current date as default in Found Date field
        val currentDate = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(System.currentTimeMillis())
        modalBinding.foundDateInput.setText(currentDate)

        // Allow user to change the date by clicking on the field
        modalBinding.foundDateInput.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            // Show DatePickerDialog
            val datePicker = DatePickerDialog(
                requireContext(),
                { _, selectedYear, selectedMonth, selectedDay ->
                    // Update the found date field with the selected date
                    val selectedDate = "$selectedYear-${selectedMonth + 1}-${selectedDay}"
                    modalBinding.foundDateInput.setText(selectedDate)
                },
                year, month, day
            )
            datePicker.show()
        }

        // Setup location dropdown and other modal elements...
        val locations = arrayOf("RTl", "NGE", "GLE", "ALLIED", "ESPACIO", "STUDYAREA", "GMART", "GLINK")
        val adapter = ArrayAdapter(requireContext(), R.layout.dropdown_item, locations)
        (modalBinding.locationDropdown as? AutoCompleteTextView)?.setAdapter(adapter)
        modalBinding.locationDropdown.inputType = 0
        modalBinding.locationDropdown.keyListener = null
        modalBinding.locationDropdown.setOnFocusChangeListener { view, hasFocus ->
            if (hasFocus) {
                (view as AutoCompleteTextView).showDropDown()
            }
        }

        modalBinding.locationDropdown.setOnClickListener {
            (it as AutoCompleteTextView).showDropDown()
        }

        modalBinding.reportButton.setOnClickListener {
            val selectedLocation = modalBinding.locationDropdown.text.toString()
            val foundDate = modalBinding.foundDateInput.text.toString()
            val itemName = modalBinding.itemNameInput.text.toString()
            val itemDescription = modalBinding.descriptionInput.text.toString()

            val imageFile = uriToCompressedFile(imageUri)

            val userId = SharedPrefManager.getUser(requireContext()) // Or however you're storing user ID
            val token = SharedPrefManager.getUserToken(requireContext())

            val viewModel = ViewModelProvider(this@CameraFragment)[ReportItemViewModel::class.java]

            // Disable button to prevent multiple clicks
            modalBinding.reportButton.isEnabled = false
            modalBinding.reportButton.text = "Uploading..."

            viewModel.reportLostItem(
                token = token.toString(),
                userId = userId.toString(),
                itemName = itemName,
                itemDescription = itemDescription,
                location = selectedLocation,
                foundDate = foundDate,
                imageFile = imageFile
            )

            viewModel.reportResult.observe(viewLifecycleOwner) { result ->
                result.onSuccess {
                    Toast.makeText(requireContext(), "Item reported successfully!", Toast.LENGTH_SHORT).show()
                    bottomSheetDialog.dismiss()
                }.onFailure {
                    Toast.makeText(requireContext(), "Failed to report item: ${it.message}", Toast.LENGTH_LONG).show()
                    // Re-enable for retry
                    modalBinding.reportButton.isEnabled = true
                    modalBinding.reportButton.text = "Report"
                }
            }
        }

        // Setup cancel button
        modalBinding.cancelButton.setOnClickListener {
            bottomSheetDialog.dismiss()
        }

        // Show the modal with animation
        bottomSheetDialog.setContentView(modalBinding.root)

        // Animate the modal appearance
        val slideUp = ObjectAnimator.ofFloat(modalBinding.root, "translationY", 300f, 0f)
        slideUp.duration = 300
        slideUp.interpolator = AccelerateDecelerateInterpolator()
        slideUp.start()

        bottomSheetDialog.show()
    }

    private fun uriToCompressedFile(uri: Uri): File? {
        val context = requireContext()
        val inputStream = context.contentResolver.openInputStream(uri) ?: return null

        // Decode input stream to bitmap
        val bitmap = BitmapFactory.decodeStream(inputStream) ?: return null
        inputStream.close()

        // Create a temp file to write compressed bitmap
        val compressedFile = File.createTempFile("lost_found_compressed_", ".jpg", context.cacheDir)
        val outputStream = FileOutputStream(compressedFile)

        // Compress bitmap (adjust quality as needed)
        bitmap.compress(Bitmap.CompressFormat.JPEG, 60, outputStream) // 60% quality
        outputStream.flush()
        outputStream.close()

        return compressedFile
    }

    private fun requestCameraPermission() {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    }

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            startCamera()
        } else {
            Toast.makeText(requireContext(), "Camera permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())

        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(binding.viewFinder.surfaceProvider)
            }

            imageCapture = ImageCapture.Builder().build()

            try {
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(
                    viewLifecycleOwner, cameraSelector, preview, imageCapture
                )
            } catch (e: Exception) {
                e.printStackTrace()
            }

        }, ContextCompat.getMainExecutor(requireContext()))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        cameraExecutor.shutdown()
        _modalBinding = null
        _binding = null
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == CAMERA_PERMISSION_REQUEST && grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED
        ) {
            // After permission granted, start the camera
            startCamera()
        } else {
            Toast.makeText(requireContext(), "Camera permission denied", Toast.LENGTH_SHORT).show()
        }
    }
}
