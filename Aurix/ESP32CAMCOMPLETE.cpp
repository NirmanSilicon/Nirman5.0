#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "esp_camera.h"
#include <UniversalTelegramBot.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

const char* ssid = "siliconap";
const char* password = "silicon@123";

const char* BOT_TOKEN = "8164035767:AAEhHbNs2mnkKulf34ELhHa9z_mZUuXWAi8";
const String USER_CHAT_ID = "6267027710";
const String GUARDIAN_CHAT_ID = "7199124649";
const String POLICE_CHAT_ID = "7019139762";

#define DEFENCE_BUTTON_PIN 2
#define PANIC_BUTTON_PIN 12
#define SAFE_BUTTON_PIN 13
#define FLASHLIGHT_PIN 4

#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

HardwareSerial& GPSSerial = Serial;
TinyGPSPlus gps;

String name = "Satyabrata Pradhan";
String age = "21";
String gender = "male";
String mobile = "999999999";
String guardian = "999999999";
String address = "Jaleswar, Balasore, Odisha";
String profession = "Student";
String bloodGroup = "A+ve";

bool trackingActive = false;
unsigned long lastTrackTime = 0;
unsigned long lastButtonPress = 0;
const long debounceDelay = 200;
String userState = "IDLE";
String complaintText = "";

String userProvidedLocationLink = "";
unsigned long linkTimestamp = 0;
const unsigned long LINK_EXPIRY_TIME = 4 * 60 * 60 * 1000;

WiFiClientSecure client;
UniversalTelegramBot bot(BOT_TOKEN, client);

const unsigned long BOT_MTBS = 3000;
unsigned long bot_lasttime;
int bot_lastUpdateID = 0;

void setupCamera();
void setupGPIO();
void handleNewMessages(int numNewMessages);
String sendPhotoToTelegram(String chatID);
void sendDefenceAlert();
void sendPanicAlert();
void sendSafeAlert();
String getGoogleMapsLink();
void sendComplaintToPolice();
void sendLocationMessage();

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.begin(115200);
  GPSSerial.begin(9600, SERIAL_8N1, 3, 1);

  WiFi.mode(WIFI_STA);
  client.setCACert(TELEGRAM_CERTIFICATE_ROOT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  setupGPIO();
  setupCamera();

  bot.sendMessage(USER_CHAT_ID, "Device is online. Type /start to begin & /set to set your live location for emergency if gps module fails.");
  bot.sendMessage(GUARDIAN_CHAT_ID, "Device is online. Type /start to begin.");
  bot.sendMessage(POLICE_CHAT_ID, "Device is online. Type /start to begin.");
}

void loop() {
  if (millis() - bot_lasttime > BOT_MTBS) {
    int numNewMessages = bot.getUpdates(bot_lastUpdateID + 1);
    while (numNewMessages) {
      handleNewMessages(numNewMessages);
      numNewMessages = bot.getUpdates(bot_lastUpdateID + 1);
    }
    bot_lasttime = millis();
  }

  if (millis() - lastButtonPress > debounceDelay) {
    if (digitalRead(PANIC_BUTTON_PIN) == LOW) {
      Serial.println("Panic Button Pressed!");
      lastButtonPress = millis();
      sendPanicAlert();
      sendLocationMessage();
    }

    if (digitalRead(DEFENCE_BUTTON_PIN) == LOW) {
      Serial.println("Defence Button Pressed!");
      lastButtonPress = millis();
      sendDefenceAlert();
      sendLocationMessage();
    }

    if (digitalRead(SAFE_BUTTON_PIN) == LOW) {
      Serial.println("Safe Button Pressed!");
      lastButtonPress = millis();
      sendSafeAlert();
      sendLocationMessage();
    }
  }

  if (trackingActive && millis() - lastTrackTime > 30000) {
    sendLocationMessage();
    lastTrackTime = millis();
  }

  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }
}

void setupGPIO() {
  pinMode(FLASHLIGHT_PIN, OUTPUT);
  pinMode(PANIC_BUTTON_PIN, INPUT_PULLUP);
  pinMode(DEFENCE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(SAFE_BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(FLASHLIGHT_PIN, LOW);
}

void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 30;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
  } else {
    Serial.println("Camera initialized successfully.");
  }
}

