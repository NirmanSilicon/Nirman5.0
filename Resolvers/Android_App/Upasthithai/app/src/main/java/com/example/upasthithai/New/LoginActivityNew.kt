//// Jetpack Compose Login Page with Teacher/Student Toggle
//// Assumes Firebase Realtime Database + Authentication logic (manual validation via DB lookup)
//
//import androidx.compose.foundation.layout.*
//import androidx.compose.foundation.text.KeyboardOptions
//import androidx.compose.material3.*
//import androidx.compose.runtime.*
//import androidx.compose.ui.Alignment
//import androidx.compose.ui.Modifier
//import androidx.compose.ui.text.input.KeyboardType
//import androidx.compose.ui.unit.dp
//import androidx.compose.ui.text.input.PasswordVisualTransformation
//import androidx.compose.ui.tooling.preview.Preview
//import androidx.lifecycle.ViewModel
//import androidx.lifecycle.viewModelScope
//import kotlinx.coroutines.launch
//import androidx.compose.runtime.collectAsState
//import kotlinx.coroutines.flow.MutableStateFlow
//import kotlinx.coroutines.flow.asStateFlow
//
//
//@Composable
//fun LoginScreen(viewModel: LoginViewModel = LoginViewModel()) {
//    var selectedRole by remember { mutableStateOf("Teacher") }
//    var userId by remember { mutableStateOf("") }
//    var password by remember { mutableStateOf("") }
//    val loginStatus by viewModel.loginStatus.collectAsState()
//
//    Column(
//        modifier = Modifier.fillMaxSize().padding(24.dp),
//        verticalArrangement = Arrangement.Center,
//        horizontalAlignment = Alignment.CenterHorizontally
//    ) {
//        Text("Login", style = MaterialTheme.typography.headlineMedium)
//        Spacer(modifier = Modifier.height(20.dp))
//
//        // Role DropDown
//        var expanded by remember { mutableStateOf(false) }
//        Box {
//            OutlinedButton(onClick = { expanded = true }) {
//                Text(selectedRole)
//            }
//            DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
//                DropdownMenuItem(text = { Text("Teacher") }, onClick = {
//                    selectedRole = "Teacher"; expanded = false
//                })
//                DropdownMenuItem(text = { Text("Student") }, onClick = {
//                    selectedRole = "Student"; expanded = false
//                })
//            }
//        }
//
//        Spacer(modifier = Modifier.height(16.dp))
//
//        OutlinedTextField(
//            value = userId,
//            onValueChange = { userId = it },
//            label = { Text(if (selectedRole == "Teacher") "Teacher ID" else "Student ID") },
//            modifier = Modifier.fillMaxWidth(),
//            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
//        )
//
//        Spacer(modifier = Modifier.height(12.dp))
//
//        OutlinedTextField(
//            value = password,
//            onValueChange = { password = it },
//            label = { Text("Password") },
//            visualTransformation = PasswordVisualTransformation(),
//            modifier = Modifier.fillMaxWidth()
//        )
//
//        Spacer(modifier = Modifier.height(20.dp))
//
//        Button(onClick = {
//            viewModel.login(selectedRole, userId.trim(), password.trim())
//        }, modifier = Modifier.fillMaxWidth()) {
//            Text("Login")
//        }
//
//        Spacer(modifier = Modifier.height(14.dp))
//
//        TextButton(onClick = {
//            // Auto login test teacher
//            userId = "T1001"
//            password = "sukanta@123"
//            viewModel.login("Teacher", userId, password)
//        }) { Text("Test Teacher Login") }
//
//        TextButton(onClick = {
//            // Auto login test student
//            userId = "2023CSE001"
//            password = "Xy9#Kw21"
//            viewModel.login("Student", userId, password)
//        }) { Text("Test Student Login") }
//
//        Spacer(modifier = Modifier.height(10.dp))
//
//        Text(loginStatus)
//    }
//}
//
//class LoginViewModel : ViewModel() {
//
//    private val _loginStatus = MutableStateFlow("")
//    val loginStatus = _loginStatus.asStateFlow()
//
//    fun login(role: String, id: String, password: String) {
//        if (id.isEmpty() || password.isEmpty()) {
//            _loginStatus.value = "Please fill all fields"
//            return
//        }
//
//        if (role == "Teacher" && id == "T1001" && password == "sukanta@123") {
//            _loginStatus.value = "Teacher Login Successful"
//        } else if (role == "Student" && id == "2023CSE001" && password == "Xy9#Kw21") {
//            _loginStatus.value = "Student Login Successful"
//        } else {
//            _loginStatus.value = "Invalid Credentials"
//        }
//    }
//}
//
//
//@Preview(showBackground = true)
//@Composable
//fun PreviewLogin() {
//    LoginScreen()
//}
