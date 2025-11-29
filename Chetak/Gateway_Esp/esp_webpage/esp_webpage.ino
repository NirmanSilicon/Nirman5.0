#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>

// ============================================
// CONFIGURATION
// ============================================
const char* WIFI_SSID = "Liku";
const char* WIFI_PASSWORD = "9337028208";
const uint16_t WEB_SERVER_PORT = 80;

// Software Serial Configuration
const uint8_t SERIAL2_RX_PIN = 14;  // D5
const uint8_t SERIAL2_TX_PIN = 12;  // D6
const uint32_t SERIAL_BAUD_RATE = 115200;

// ============================================
// GLOBAL OBJECTS
// ============================================
SoftwareSerial Serial2(SERIAL2_RX_PIN, SERIAL2_TX_PIN);
ESP8266WebServer server(WEB_SERVER_PORT);

// ============================================
// STATE VARIABLES
// ============================================
String latestData = "Waiting for data...";
String securityStatus = "SECURE";
String submittedData = "Nothing submitted yet.";
unsigned long lastUpdateTime = 0;

// ============================================
// HTML GENERATION
// ============================================
String generateWebPage() {
  bool isSecure = (securityStatus == "SECURE");
  String statusColor = isSecure ? "#4CAF50" : "#f44336";
  String statusIcon = isSecure ? "🔒" : "⚠️";
  
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="10">
    <title>IoT Security Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            animation: fadeInDown 0.6s ease-out;
        }
        
        header h1 {
            font-size: 2.5em;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 10px;
        }
        
        header p {
            font-size: 1.1em;
            opacity: 0.95;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            animation: fadeIn 0.8s ease-out;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .card-header h2 {
            font-size: 1.4em;
            color: #333;
            font-weight: 600;
        }
        
        .card-icon {
            font-size: 1.8em;
        }
        
        .data-display {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            font-family: 'Courier New', monospace;
            font-size: 1.1em;
            word-wrap: break-word;
            color: #333;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .status-card {
            background: )rawliteral" + statusColor + R"rawliteral(;
            color: white;
            text-align: center;
        }
        
        .status-card .card-header {
            border-bottom-color: rgba(255,255,255,0.3);
            justify-content: center;
        }
        
        .status-card h2 {
            color: white;
        }
        
        .status-display {
            font-size: 2em;
            font-weight: bold;
            padding: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        
        .form-card {
            grid-column: 1 / -1;
        }
        
        textarea {
            width: 100%;
            min-height: 120px;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            font-family: 'Courier New', monospace;
            resize: vertical;
            transition: border-color 0.3s ease;
        }
        
        textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-top: 15px;
        }
        
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:active {
            transform: scale(0.98);
        }
        
        .submitted-data {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            color: #333;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .timestamp {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            header h1 {
                font-size: 1.8em;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔐 Secure IoT Dashboard</h1>
            <p>Real-time Encrypted Sensor Monitoring</p>
        </header>
        
        <div class="dashboard-grid">
            <!-- Encrypted Data Card -->
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📡</span>
                    <h2>Encrypted Sensor Data</h2>
                </div>
                <div class="data-display">
                    )rawliteral" + latestData + R"rawliteral(
                </div>
            </div>
            
            <!-- Security Status Card -->
            <div class="card status-card">
                <div class="card-header">
                    <span class="card-icon">)rawliteral" + statusIcon + R"rawliteral(</span>
                    <h2>Security Status</h2>
                </div>
                <div class="status-display">
                    )rawliteral" + securityStatus + R"rawliteral(
                </div>
            </div>
            
            <!-- Data Submission Card -->
            <div class="card form-card">
                <div class="card-header">
                    <span class="card-icon">📝</span>
                    <h2>Submit Data</h2>
                </div>
                <form action="/submit" method="POST">
                    <textarea name="userdata" placeholder="Paste your encrypted data here..." required></textarea>
                    <button type="submit">🚀 Submit Data</button>
                </form>
            </div>
            
            <!-- Last Submitted Data Card -->
            <div class="card form-card">
                <div class="card-header">
                    <span class="card-icon">📋</span>
                    <h2>Last Submitted Data</h2>
                </div>
                <div class="submitted-data">)rawliteral" + submittedData + R"rawliteral(</div>
            </div>
        </div>
        
        <div class="timestamp">
            Last updated: Auto-refresh every 3 seconds
        </div>
    </div>
</body>
</html>
)rawliteral";

  return html;
}

// ============================================
// HTTP HANDLERS
// ============================================
void handleRoot() {
  server.send(200, "text/html", generateWebPage());
}

void handleSubmit() {
  if (server.hasArg("userdata")) {
    submittedData = server.arg("userdata");
    submittedData.trim();
    
    Serial.println("=================================");
    Serial.println("New data received from web interface:");
    Serial.println(submittedData);
    Serial.println("=================================");
  }
  
  // Redirect back to home page
  server.sendHeader("Location", "/");
  server.send(303);
}

// ============================================
// WIFI CONNECTION
// ============================================
void connectToWiFi() {
  Serial.println("\n=================================");
  Serial.println("Connecting to WiFi...");
  Serial.print("SSID: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  uint8_t attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected Successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n✗ WiFi Connection Failed!");
  }
  Serial.println("=================================\n");
}

// ============================================
// SERIAL DATA PROCESSING
// ============================================
void processSerialData() {
  if (Serial2.available()) {
    String line = Serial2.readStringUntil('\n');
    line.trim();
    
    // Check for encrypted data
    if (line.startsWith("[SANDBOX] Received Encrypted Blob:")) {
      latestData = line.substring(35);
      latestData.trim();
      securityStatus = "SECURE";
      lastUpdateTime = millis();
      
      Serial.println("✓ Encrypted data received");
      Serial.println("Data: " + latestData);
    }
    // Check for security alerts
    else if (line.indexOf("SECURITY ALERT") >= 0 || line.indexOf("ATTACK") >= 0) {
      securityStatus = "⚠️ ATTACK DETECTED";
      lastUpdateTime = millis();
      
      Serial.println("✗ SECURITY ALERT DETECTED!");
      Serial.println("Alert: " + line);
    }
    // Log other messages
    else if (line.length() > 0) {
      Serial.println("Serial2: " + line);
    }
  }
}

// ============================================
// SETUP
// ============================================
void setup() {
  // Initialize Serial Communications
  Serial.begin(SERIAL_BAUD_RATE);
  Serial2.begin(SERIAL_BAUD_RATE);
  
  delay(1000);
  Serial.println("\n\n");
  Serial.println("╔═══════════════════════════════════════╗");
  Serial.println("║   ESP8266 IoT Security Dashboard     ║");
  Serial.println("║          Starting Up...               ║");
  Serial.println("╚═══════════════════════════════════════╝");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup Web Server Routes
  server.on("/", handleRoot);
  server.on("/submit", HTTP_POST, handleSubmit);
  
  // Start Web Server
  server.begin();
  Serial.println("✓ Web server started successfully");
  Serial.println("✓ System ready!\n");
  
  lastUpdateTime = millis();
}

// ============================================
// MAIN LOOP
// ============================================
void loop() {
  // Handle incoming web requests
  server.handleClient();
  
  // Process incoming serial data
  processSerialData();
  
  // Optional: Add watchdog or timeout logic here
  // if (millis() - lastUpdateTime > 60000) {
  //   latestData = "No data received (timeout)";
  // }
}