void handleNewMessages(int numNewMessages) {
  for (int i = 0; i < numNewMessages; i++) {
    bot_lastUpdateID = bot.messages[i].update_id;
    String chatID = String(bot.messages[i].chat_id);
    String text = bot.messages[i].text;

    Serial.printf("New message from %s: %s\n", chatID.c_str(), text.c_str());

    if (chatID == USER_CHAT_ID && userState == "AWAITING_LOCATION_LINK") {
      if (text.startsWith("http://") || text.startsWith("https://")) {
        userProvidedLocationLink = text;
        linkTimestamp = millis();
        userState = "IDLE";
        bot.sendMessage(chatID, "✅ Thank you! I have saved your live location link for the next 4 hours.");
        Serial.println("Saved user-provided location link.");
        continue;
      } else {
        bot.sendMessage(chatID, "❌ That doesn't look like a valid location link. Please share a link from a maps app (e.g., Google Maps).");
        continue;
      }
    }

    if (chatID == USER_CHAT_ID) {
      if (text == "/start") {
        userState = "IDLE";
        String welcomeMessage = "👋 HELLO USER WELCOME TO - AURIX - Advanced Utility for Response, Intelligence & eXecution. -personal safety device for self defence.\nAvailable commands:\n/show - Show user details\n/set - Set your live location link\n/track - Start continuous location tracking\n/stop - Stop tracking\n/photo - Capture and send a photo\n/location - Get your current location";
        bot.sendMessage(chatID, welcomeMessage, "Markdown");
      } else if (text == "/show") {
        userState = "IDLE";
        String details = "📋 Your Details:\n";
        details += "👱‍♂ Name: " + name + "\n";
        details += "🎂 Age: " + age + "\n";
        details += "⚧ Gender: " + gender + "\n";
        details += "📱 Mobile: " + mobile + "\n";
        details += "👨‍👩‍👧 Guardian: " + guardian + "\n";
        details += "🏠 Address: " + address + "\n";
        details += "💼 Profession: " + profession + "\n";
        details += "🩸 Blood Group: " + bloodGroup + "\n\n";

        if (!userProvidedLocationLink.isEmpty()) {
          details += "📍 Your last provided location link:\n" + userProvidedLocationLink;
        } else {
          details += "📍 No location link is currently set. Please use /set to provide one.";
        }
        bot.sendMessage(chatID, details, "Markdown");
      } else if (text == "/set") {
        userState = "AWAITING_LOCATION_LINK";
        bot.sendMessage(chatID, "🌐 Please share your live location link from a maps app. I will save it to use when GPS is unavailable.");
      } else if (text == "/track") {
        userState = "IDLE";
        trackingActive = true;
        lastTrackTime = millis();
        bot.sendMessage(chatID, "✅ Continuous tracking started. You will receive location updates every 30 seconds.");
      } else if (text == "/stop") {
        userState = "IDLE";
        trackingActive = false;
        bot.sendMessage(chatID, "❌ Tracking stopped.");
      } else if (text == "/photo") {
        userState = "IDLE";
        bot.sendMessage(chatID, "📸 Please wait while I capture a photo...", "Markdown");
        sendPhotoToTelegram(USER_CHAT_ID);
      } else if (text == "/location") {
        userState = "IDLE";
        sendLocationMessage();
      }
    } else if (chatID == GUARDIAN_CHAT_ID) {
      if (text == "/start") {
        userState = "IDLE";
        String welcomeMessage = "👋 HELLO WELCOME TO AURIX - Advanced Utility for Response, Intelligence & eXecution - personal safety device for self defence. This bot lets you receive live alerts 📢, photos 📸, and GPS location 📍 when the user is in distress.\n Buttons you can use - To /show the details of user.\nTo get the current /location of the User.\nTo /track the User & to /stop it.\nTo register a /complaint at police.\nTo get the live /photo from the User";
        bot.sendMessage(chatID, welcomeMessage, "Markdown");
      } else if (text == "/show") {
        userState = "IDLE";
        String details = "📋 User Details:\n";
        details += "👱‍♂ Name: " + name + "\n";
        details += "🎂 Age: " + age + "\n";
        details += "⚧ Gender: " + gender + "\n";
        details += "📱 Mobile: " + mobile + "\n";
        details += "👨‍👩‍👧 Guardian: " + guardian + "\n";
        details += "🏠 Address: " + address + "\n";
        details += "💼 Profession: " + profession + "\n";
        details += "🩸 Blood Group: " + bloodGroup + "\n";
        bot.sendMessage(chatID, details, "Markdown");
      } else if (text == "/photo") {
        userState = "IDLE";
        bot.sendMessage(chatID, "📸 Please wait while I capture a photo...", "Markdown");
        sendPhotoToTelegram(GUARDIAN_CHAT_ID);
      } else if (text == "/location") {
        userState = "IDLE";
        sendLocationMessage();
      } else if (text == "/track") {
        userState = "IDLE";
        trackingActive = true;
        lastTrackTime = millis();
        bot.sendMessage(chatID, "✅ Continuous tracking started. You will receive location updates every 30 seconds.");
      } else if (text == "/stop") {
        userState = "IDLE";
        trackingActive = false;
        bot.sendMessage(chatID, "❌ Tracking stopped.");
      } else if (text == "/complaint") {
        userState = "COMPLAINT_TEXT";
        bot.sendMessage(chatID, "What is the emergency?");
      } else if (userState == "COMPLAINT_TEXT") {
        complaintText = text;
        userState = "IDLE";
        sendComplaintToPolice();
        bot.sendMessage(chatID, "✅ Complaint sent successfully to Police");
      }
    } else if (chatID == POLICE_CHAT_ID) {
      if (text == "/start") {
        String welcomeMessage = "👮 HELLO WELCOME TO AURIX - Advanced Utility for Response, Intelligence & eXecution - personal safety device for self defence.\nButtons You can use - To /show the details of the User\nTo get the current /location of the User.\nTo get the current /photo of the User.\nTo /track the User & to /stop .";
        bot.sendMessage(chatID, welcomeMessage, "Markdown");
      } else if (text == "/show") {
        String details = "📋 User Details:\n";
        details += "👱‍♂ Name: " + name + "\n";
        details += "🎂 Age: " + age + "\n";
        details += "⚧ Gender: " + gender + "\n";
        details += "📱 Mobile: " + mobile + "\n";
        details += "👨‍👩‍👧 Guardian: " + guardian + "\n";
        details += "🏠 Address: " + address + "\n";
        details += "💼 Profession: " + profession + "\n";
        details += "🩸 Blood Group: " + bloodGroup + "\n";
        bot.sendMessage(chatID, details, "Markdown");
      } else if (text == "/photo") {
        bot.sendMessage(chatID, "📸 Please wait while I capture a photo...", "Markdown");
        sendPhotoToTelegram(POLICE_CHAT_ID);
      } else if (text == "/location") {
        sendLocationMessage();
      } else if (text == "/track") {
        trackingActive = true;
        lastTrackTime = millis();
        bot.sendMessage(chatID, "✅ Continuous tracking started. You will receive location updates every 30 seconds.");
      } else if (text == "/stop") {
        trackingActive = false;
        bot.sendMessage(chatID, "❌ Tracking stopped.");
      }
    }
  }
}

