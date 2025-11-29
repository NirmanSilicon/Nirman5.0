package com.yourname.facerecognitionapp.database

import androidx.lifecycle.LiveData
import androidx.room.*

@Dao
interface FaceDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFace(face: FaceEntity): Long

    @Query("SELECT * FROM faces")
    suspend fun getAllFaces(): List<FaceEntity>

    @Query("SELECT * FROM faces")
    fun getAllFacesLive(): LiveData<List<FaceEntity>>

    @Query("SELECT * FROM faces WHERE name = :name LIMIT 1")
    suspend fun getFaceByName(name: String): FaceEntity?

    @Query("SELECT * FROM faces WHERE name = :name")
    suspend fun getFacesByName(name: String): List<FaceEntity>

    @Delete
    suspend fun deleteFace(face: FaceEntity)

    @Query("DELETE FROM faces WHERE name = :name")
    suspend fun deleteFacesByName(name: String)

    @Query("DELETE FROM faces")
    suspend fun deleteAllFaces()
}
