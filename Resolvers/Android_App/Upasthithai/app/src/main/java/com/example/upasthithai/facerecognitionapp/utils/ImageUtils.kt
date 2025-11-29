package com.yourname.facerecognitionapp.utils

import android.content.Context
import android.graphics.*
import android.media.Image
import android.util.Base64
import androidx.camera.core.ImageProxy
import com.google.gson.Gson
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import com.example.facerecognitionapp.utils.YuvToRgbConverter


object ImageUtils {

    // YuvToRgbConverter instance for efficient YUV to RGB conversion
    private var yuvToRgbConverter: YuvToRgbConverter? = null

    fun initialize(context: Context) {
        if (yuvToRgbConverter == null) {
            yuvToRgbConverter = YuvToRgbConverter(context)
        }
    }


    fun imageProxyToBitmap(imageProxy: ImageProxy): Bitmap? {
        val image = imageProxy.image ?: return null

        if (yuvToRgbConverter == null) {
            throw IllegalStateException("Call ImageUtils.initialize(context) before using this method")
        }

        val bitmap = Bitmap.createBitmap(imageProxy.width, imageProxy.height, Bitmap.Config.ARGB_8888)
        yuvToRgbConverter?.yuvToRgb(image, bitmap)
        return bitmap
    }

    fun rotateBitmap(bitmap: Bitmap, rotationDegrees: Int): Bitmap {
        val matrix = Matrix()
        matrix.postRotate(rotationDegrees.toFloat())
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }

    fun bitmapToBase64(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }

    fun base64ToBitmap(base64String: String): Bitmap {
        val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    }

    fun floatArrayToJson(array: FloatArray): String {
        return Gson().toJson(array)
    }

    fun jsonToFloatArray(json: String): FloatArray {
        return Gson().fromJson(json, FloatArray::class.java)
    }
}
