package com.example.facerecognitionapp.utils

import android.content.Context
import android.graphics.Bitmap
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.YuvImage
import android.media.Image
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageProxy
import android.renderscript.*

class YuvToRgbConverter(private val context: Context) {
    private val rs = RenderScript.create(context)
    private val yuvToRgbIntrinsic = ScriptIntrinsicYuvToRGB.create(rs, Element.U8_4(rs))
    private var yuvBytes = ByteArray(0)
    private var inputAllocation: Allocation? = null
    private var outputAllocation: Allocation? = null

    @ExperimentalGetImage
    fun yuvToRgb(image: Image, output: Bitmap) {
        val yuvBytes = yuvBytes(image)
        val yuvType = Type.Builder(rs, Element.U8(rs)).setX(yuvBytes.size)
        if (inputAllocation == null || inputAllocation?.type?.x != yuvBytes.size) {
            inputAllocation = Allocation.createSized(rs, Element.U8(rs), yuvBytes.size)
            outputAllocation = Allocation.createFromBitmap(rs, output)
        }

        inputAllocation!!.copyFrom(yuvBytes)
        yuvToRgbIntrinsic.setInput(inputAllocation)
        yuvToRgbIntrinsic.forEach(outputAllocation)
        outputAllocation!!.copyTo(output)
    }

    private fun yuvBytes(image: Image): ByteArray {
        val yBuffer = image.planes[0].buffer // Y
        val uBuffer = image.planes[1].buffer // U
        val vBuffer = image.planes[2].buffer // V

        val ySize = yBuffer.remaining()
        val uSize = uBuffer.remaining()
        val vSize = vBuffer.remaining()

        if (yuvBytes.size != ySize + uSize + vSize) {
            yuvBytes = ByteArray(ySize + uSize + vSize)
        }

        yBuffer.get(yuvBytes, 0, ySize)
        // NV21 format: VU ordering
        vBuffer.get(yuvBytes, ySize, vSize)
        uBuffer.get(yuvBytes, ySize + vSize, uSize)

        return yuvBytes
    }

    fun destroy() {
        inputAllocation?.destroy()
        outputAllocation?.destroy()
        yuvToRgbIntrinsic.destroy()
        rs.destroy()
    }
}
