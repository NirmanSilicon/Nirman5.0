package com.yourname.facerecognitionapp.database

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "faces")
data class FaceEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val embedding: String,
    val timestamp: Long = System.currentTimeMillis()
)
