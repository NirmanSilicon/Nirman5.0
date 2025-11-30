# Cyber Sentinel

A full-stack CCTV Security Scanning Platform with real-time monitoring, RTSP vulnerability scanning, and enterprise-grade encryption.

> **Team:** Binary Bytes  
> **Note:** For smooth login and API access, **use Cloudflare WARP or any VPN** (recommended due to routing restrictions).

---

## 📋 Overview
Cyber Sentinel is a secure CCTV Security Scanning and Monitoring Platform built with a modern TypeScript-based stack.  
It includes encrypted RTSP scanning, threat detection, camera management, analytics dashboard, and a virtual CCTV lab.

The system uses strong AES-256-GCM encryption, secure JWT authentication, MongoDB storage, and a responsive React-based frontend.

---

## ✨ Features
### ✔ Core Features
- Secure user authentication (JWT + HTTP-only cookies)
- AES-256-GCM encrypted RTSP URL handling
- Real-time threat monitoring & activity feed
- Automated security scanning with risk scoring
- Camera management (CRUD + status tracking)
- Virtual CCTV Lab with live webcam simulation
- Security hardening recommendations
- Analytics dashboard with charts (Recharts)

### ✔ Backend Features
- RESTful API with Next.js App Router
- MongoDB persistence with Mongoose
- Strong password hashing (bcryptjs)
- PBKDF2 key derivation + HMAC signatures
- CORS, validation, and structured error handling

### ✔ Frontend Features
- React 18 + Vite for fast performance
- Tailwind CSS dark UI
- Radix UI components (50+)
- Protected routing with React Router
- Recharts-based visual analytics

---

## 🛠 Tech Stack

### 🔹 Frontend
- **React 18**, **Vite 6**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **Recharts**
- **React Router DOM**
- **React Hook Form**
- **Lucide Icons**

### 🔹 Backend
- **Next.js 15 (App Router)**
- **Node.js + TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs Password Hashing**
- **AES-256-GCM Encryption**
- **PBKDF2 Key Derivation**
- **dotenv for environment configuration**

---

## 🚀 Development Setup

### Frontend
```bash
npm install
npm run dev
 

  same for backend 
    cd binary_bytes/BACKEND/backend2
    npm install
    npm run dev