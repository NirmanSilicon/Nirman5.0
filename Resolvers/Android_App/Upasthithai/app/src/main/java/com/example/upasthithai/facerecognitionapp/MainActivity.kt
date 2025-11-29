package com.yourname.facerecognitionapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.yourname.facerecognitionapp.database.FaceDatabase
import com.yourname.facerecognitionapp.database.FaceEntity
import com.yourname.facerecognitionapp.databinding.ActivityMainBinding
import com.yourname.facerecognitionapp.databinding.DialogRegisterFaceBinding
import com.yourname.facerecognitionapp.ml.SimpleFaceMLKit
import com.yourname.facerecognitionapp.utils.ImageUtils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var faceRecognition: SimpleFaceMLKit
    private lateinit var database: FaceDatabase

    private var imageCapture: ImageCapture? = null
    private var imageAnalyzer: ImageAnalysis? = null
    private var camera: Camera? = null
    private var cameraProvider: ProcessCameraProvider? = null

    // Mode flags
    @Volatile
    private var isRegistering = false

    @Volatile
    private var isRecognizing = false

    // Prevent multiple frames being processed at the same time
    @Volatile
    private var isProcessingFrame = false

    private val activityResultLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            var permissionGranted = true
            permissions.entries.forEach {
                if (it.key in REQUIRED_PERMISSIONS && !it.value)
                    permissionGranted = false
            }
            if (!permissionGranted) {
                Toast.makeText(this, "Permission request denied", Toast.LENGTH_SHORT).show()
            } else {
                startCamera()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        ImageUtils.initialize(this)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initializeComponents()
        setupButtonListeners()

        if (allPermissionsGranted()) {
            startCamera()
        } else {
            activityResultLauncher.launch(REQUIRED_PERMISSIONS)
        }

        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    private fun initializeComponents() {
        faceRecognition = SimpleFaceMLKit()
        database = FaceDatabase.getDatabase(this)
    }

    private fun setupButtonListeners() {
        binding.btnRegister.setOnClickListener {
            if (!isRegistering && !isRecognizing) {
                startRegistration()
            }
        }

        binding.btnRecognize.setOnClickListener {
            if (!isRecognizing && !isRegistering) {
                startRecognition()
            }
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            cameraProvider = cameraProviderFuture.get()
            bindCameraUseCases()
        }, ContextCompat.getMainExecutor(this))
    }

    private fun bindCameraUseCases() {
        val cameraProvider = cameraProvider
            ?: throw IllegalStateException("Camera initialization failed.")
        val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA

        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(binding.previewView.surfaceProvider)
        }

        imageCapture = ImageCapture.Builder().build()
        imageAnalyzer = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
            .also {
                it.setAnalyzer(cameraExecutor, FaceAnalyzer())
            }

        try {
            cameraProvider.unbindAll()
            camera = cameraProvider.bindToLifecycle(
                this, cameraSelector, preview, imageCapture, imageAnalyzer
            )
        } catch (exc: Exception) {
            Log.e(TAG, "Use case binding failed", exc)
        }
    }

    private fun startRegistration() {
        isRegistering = true
        isRecognizing = false
        binding.btnRegister.text = "Capturing..."
        binding.btnRecognize.isEnabled = false
        binding.tvResult.text = "Position your face in the camera"
    }

    private fun startRecognition() {
        isRecognizing = true
        isRegistering = false
        binding.btnRecognize.text = "Recognizing..."
        binding.btnRegister.isEnabled = false
        binding.tvResult.text = "Looking for faces..."
    }

    private inner class FaceAnalyzer : ImageAnalysis.Analyzer {
        override fun analyze(imageProxy: ImageProxy) {
            // No active mode → ignore frames
            if (!isRegistering && !isRecognizing) {
                imageProxy.close()
                return
            }

            // Avoid parallel processing of multiple frames
            if (isProcessingFrame) {
                imageProxy.close()
                return
            }
            isProcessingFrame = true

            val bitmap = ImageUtils.imageProxyToBitmap(imageProxy)
            if (bitmap == null) {
                Log.e(TAG, "Failed to convert image")
                isProcessingFrame = false
                imageProxy.close()
                return
            }

            val rotatedBitmap =
                ImageUtils.rotateBitmap(bitmap, imageProxy.imageInfo.rotationDegrees)

            lifecycleScope.launch(Dispatchers.IO) {
                try {
                    val features = faceRecognition.extractFeatures(rotatedBitmap)

                    if (features != null) {
                        Log.d(TAG, "Face features extracted: ${features.size}")
                        if (isRegistering) {
                            handleRegistration(features)
                        } else if (isRecognizing) {
                            handleRecognition(features)
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            binding.tvResult.text = if (isRegistering) {
                                "No clear face detected. Try again."
                            } else {
                                "No face found"
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Face analysis error", e)
                    withContext(Dispatchers.Main) {
                        binding.tvResult.text = "Analysis error: ${e.message}"
                    }
                } finally {
                    isProcessingFrame = false
                    imageProxy.close()
                }
            }
        }
    }

    private suspend fun handleRegistration(features: FloatArray) {
        Log.d(TAG, "Processing face for registration with ${features.size} features")

        withContext(Dispatchers.Main) {
            isRegistering = false
            binding.btnRegister.text = "Register Face"
            binding.btnRegister.isEnabled = true
            binding.btnRecognize.isEnabled = true
            showRegistrationDialog(features)
        }
    }

    private suspend fun handleRecognition(features: FloatArray) = withContext(Dispatchers.IO) {
        try {
            val storedFaces = database.faceDao().getAllFaces()

            if (storedFaces.isEmpty()) {
                withContext(Dispatchers.Main) {
                    isRecognizing = false
                    binding.btnRecognize.text = "Recognize"
                    binding.tvResult.text = "No registered faces found"
                    binding.btnRegister.isEnabled = true
                    binding.btnRecognize.isEnabled = true
                }
                return@withContext
            }

            val similarities = mutableListOf<Pair<String, Float>>()

            for (storedFace in storedFaces) {
                val storedFeatures = ImageUtils.jsonToFloatArray(storedFace.embedding)
                val similarity = faceRecognition.calculateSimilarity(features, storedFeatures)
                similarities.add(storedFace.name to similarity)

                Log.d(TAG, "Similarity with ${storedFace.name}: $similarity")
            }

            similarities.sortByDescending { it.second }

            val bestMatch = similarities.firstOrNull()
            val secondBest = if (similarities.size > 1) similarities[1] else null

            // SIMPLE, STRAIGHTFORWARD THRESHOLD
            val threshold = 0.85f  // tune this if needed
            val isValidMatch = bestMatch != null && bestMatch.second >= threshold

            val confidenceScore = bestMatch?.second ?: 0f

            withContext(Dispatchers.Main) {
                isRecognizing = false
                binding.btnRecognize.text = "Recognize"
                binding.btnRegister.isEnabled = true
                binding.btnRecognize.isEnabled = true

                if (isValidMatch && bestMatch != null) {
                    val percentage = (confidenceScore * 100).toInt()
                    binding.tvResult.text = "Hello, ${bestMatch.first}! (${percentage}%)"
                    Toast.makeText(
                        this@MainActivity,
                        "Recognition successful!",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    val percentage = (confidenceScore * 100).toInt()
                    binding.tvResult.text = "Face not recognized (${percentage}%)"
                    Toast.makeText(
                        this@MainActivity,
                        "Please register first or try again",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

        } catch (e: Exception) {
            Log.e(TAG, "Recognition error", e)
            withContext(Dispatchers.Main) {
                isRecognizing = false
                binding.btnRecognize.text = "Recognize"
                binding.btnRegister.isEnabled = true
                binding.btnRecognize.isEnabled = true
                binding.tvResult.text = "Recognition error"
            }
        }
    }


    private fun showRegistrationDialog(features: FloatArray) {
        val dialogBinding = DialogRegisterFaceBinding.inflate(layoutInflater)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogBinding.root)
            .setCancelable(false)
            .create()

        dialogBinding.btnCancel.setOnClickListener {
            dialog.dismiss()
            binding.tvResult.text = "Registration cancelled"
        }

        dialogBinding.btnSave.setOnClickListener {
            val name = dialogBinding.etName.text.toString().trim()
            if (name.isNotEmpty()) {
                lifecycleScope.launch {
                    saveFaceToDatabase(name, features)
                }
                dialog.dismiss()
            } else {
                Toast.makeText(this, "Please enter a name", Toast.LENGTH_SHORT).show()
            }
        }
        dialog.show()
    }

    private suspend fun saveFaceToDatabase(name: String, features: FloatArray) =
        withContext(Dispatchers.IO) {
            try {
                val existingFaces = database.faceDao().getAllFaces()
                val nameExists =
                    existingFaces.any { it.name.equals(name, ignoreCase = true) }

                if (nameExists) {
                    withContext(Dispatchers.Main) {
                        binding.tvResult.text = "Name '$name' already registered!"
                        Toast.makeText(
                            this@MainActivity,
                            "Choose a different name",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    return@withContext
                }

                val faceEntity = FaceEntity(
                    name = name,
                    embedding = ImageUtils.floatArrayToJson(features)
                )
                val id = database.faceDao().insertFace(faceEntity)
                Log.d(TAG, "Face saved successfully with ID: $id")

                withContext(Dispatchers.Main) {
                    binding.tvResult.text = "Face registered for $name!"
                    Toast.makeText(
                        this@MainActivity,
                        "Registration successful!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Database save error", e)
                withContext(Dispatchers.Main) {
                    binding.tvResult.text = "Failed to save face"
                    Toast.makeText(
                        this@MainActivity,
                        "Registration failed!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
        faceRecognition.close()
    }

    companion object {
        private const val TAG = "FaceRecognition"
        private val REQUIRED_PERMISSIONS = arrayOf(
            Manifest.permission.CAMERA
            // You probably don't need WRITE_EXTERNAL_STORAGE anymore on modern Android
            // Manifest.permission.WRITE_EXTERNAL_STORAGE
        )
    }
}
