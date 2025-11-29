Secure RISC-V IoT Sandbox with Encrypted Data Execution
📌 Project Overview

Our project is about building a high-security IoT platform using a RISC-V microcontroller. We are implementing a Zero-Trust execution environment where untrusted code, remote updates, and sensor tasks run inside a strict PMP-based sandbox, while all sensitive operations remain protected.

The goal is to ensure attackers cannot modify firmware, steal keys, alter sensor readings, or control the device, even if they gain physical or remote access.

🔐 Core Security Features

✔ Hardware Sandboxing (PMP) — Isolates untrusted tasks in User-Mode jail

✔ Privilege Separation — Machine-Mode monitor controls critical operations

✔ Secure Key Storage — Keys protected inside hardware/OTP, never exposed

✔ Encrypted Communication — End-to-end encrypted sensor data

✔ Attack Detection & Prevention — Blocks unauthorized access in real time

🧩 Full Project Architecture
1️⃣ Hardware Setup

Raspberry Pi Pico 2 (RP2350) — secure execution enclave

ESP8266 — network gateway + OTA loader

UART Connection:

ESP TX → Pico GP1

ESP RX → Pico GP0

GND → GND

Basic test: flash Pico → run blinking program → confirm RISC-V toolchain works.

2️⃣ PMP Sandboxing

We create two regions:

Region	Access	Purpose
Secure Region	M-Mode only	Keys, crypto engine, monitor
Untrusted Region	User-Mode	OTA programs, user tasks

Physical Memory Protection prevents user code from reading keys, modifying firmware, or escaping the sandbox.

3️⃣ Encryption Engine

A secure crypto module (AES/ChaCha20) runs in the protected memory region, handling:

Key generation

Encryption of sensor output

Authentication of incoming OTA code (via SHA-256 accelerator)

Keys never leave the secure area.

4️⃣ Sensor Integration

We read simple sensors (temperature/weight/etc.).
Raw data → encrypted inside secure region → sent out.

5️⃣ Secure Transmission

Encrypted data is sent to ESP8266 or laptop over UART/WiFi.

Even if captured, the attacker cannot decrypt or tamper with values.

6️⃣ Attack Simulation

We show:

Attempt to read keys → blocked by PMP

Attempt to overwrite secure memory → trap raised

Attempt to modify weight/temperature data → denied + alert

A live demo proves the sandbox is working.

🚀 Why RISC-V for IoT Security?

RISC-V gives:

Customizable open ISA

PMP hardware sandboxing

Cheap, license-free implementation

Flexible for adding crypto accelerators

Ideal for secure IoT microcontrollers

⚠️ What Happens If IoT Devices Are Not Protected?
❌ Attackers Take Control

Firmware altered

Full memory access

Device hijacked into botnets

❌ Sensitive Data Theft

Keys extracted

Sensor readings modified

User privacy compromised

❌ Unsafe Actuator Operations

Smart locks opened

Motors/valves manipulated

Industrial sabotage

❌ Network-Wide Infection

One compromised node spreads malware

Cloud receives bogus data

➡️ Without sandboxing + encryption, IoT devices become entry points for massive attacks.

🛡️ Real-World IoT Exploits That Our Design Could Mitigate

Recent vulnerabilities (2024–2025) demonstrate the need for hardware-isolated IoT:

Dahua CCTV Cameras — Remote takeover & arbitrary code execution

ThroughTek Kalay Cameras — Attackers could hijack video streams

RondoDox & BadBox 2.0 Botnets — Millions of smart TVs, DVRs, routers infected

Smart plugs & home devices — Credential leakage → network compromise

Our RISC-V PMP sandbox + encrypted execution would have:

Contained exploits in isolated memory

Prevented key theft

Blocked firmware modification

Detected unauthorized access

🛠️ Threats Prevented by Our Sandbox Solution

Weighing Machine Tampering — Prevents false weight manipulation

Smart Meter Manipulation — Blocks energy data tampering

Industrial Sensor Spoofing — Stops fake temperature/pressure/flow data

Smart Lock Breach — Prevents unauthorized unlocking

Medical Device Tampering — Protects health data integrity

Surveillance Camera Hacks — Blocks feed hijacking & fake video injection

Actuator Hijacking — Prevents malicious control of motors/valves

Smart Appliance Attacks — Protects HVAC/ovens/washers from malware

🧱 Zero-Trust Execution on RP2350

RP2350 provides:

RISC-V Hazard3 cores for PMP-based sandboxing

Machine-Mode Monitor supervising untrusted tasks

Hardware SHA-256 Accelerator for fast code verification

One-Time Programmable (OTP) memory for security metadata

Only verified, authenticated, malware-free code is allowed to execute.