void sendDefenceAlert() {
  String message = "I have activated Defence Mode for my safety -- please monitor me closely. 🚔\n\n👱‍♂ Name: " + name + "\n🎂 Age: " + age + "\n⚧ Gender: " + gender + "\n📱 Mobile: " + mobile + "\n👨‍👩‍👧 Guardian: " + guardian + "\n🏠 Address: " + address + "\n💼 Profession: " + profession + "\n🩸 Blood Group: " + bloodGroup + "\n\nThe attached live photo was captured just now from my safety glove device.";
  String photoStatus = sendPhotoToTelegram(GUARDIAN_CHAT_ID);
  bot.sendMessage(GUARDIAN_CHAT_ID, message, "Markdown");
  if (photoStatus == "Camera capture failed") {
    bot.sendMessage(GUARDIAN_CHAT_ID, "❌ Failed to capture photo for the alert.");
  }

  photoStatus = sendPhotoToTelegram(POLICE_CHAT_ID);
  bot.sendMessage(POLICE_CHAT_ID, message, "Markdown");
  if (photoStatus == "Camera capture failed") {
    bot.sendMessage(POLICE_CHAT_ID, "❌ Failed to capture photo for the alert.");
  }

  String feedback = "✅ Defence alert sent to Guardian & Police.\n📸 Here's the exact photo I just sent so you can see it too.";
  bot.sendMessage(USER_CHAT_ID, feedback);
  sendPhotoToTelegram(USER_CHAT_ID);
}

