
# Bio-Impulse-Health-Monitoring
Smart Pre-Screening Health Monitoring System
![Project Image](https://res.cloudinary.com/dmnspicpk/image/upload/v1776371806/BioImpulse_Logo_xjawfw.png)

# 📌 Smart Pre-Screening Health Monitoring System

A real-time, multi-sensor system designed to **detect potential illness before individuals enter shared environments** such as classrooms, offices, and public spaces.

Built on a Raspberry Pi, this system integrates **Machine Learning, Computer Vision, Physiological Sensing, and Interactive Controls** to provide early warning signals through AI prediction that may help reduce the spread of illness.

---

## 🚨 Problem

During the COVID-19 pandemic, illnesses spread rapidly in environments like schools and workplaces because:

* Individuals often entered spaces **without knowing they were sick**
* There was **no simple, real-time screening system**
* Monitoring was reactive instead of **preventative**

---

## 💡 Solution

This project provides a **pre-screening system** that:

* Detects individuals using a camera
* Measures physiological indicators (temperature, heart rate, blood pressure)
* Collects data over a short time window for reliability
* Displays results in real time with visual feedback

👉 The goal is to **identify potential illness before exposure occurs**

---

## 🧠 Features

* 🎥 **Computer Vision (YOLO)**
  Detects individuals in real time

* 🌡️ **Thermal Sensing**
  Uses the MLX90640 to estimate temperature

* ❤️ **Heart Rate & Oxygen Saturation Monitoring**
  Uses the MAX30102

* ⏱️ **Timed Data Collection**
  Collects data over a defined window (e.g., 15/45 seconds) for more reliable readings

* 🖱️ **Interactive UI (OpenCV)**
  Touch/click-based controls for starting measurements

* ✅ **Visual Feedback System**
  Displays validated results with indicators (e.g., "complete" text)
  
* ✅ **Dashboard**
  Displays prediction and sensor data onto dashboard for further exploratory analysis

---

## 🏗️ System Architecture

```text
Camera Feed → YOLO Detection → UI Overlay
                    ↓
          Sensor Data Collection
 (Temperature + Heart Rate & Oxygen Saturation)
                    ↓
          Time-Based Aggregation
                    ↓
            Result Validation
                    ↓
             Visual Feedback
                    ↓
          Transmit to Dashboard 
```

---

## 🔄 Process Flow

```text
User Tap (Start)
        ↓
Start Timer (15/45s)
        ↓
Detect Person (YOLO)
        ↓
Collect Sensor Data (Temperature + Heart Rate + Oxygen Saturation)
        ↓
Aggregate Data Over Time
        ↓
Validate Results
        ↓
Display Output + Completion Indicator
        ↓
Send Data To Dashboard
```

---

## 🧰 Hardware Requirements

* Raspberry Pi (recommended: Pi 4 or Pi 5)
* Raspberry Pi Camera Module 3
* MLX90640
* MAX30102
* Jumper wires or prototyping board (Proto HAT recommended)

---

## 🔌 Wiring Overview (I²C)

Both sensors share the same I²C bus:

| Raspberry Pi Pin | Function | Sensors |
| ---------------- | -------- | ------- |
| Pin 1            | 3.3V     | VCC     |
| Pin 6            | GND      | GND     |
| Pin 3            | SDA      | SDA     |
| Pin 5            | SCL      | SCL     |

---

## ⚙️ Software Requirements

* Python 3.9+
* OpenCV
* NumPy
* Pillow
* Picamera2
* Ultralytics YOLO

Install dependencies:

```bash
pip install opencv-python numpy pillow ultralytics
sudo apt install python3-picamera2 python3-smbus i2c-tools
```

---

## 🚀 Running the Project

```bash
python app.py
```

Make sure:

* I²C is enabled (`sudo raspi-config`)
* Sensors are detected (`i2cdetect -y 1`)
* Camera works (`libcamera-hello`)

---

## 🧪 Example Use Case

1. User taps **START**
2. System begins a **15-second data collection window**
3. Camera detects person
4. Sensors gather:
   * Temperature
   * Oxygen Saturation
   * Heart rate
   * Blood Pressure
5. Data is averaged and validated
6. Data is run through a Logistic Regression Classifier
7. Results are displayed on system screen
8. Data with predictions is sent to Dashboard

---

## ⚠️ Disclaimer

This system is **not a medical diagnostic tool**.
It is intended for **early indication and monitoring purposes only**.

---

## 🔮 Future Improvements

* Multi-person tracking
* Face recognition (biometric identification)
* Integration with access control systems

---

## 📸 Demo / Screenshots



---

## 🤝 Contributions

Contributions are welcome!
Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 👤 Author

- Waseem Basit
