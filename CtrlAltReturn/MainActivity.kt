MainActivity.kt

package com.main.byte030

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import kotlinx.coroutines.*
import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader

class MainActivity : AppCompatActivity() {

    private lateinit var formatButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var statusText: TextView
    private lateinit var deviceNameText: TextView
    private lateinit var warningCard: CardView

    private val usbDeviceName = "USB Drive"

    // UPDATED: Added "2>&1" to redirect error messages to standard output so we can read them.
    private val wipeCommand = "dd if=/dev/zero of=/dev/block/sda bs=64M 2>&1"

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

        deviceNameText.text = getString(R.string.device_name_format, usbDeviceName)

        // Check root immediately
        checkRootAndSetupUI()

        formatButton.setOnClickListener {
            if (!isFormatting) {
                showConfirmationDialog()
            }
        }
    }

    private fun checkRootAndSetupUI() {
        coroutineScope.launch(Dispatchers.IO) {
            val hasRoot = isRootGiven()

            withContext(Dispatchers.Main) {
                if (hasRoot) {
                    formatButton.isEnabled = true
                    formatButton.alpha = 1.0f
                    statusText.visibility = View.VISIBLE
                    statusText.text = "Root Access: Granted"
                } else {
                    formatButton.isEnabled = false
                    formatButton.alpha = 0.5f
                    statusText.visibility = View.VISIBLE
                    statusText.text = "Root Access: Missing or Denied"

                    val builder = AlertDialog.Builder(this@MainActivity)
                    builder.setTitle("Root Required")
                    builder.setMessage("This app requires Root access to function. Please root your device and grant permission.")
                    builder.setPositiveButton("OK", null)
                    builder.show()
                }
            }
        }
    }

    private fun isRootGiven(): Boolean {
        var process: Process? = null
        return try {
            process = Runtime.getRuntime().exec("su")
            val os = DataOutputStream(process.outputStream)
            os.writeBytes("exit\n")
            os.flush()
            val exitValue = process.waitFor()
            exitValue == 0
        } catch (e: Exception) {
            false
        } finally {
            process?.destroy()
        }
    }

    private fun showConfirmationDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(R.string.confirm_title)
        builder.setMessage(R.string.confirm_message)
        builder.setPositiveButton(R.string.btn_yes_format) { dialog, _ ->
            dialog.dismiss()
            startFormatting()
        }
        builder.setNegativeButton(R.string.btn_cancel) { dialog, _ ->
            dialog.dismiss()
        }
        builder.show()
    }

    private fun startFormatting() {
        isFormatting = true

        formatButton.isEnabled = false
        formatButton.alpha = 0.5f
        formatButton.setText(R.string.format_button_formatting)

        progressBar.visibility = View.VISIBLE
        statusText.visibility = View.VISIBLE
        statusText.setText(R.string.status_wiping)

        coroutineScope.launch {
            val result = withContext(Dispatchers.IO) {
                executeWipeCommand()
            }
            finishFormatting(result)
        }
    }

    private fun executeWipeCommand(): Boolean {
        var process: Process? = null
        var os: DataOutputStream? = null
        var reader: BufferedReader? = null

        try {
            process = Runtime.getRuntime().exec("su")
            os = DataOutputStream(process.outputStream)
            // This reader will now catch both standard output AND errors because of "2>&1"
            reader = BufferedReader(InputStreamReader(process.inputStream))

            Log.d("Byte0", "Executing: $wipeCommand")

            os.writeBytes("$wipeCommand\n")
            os.flush()

            os.writeBytes("exit\n")
            os.flush()

            val outputBuilder = StringBuilder()
            var line: String?

            // Read output while process is running
            while (reader.readLine().also { line = it } != null) {
                outputBuilder.append(line).append("\n")
                Log.d("Byte0", "DD Output: $line")
            }

            val exitValue = process.waitFor()
            val fullOutput = outputBuilder.toString()

            // LOGIC FIX:
            // dd returns non-zero (1) when the disk is full.
            // We consider it a SUCCESS if exitValue is 0 OR if it complains about "No space left".
            if (exitValue == 0) {
                return true
            } else if (fullOutput.contains("No space left on device", ignoreCase = true)) {
                Log.d("Byte0", "Drive full (Wipe Complete) - Treating as Success")
                return true
            } else {
                Log.e("Byte0", "Wipe failed with exit code: $exitValue")
                return false
            }

        } catch (e: Exception) {
            e.printStackTrace()
            Log.e("Byte0", "Error executing root command: ${e.message}")
            return false
        } finally {
            try {
                os?.close()
                reader?.close()
                process?.destroy()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun finishFormatting(success: Boolean) {
        isFormatting = false
        progressBar.visibility = View.GONE
        
        // Reset status text
        statusText.text = "Root Access: Granted"

        formatButton.isEnabled = true
        formatButton.alpha = 1.0f
        formatButton.setText(R.string.format_button_default)

        if (success) {
            showSuccessDialog()
        } else {
            showErrorDialog()
        }
    }

    private fun showSuccessDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(R.string.success_title)
        builder.setMessage(R.string.success_message)
        builder.setPositiveButton(R.string.btn_ok) { dialog, _ ->
            dialog.dismiss()
        }
        builder.setCancelable(false)
        val dialog = builder.create()
        dialog.show()
    }

    private fun showErrorDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(R.string.error_title)
        builder.setMessage(R.string.error_message)
        builder.setPositiveButton(R.string.btn_ok) { dialog, _ ->
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