void sendPanicAlert() {
  String message = "🚨 EMERGENCY ALERT!\nThis is " + name + ". I am in danger and need help immediately! 🚑🚓\n\n👱‍♂ Name: " + name + "\n🎂 Age: " + age + "\n⚧ Gender: " + gender + "\n📱 Mobile: " + mobile + "\n👨‍👩‍👧 Guardian: " + guardian + "\n🏠 Address: " + address + "\n💼 Profession: " + profession + "\n🩸 Blood Group: " + bloodGroup;
  bot.sendMessage(GUARDIAN_CHAT_ID, message, "Markdown");
  bot.sendMessage(POLICE_CHAT_ID, message, "Markdown");

  String feedback = "✅ Panic alert sent to Guardian & Police.\nThey have received your full details with your live GPS location.";
  bot.sendMessage(USER_CHAT_ID, feedback);
}

void sendSafeAlert() {
  String message = "✅ SAFE MODE CONFIRMATION\n\nI am safe at the moment -- sending you my details and current status for your records. 😊\n\n👱‍♂ Name: " + name + "\n🎂 Age: " + age + "\n⚧ Gender: " + gender + "\n📱 Mobile: " + mobile + "\n👨‍👩‍👧 Guardian: " + guardian + "\n🏠 Address: " + address + "\n💼 Profession: " + profession + "\n🩸 Blood Group: " + bloodGroup + "\n\nThe attached photo was captured just now to confirm my safety.";
  String photoStatus = sendPhotoToTelegram(GUARDIAN_CHAT_ID);
  bot.sendMessage(GUARDIAN_CHAT_ID, message, "Markdown");
  if (photoStatus == "Camera capture failed") {
    bot.sendMessage(GUARDIAN_CHAT_ID, "❌ Failed to capture photo for the alert.");
  }

  photoStatus = sendPhotoToTelegram(POLICE_CHAT_ID);
  bot.sendMessage(POLICE_CHAT_ID, message, "Markdown");
  if (photoStatus == "Camera capture failed") {
    bot.sendMessage(POLICE_CHAT_ID, "❌ Failed to capture photo for the alert.");
  }

  String feedback = "✅ Safe mode message sent to Guardian & Police.\n📸 Here's the exact safe mode photo I just sent so you can see it too.";
  bot.sendMessage(USER_CHAT_ID, feedback);
  sendPhotoToTelegram(USER_CHAT_ID);
}

void sendComplaintToPolice() {
  String message = "🚨 EMERGENCY COMPLAINT from Guardian:\n\nComplaint: " + complaintText + "\n\n👱‍♂ Name: " + name + "\n🎂 Age: " + age + "\n⚧ Gender: " + gender + "\n📱 Mobile: " + mobile + "\n👨‍👩‍👧 Guardian: " + guardian + "\n🏠 Address: " + address + "\n💼 Profession: " + profession + "\n🩸 Blood Group: " + bloodGroup;
  bot.sendMessage(POLICE_CHAT_ID, message, "Markdown");
  delay(100);
  sendLocationMessage();
}

void sendLocationMessage() {
  String locationLink = getGoogleMapsLink();
  if (locationLink != "GPS_Error") {
    String locationMessage = "📍 Current location:\n" + locationLink;
    bot.sendMessage(GUARDIAN_CHAT_ID, locationMessage, "Markdown");
    bot.sendMessage(POLICE_CHAT_ID, locationMessage, "Markdown");
    bot.sendMessage(USER_CHAT_ID, locationMessage, "Markdown");
  } else {
    if (!userProvidedLocationLink.isEmpty() && (millis() - linkTimestamp < LINK_EXPIRY_TIME)) {
      String storedLocationMessage = "🚨 GPS Error. Sharing the last user-provided location link from " + String((millis() - linkTimestamp) / 60000) + " minutes ago:\n" + userProvidedLocationLink;
      bot.sendMessage(GUARDIAN_CHAT_ID, storedLocationMessage, "Markdown");
      bot.sendMessage(POLICE_CHAT_ID, storedLocationMessage, "Markdown");
      bot.sendMessage(USER_CHAT_ID, storedLocationMessage, "Markdown");
    } else {
      String errorMessage = "❌ Unable to get GPS location. The user's provided link has expired or is not set. Please use /set to share a new live location link from a maps app, and I will use it for the next 4 hours.";
      userState = "AWAITING_LOCATION_LINK";
      bot.sendMessage(USER_CHAT_ID, errorMessage);
      bot.sendMessage(GUARDIAN_CHAT_ID, "❌ Unable to get user's GPS location. The user's stored link is expired. Awaiting a new live location link from the user.");
      bot.sendMessage(POLICE_CHAT_ID, "❌ Unable to get user's GPS location. Awaiting a live location link from the user.");
    }
  }
}

