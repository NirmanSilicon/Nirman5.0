package com.yourname.facerecognitionapp.ml

import android.graphics.Bitmap
import android.graphics.Rect
import android.util.Log
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import kotlinx.coroutines.tasks.await
import kotlin.math.abs
import kotlin.math.sqrt

class SimpleFaceMLKit {

    private val detector by lazy {
        val options = FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
            .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
            .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
            .setMinFaceSize(0.15f)
            .enableTracking()
            .build()
        FaceDetection.getClient(options)
    }

    /**
     * Extracts a stable feature vector for a single face in the bitmap.
     * This is NOT a true trained embedding, but a hand-crafted descriptor.
     */
    suspend fun extractFeatures(bitmap: Bitmap): FloatArray? {
        return try {
            val image = InputImage.fromBitmap(bitmap, 0)
            val faces = detector.process(image).await()

            if (faces.isEmpty()) {
                Log.d(TAG, "No face detected")
                return null
            }

            // Use largest face
            val face = faces.maxByOrNull { it.boundingBox.width() * it.boundingBox.height() }
                ?: return null

            // Quality check: face must occupy a reasonable area
            val faceSize = face.boundingBox.width() * face.boundingBox.height()
            val imageSize = bitmap.width * bitmap.height
            val faceSizeRatio = faceSize.toFloat() / imageSize

            if (faceSizeRatio < 0.03f) {
                Log.w(TAG, "Face too small: $faceSizeRatio")
                return null
            }

            // Check rotation (head pose)
            val headY = abs(face.headEulerAngleY)
            val headZ = abs(face.headEulerAngleZ)

            if (headY > 35 || headZ > 35) {
                Log.w(TAG, "Face rotated too much - Y: $headY, Z: $headZ")
                return null
            }

            val features = buildFeatureVector(face, bitmap)
            Log.d(TAG, "Extracted ${features.size} features")

            features
        } catch (e: Exception) {
            Log.e(TAG, "Feature extraction error", e)
            null
        }
    }

    /**
     * Build a more stable feature vector:
     * - Face geometry
     * - Head pose
     * - Eye/smile probabilities (low weight)
     * - Landmark-based ratios (main identity signal)
     */
    private fun buildFeatureVector(
        face: com.google.mlkit.vision.face.Face,
        bitmap: Bitmap
    ): FloatArray {
        val features = mutableListOf<Float>()

        val box: Rect = face.boundingBox
        val faceWidth = box.width().toFloat()
        val faceHeight = box.height().toFloat()

        // 0: aspect ratio
        features.add(faceWidth / faceHeight.coerceAtLeast(1f))

        // 1: relative width
        features.add(faceWidth / bitmap.width.coerceAtLeast(1))

        // 2: relative height
        features.add(faceHeight / bitmap.height.coerceAtLeast(1))

        // Head pose (normalized)
        // 3: X, 4: Y, 5: Z
        features.add(face.headEulerAngleX / 90f)
        features.add(face.headEulerAngleY / 90f)
        features.add(face.headEulerAngleZ / 90f)

        // Expression probabilities (keep, but low weight later)
        val leftEye = face.leftEyeOpenProbability ?: 0.5f
        val rightEye = face.rightEyeOpenProbability ?: 0.5f
        val smile = face.smilingProbability ?: 0.5f

        // 6: leftEye, 7: rightEye, 8: smile, 9: abs diff
        features.add(leftEye)
        features.add(rightEye)
        features.add(smile)
        features.add(abs(leftEye - rightEye))

        // Landmark ratios: main identity cue
        val landmarkFeatures = extractSimpleLandmarks(face)
        features.addAll(landmarkFeatures) // 10..15

        return features.toFloatArray()
    }

    /**
     * Extracts ratios from key landmarks:
     * - eye distance
     * - eye-to-nose distances
     * - horizontal nose offsets
     *
     * Always returns 6 floats (padded).
     */
    private fun extractSimpleLandmarks(face: com.google.mlkit.vision.face.Face): List<Float> {
        val features = mutableListOf<Float>()

        try {
            val leftEye =
                face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.LEFT_EYE)
            val rightEye =
                face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.RIGHT_EYE)
            val nose =
                face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.NOSE_BASE)

            if (leftEye != null && rightEye != null && nose != null) {
                val eyeDistance = distance(
                    leftEye.position.x,
                    leftEye.position.y,
                    rightEye.position.x,
                    rightEye.position.y
                )

                if (eyeDistance > 0) {
                    val leftEyeToNose = distance(
                        leftEye.position.x,
                        leftEye.position.y,
                        nose.position.x,
                        nose.position.y
                    )
                    val rightEyeToNose = distance(
                        rightEye.position.x,
                        rightEye.position.y,
                        nose.position.x,
                        nose.position.y
                    )

                    // Normalize by eye distance
                    features.add(leftEyeToNose / eyeDistance)   // 0
                    features.add(rightEyeToNose / eyeDistance)  // 1

                    val eyeCenterX = (leftEye.position.x + rightEye.position.x) / 2f
                    val noseOffsetX = nose.position.x - eyeCenterX

                    // 2: signed offset, 3: abs offset
                    features.add(noseOffsetX / eyeDistance)
                    features.add(abs(noseOffsetX) / eyeDistance)

                    // Vertical ratio: nose y relative to eye line
                    val eyeCenterY = (leftEye.position.y + rightEye.position.y) / 2f
                    val noseOffsetY = nose.position.y - eyeCenterY
                    features.add(noseOffsetY / eyeDistance)           // 4
                    features.add(abs(noseOffsetY) / eyeDistance)      // 5
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Landmark error", e)
        }

        // Pad to fixed size 6
        while (features.size < 6) {
            features.add(0.0f)
        }

        return features.take(6)
    }

    private fun distance(x1: Float, y1: Float, x2: Float, y2: Float): Float {
        val dx = x2 - x1
        val dy = y2 - y1
        return sqrt(dx * dx + dy * dy)
    }

    /**
     * Cosine similarity in [0, 1].
     * Uses higher weights for landmarks; lower for pose / expression.
     */
    fun calculateSimilarity(features1: FloatArray, features2: FloatArray): Float {
        if (features1.size != features2.size) {
            Log.w(
                TAG,
                "Feature size mismatch: ${features1.size} vs ${features2.size}"
            )
            return 0f
        }

        val size = features1.size

        var dotProduct = 0f
        var norm1 = 0f
        var norm2 = 0f

        for (i in 0 until size) {
            val w = when (i) {
                0, 1, 2 -> 1.5f   // geometry
                3, 4, 5 -> 0.7f   // pose (not identity, less weight)
                6, 7, 8, 9 -> 0.5f // expression
                else -> 2.5f      // landmarks (10..15)
            }

            val f1 = features1[i] * w
            val f2 = features2[i] * w

            dotProduct += f1 * f2
            norm1 += f1 * f1
            norm2 += f2 * f2
        }

        val similarity = if (norm1 > 0 && norm2 > 0) {
            dotProduct / (sqrt(norm1) * sqrt(norm2))
        } else {
            0f
        }

        // Map from [-1, 1] → [0, 1]
        return ((similarity + 1f) / 2f).coerceIn(0f, 1f)
    }

    fun close() {
        detector.close()
    }

    companion object {
        private const val TAG = "SimpleFaceMLKit"
    }
}
