package com.main.byte0trial

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AlertDialog
import androidx.cardview.widget.CardView
import kotlinx.coroutines.*
import kotlin.random.Random

class MainActivity : AppCompatActivity() {

    private lateinit var formatButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var statusText: TextView
    private lateinit var deviceNameText: TextView
    private lateinit var warningCard: CardView

    private val usbDeviceName = "USB Drive"
    private var isFormatting = false
    private val coroutineScope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        formatButton = findViewById(R.id.formatButton)
        progressBar = findViewById(R.id.progressBar)
        statusText = findViewById(R.id.statusText)
        deviceNameText = findViewById(R.id.deviceNameText)
        warningCard = findViewById(R.id.warningCard)

        deviceNameText.text = "Device: $usbDeviceName"

        formatButton.isEnabled = true
        formatButton.alpha = 1.0f
        formatButton.setOnClickListener {
            if (!isFormatting) {
                showConfirmationDialog()
            }
        }
    }

    private fun showConfirmationDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirm Format")
        builder.setMessage("Are you sure you want to format this device? All data will be permanently erased.")
        builder.setPositiveButton("Yes, Format") { dialog, _ ->
            dialog.dismiss()
            startFormatting()
        }
        builder.setNegativeButton("Cancel") { dialog, _ ->
            dialog.dismiss()
        }
        builder.show()
    }

    private fun startFormatting() {
        isFormatting = true

        formatButton.isEnabled = false
        formatButton.alpha = 0.5f
        formatButton.text = "Formatting..."

        progressBar.visibility = View.VISIBLE
        statusText.visibility = View.VISIBLE
        statusText.text = "Securely wiping data..."

        coroutineScope.launch {
            val result = withContext(Dispatchers.IO) {
                simulateFormatting()
            }

            finishFormatting(result)
        }
    }

    private suspend fun simulateFormatting(): Boolean {
        val stages = listOf(
            "Initializing format process...",
            "Securely wiping data...",
            "Erasing partition table...",
            "Writing zeros to device...",
            "Verifying operation...",
            "Finalizing format..."
        )

        for (stage in stages) {
            withContext(Dispatchers.Main) {
                statusText.text = stage
            }

            delay(Random.nextLong(500, 1500))

            android.util.Log.d("Byte0", "FAKE: $stage")
        }

        val success = Random.nextInt(100) < 90

        android.util.Log.d("Byte0", "FAKE: Format completed. Success: $success")

        return success
    }

    private fun finishFormatting(success: Boolean) {
        isFormatting = false

        progressBar.visibility = View.GONE
        statusText.visibility = View.GONE

        formatButton.isEnabled = true
        formatButton.alpha = 1.0f
        formatButton.text = "Format"

        if (success) {
            showSuccessDialog()
        } else {
            showErrorDialog()
        }
    }

    private fun showSuccessDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Operation Completed")
        builder.setMessage("The device has been successfully formatted and all data has been securely wiped.")
        builder.setPositiveButton("OK") { dialog, _ ->
            dialog.dismiss()
        }
        builder.setCancelable(false)
        val dialog = builder.create()
        dialog.show()
    }

    private fun showErrorDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Operation Failed")
        builder.setMessage("Failed to format the device. Please ensure your device is rooted and root access is granted.")
        builder.setPositiveButton("OK") { dialog, _ ->
            dialog.dismiss()
        }
        builder.setCancelable(false)
        val dialog = builder.create()
        dialog.show()
    }

    override fun onDestroy() {
        super.onDestroy()
        coroutineScope.cancel()
    }
}