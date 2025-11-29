//package com.example.upasthithai
//
//import android.bluetooth.BluetoothManager
//import android.content.Context
//import androidx.compose.runtime.Composable
//import androidx.compose.ui.platform.LocalContext
//fun scanForBeacon(context: Context) {
//    val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
//    val bluetoothAdapter = bluetoothManager.adapter
//    val bleScanner = bluetoothAdapter.bluetoothLeScanner
//    val handler = Handler(Looper.getMainLooper())
//    val scanDuration = 10000L // 10 seconds
//    val targetUuid = UUID.fromString("12345678-1234-1234-1234-1234567890ab")
//
//    val filter = ScanFilter.Builder()
//        .setServiceUuid(ParcelUuid(targetUuid))
//        .build()
//
//    val settings = ScanSettings.Builder()
//        .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
//        .build()
//
//    val scanCallback = object : ScanCallback() {
//        override fun onScanResult(callbackType: Int, result: ScanResult) {
//            val uuid = result.scanRecord?.serviceUuids?.firstOrNull()?.uuid
//            val rssi = result.rssi
//            if (uuid == targetUuid && rssi > -70) {
//                Log.d("BeaconCheck", " Found Beacon! UUID: $uuid, RSSI: $rssi")
//            }
//        }
//
//        override fun onScanFailed(errorCode: Int) {
//            Log.e("BeaconCheck", " BLE scan failed: $errorCode")
//        }
//    }
//
//    handler.postDelayed({
//        bleScanner.stopScan(scanCallback)
//        Log.i("BeaconCheck", " BLE scan stopped.")
//    }, scanDuration)
//
//    Log.i("BeaconCheck", " Starting BLE scan...")
//    bleScanner.startScan(listOf(filter), settings, scanCallback)
//}
//
//
//
//@Composable
//fun BleScannerScreen(viewModel: BleScannerViewModel = hiltViewModel()) {
//    val context = LocalContext.current
//    val scanStatus by viewModel.scanResult
//
//    LaunchedEffect(Unit) {
//        requestBlePermissions(context as Activity)
//        viewModel.startBleScan()
//    }
//
//    Column(
//        modifier = Modifier
//            .fillMaxSize()
//            .padding(16.dp),
//        verticalArrangement = Arrangement.Center,
//        horizontalAlignment = Alignment.CenterHorizontally
//    ) {
//        Text("BLE Attendance", style = MaterialTheme.typography.titleLarge)
//        Spacer(modifier = Modifier.height(16.dp))
//        Text(scanStatus ?: "Waiting...", style = MaterialTheme.typography.bodyLarge)
//        Spacer(modifier = Modifier.height(32.dp))
//        Button(onClick = { viewModel.startBleScan() }) {
//            Text("Rescan")
//        }
//    }
//}
// This push is just for renaming the git message