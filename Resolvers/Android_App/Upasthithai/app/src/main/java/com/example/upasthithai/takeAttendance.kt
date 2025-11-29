package com.example.upasthithai

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.*

class takeAttendance : AppCompatActivity() {

    private lateinit var btnToggleAttendance: Button
    private lateinit var tvDate: TextView

    private val bleRef: DatabaseReference =
        FirebaseDatabase.getInstance().getReference("BLE").child("ble_id_1")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_take_attendance)

        btnToggleAttendance = findViewById(R.id.btnToggleAttendance)
        tvDate = findViewById(R.id.tvDate)

        // Set today's date
        tvDate.text = java.text.SimpleDateFormat("dd MMM yyyy", java.util.Locale.getDefault())
            .format(java.util.Date())

        // Listen for changes in attendance field
        bleRef.child("attendance").addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val state = snapshot.getValue(String::class.java) ?: "inactive"
                updateUI(state)
            }

            override fun onCancelled(error: DatabaseError) {}
        })

        // Toggle attendance on click
        btnToggleAttendance.setOnClickListener { toggleAttendance() }
    }

    private fun toggleAttendance() {
        val attendanceRef = bleRef.child("attendance")
        attendanceRef.get().addOnSuccessListener { snapshot ->
            val current = snapshot.getValue(String::class.java) ?: "inactive"
            val newState = if (current == "active") "inactive" else "active"

            attendanceRef.setValue(newState).addOnSuccessListener {
                Toast.makeText(
                    this,
                    if (newState == "active") "Attendance Started" else "Attendance Stopped",
                    Toast.LENGTH_SHORT
                ).show()
            }.addOnFailureListener { e ->
                Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun updateUI(state: String) {
        if (state == "active") {
            btnToggleAttendance.text = "Attendance Active (Tap to Stop)"
            btnToggleAttendance.setTextColor(
                resources.getColor(android.R.color.holo_green_dark, theme)
            )
        } else {
            btnToggleAttendance.text = "Activate"
            btnToggleAttendance.setTextColor(
                resources.getColor(android.R.color.white, theme)
            )
        }
    }
}
