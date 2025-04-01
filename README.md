# 🚗 GPS + GSM Fleet Management System

🌐 **Sample Dashboard**: [https://thinking-robot-co.github.io/GPS_GSM_DEV/](https://thinking-robot-co.github.io/GPS_GSM_DEV/)

---

## 📦 Project Overview

This is a modular GPS + GSM-based Fleet Management System designed to manage any kind of vehicle—trucks, buses, or cars. Each unit is a compact, credit-card-sized device that can be mounted on different parts of a vehicle, each connected via CAN Bus. These smart modules track real-time GPS data, send updates over GSM (GPRS), and support sensor integration for fleet monitoring and analysis.

---

## 🧠 Features

- 📍 Real-time GPS tracking using **SIM808**
- 📡 GSM connectivity for HTTP data upload to **Firebase**
- 📊 Web dashboard for live data visualization
- 📦 Modular design—multiple devices per vehicle
- 📈 Sensor integration (temperature, motion, fuel, etc.)
- 🔌 CAN Bus communication between devices

---

## 🧰 Hardware Components

- **STM32F103C8T6 (Blue Pill)**
- **SIM808 GSM + GPS module**
- **CAN Transceivers (e.g., MCP2551 or SN65HVD230)**
- Optional sensors:
  - Temperature Sensor (e.g., DS18B20)
  - Accelerometer (e.g., MPU6050)
  - Fuel Level Sensor
  - etc.

---

## 🖥️ Software Stack

- **Embedded C** for STM32 (Keil / STM32CubeIDE)
- **AT Commands** for SIM808 (Serial via UART)
- **Firebase** as cloud database (Free Tier)
- **HTML/CSS/JS** Web Dashboard (hosted via GitHub Pages)

---

## 🔗 Communication Flow

1. STM32 gets GPS data from SIM808 using AT commands.
2. STM32 sends data over GPRS (HTTP POST) to Firebase.
3. Firebase stores and syncs vehicle data in real-time.
4. Web dashboard fetches data via Firebase SDK and displays it.

---

## 📁 Folder Structure