String sendPhotoToTelegram(String chatID) {
  const char* myDomain = "api.telegram.org";
  String getAll = "";
  String getBody = "";
  camera_fb_t *fb = NULL;

  int maxRetries = 3;
  for (int i = 0; i < maxRetries; i++) {
      digitalWrite(FLASHLIGHT_PIN, HIGH);
      delay(2000);
      digitalWrite(FLASHLIGHT_PIN, LOW);
      delay(1000);

      fb = esp_camera_fb_get();
      digitalWrite(FLASHLIGHT_PIN, HIGH);
      delay(500);

      digitalWrite(FLASHLIGHT_PIN, LOW);

      if (fb) {
          Serial.printf("Camera capture successful on attempt %d. Size: %d bytes.\n", i + 1, fb->len);
          break;
      } else {
          Serial.printf("Camera capture failed on attempt %d.\n", i + 1);
          if (i < maxRetries - 1) {
              esp_camera_deinit();
              delay(1000);
              setupCamera();
              delay(500);
          } else {
              Serial.println("All capture attempts failed.");
              return "Camera capture failed";
          }
      }
  }

  if (!fb) {
      return "Camera capture failed";
  }

  if (client.connect(myDomain, 443)) {
    String head = "--Boundary\r\nContent-Disposition: form-data; name=\"chat_id\"; \r\n\r\n" + chatID + "\r\n--Boundary\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"esp32-cam.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
    String tail = "\r\n--Boundary--\r\n";

    uint16_t imageLen = fb->len;
    uint16_t extraLen = head.length() + tail.length();
    uint16_t totalLen = imageLen + extraLen;

    client.println("POST /bot" + String(BOT_TOKEN) + "/sendPhoto HTTP/1.1");
    client.println("Host: " + String(myDomain));
    client.println("Content-Length: " + String(totalLen));
    client.println("Content-Type: multipart/form-data; boundary=Boundary");
    client.println();
    client.print(head);

    size_t bytesSent = 0;
    while(bytesSent < imageLen) {
      size_t chunk_size = (imageLen - bytesSent > 1024) ? 1024 : (imageLen - bytesSent);
      client.write(fb->buf + bytesSent, chunk_size);
      bytesSent += chunk_size;
    }

    client.print(tail);

    int waitTime = 10000;
    long startTimer = millis();
    boolean state = false;

    while ((startTimer + waitTime) > millis()){
      while (client.available()){
          char c = client.read();
          if (c == '\n'){
            if (getAll.length()==0) state=true;
            getAll = "";
          }
          else if (c != '\r'){
            getAll += String(c);
          }
          if (state==true){
            getBody += String(c);
          }
          startTimer = millis();
        }
        if (getBody.length()>0) break;
        delay(1);
    }
    client.stop();
  } else {
    Serial.println("Connection to Telegram failed.");
    esp_camera_fb_return(fb);
    return "Connection to Telegram failed";
  }

  esp_camera_fb_return(fb);

  return getBody;
}

String getGoogleMapsLink() {
  unsigned long startMillis = millis();
  while (millis() - startMillis < 5000) {
    if (GPSSerial.available()) {
      gps.encode(GPSSerial.read());
    }
    if (gps.location.isValid()) {
      double latitude = gps.location.lat();
      double longitude = gps.location.lng();
      return "https://maps.google.com/?q=" + String(latitude, 6) + "," + String(longitude, 6);
    }
  }
  return "GPS_Error";
}
