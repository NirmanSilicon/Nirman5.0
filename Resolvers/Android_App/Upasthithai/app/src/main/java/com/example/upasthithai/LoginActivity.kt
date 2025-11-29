package com.example.upasthithai

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.*

class LoginActivity : AppCompatActivity() {

    private lateinit var dbRef: DatabaseReference
    private lateinit var userTypeSpinner: Spinner

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login)

        val loginId = findViewById<EditText>(R.id.loginnametext)
        val loginPassword = findViewById<EditText>(R.id.loginpasswordtext)
        val loginBtn = findViewById<Button>(R.id.loginbtn)
        val testTeacher = findViewById<Button>(R.id.testTeacher)
        val testStudent = findViewById<Button>(R.id.testStudent)
        userTypeSpinner = findViewById(R.id.user_type_spinner)

        dbRef = FirebaseDatabase.getInstance().reference.child("NEW")

        // setup dropdown
        ArrayAdapter.createFromResource(
            this, R.array.user_types_array, android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            userTypeSpinner.adapter = adapter
        }

        loginBtn.setOnClickListener {
            val id = loginId.text.toString().trim()
            val password = loginPassword.text.toString().trim()
            val type = userTypeSpinner.selectedItem.toString()

            if (id.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Enter ID and Password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            when (type.lowercase()) {
                "teacher" -> validateTeacher(id, password)
                "student" -> validateStudent(id, password)
            }
        }

        testTeacher.setOnClickListener {
            validateTeacher("1293", "sukanta@123")
        }

        testStudent.setOnClickListener {
            validateStudent("2023CSE001", "Xy9#Kw21")
        }
    }

    private fun validateTeacher(id: String, password: String) {
        dbRef.child("teachers").child(id).get().addOnSuccessListener { snap ->
            if (!snap.exists()) {
                Toast.makeText(this, "Teacher not found", Toast.LENGTH_SHORT).show()
                return@addOnSuccessListener
            }
            val realPassword = snap.child("appPassword").value.toString()
            if (realPassword == password) {
                saveSession(id, "teacher")
                startActivity(Intent(this, teacherdashboard::class.java))
                finish()
            } else {
                Toast.makeText(this, "Wrong Password!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun validateStudent(id: String, password: String) {
        dbRef.child("classes").get().addOnSuccessListener { classesSnapshot ->
            var found = false
            for (classNode in classesSnapshot.children) {
                val students = classNode.child("students")
                if (students.hasChild(id)) {
                    found = true
                    val realPassword = students.child(id).child("appPassword").value.toString()

                    if (realPassword == password) {
                        saveSession(id, "student")
                        startActivity(Intent(this, studentdashboard::class.java))
                        finish()
                    } else Toast.makeText(this, "Wrong Password!", Toast.LENGTH_SHORT).show()
                    break
                }
            }
            if (!found) Toast.makeText(this, "Student not found", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveSession(id: String, type: String) {
        val pref = getSharedPreferences("user_session", Context.MODE_PRIVATE)
        pref.edit().apply {
            putString("userId", id)
            putString("userType", type)
            putBoolean("isLoggedIn", true)
            apply()
        }
    }
}
