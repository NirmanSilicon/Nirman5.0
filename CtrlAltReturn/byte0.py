import sys
import os
import subprocess
import re
import datetime
from PyQt6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QLabel, 
                             QPushButton, QComboBox, QProgressBar, QMessageBox, QTextEdit)
from PyQt6.QtCore import QThread, pyqtSignal

# --- WORKER THREAD ---
class WipeWorker(QThread):
    progress_updated = pyqtSignal(float)
    log_updated = pyqtSignal(str)
    finished_signal = pyqtSignal()

    def __init__(self, device_path):
        super().__init__()
        self.device_path = device_path

    def run(self):
        self.log_updated.emit(f"Analyzing {self.device_path}...")
        try:
            size_cmd = f"blockdev --getsize64 {self.device_path}"
            total_bytes = int(subprocess.check_output(size_cmd, shell=True))
        except:
            total_bytes = 0

        self.log_updated.emit("Starting DD subprocess...")
        cmd = ["dd", "if=/dev/zero", f"of={self.device_path}", "bs=4M", "status=progress"]
        process = subprocess.Popen(cmd, stderr=subprocess.PIPE, universal_newlines=True)
        
        while True:
            line = process.stderr.readline()
            if line == '' and process.poll() is not None:
                break
            
            match = re.search(r"(\d+) bytes", line)
            if match and total_bytes > 0:
                current_bytes = int(match.group(1))
                percent = (current_bytes / total_bytes) * 100
                self.progress_updated.emit(percent)

        self.log_updated.emit("Wipe subprocess finished.")
        self.progress_updated.emit(100)
        self.finished_signal.emit()

# --- MAIN WINDOW (DARK MODE) ---
class Byte0Window(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Byte-0 (Phase 2 - Advanced UI)")
        self.resize(500, 450)
        self.initUI()
        self.load_devices()

    def initUI(self):
        # SETTING DARK THEME
        self.setStyleSheet("""
            QWidget { background-color: #2c3e50; color: #ecf0f1; font-family: Arial; }
            QComboBox { padding: 5px; background-color: #34495e; color: white; border: 1px solid #7f8c8d; }
            QPushButton { background-color: #e67e22; color: white; padding: 10px; border-radius: 4px; font-weight: bold; }
            QPushButton:hover { background-color: #d35400; }
            QProgressBar { border: 2px solid #7f8c8d; border-radius: 5px; text-align: center; }
            QProgressBar::chunk { background-color: #27ae60; width: 20px; }
            QTextEdit { background-color: #34495e; border: 1px solid #7f8c8d; color: #ecf0f1; font-family: Monospace; font-size: 10pt; }
        """)

        layout = QVBoxLayout()
        
        title = QLabel("BYTE-0: SECURE WIPER")
        title.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(title)

        layout.addWidget(QLabel("Select Target Drive:"))
        self.combo = QComboBox()
        layout.addWidget(self.combo)

        self.btn_refresh = QPushButton("Refresh Drive List")
        self.btn_refresh.setStyleSheet("background-color: #2980b9;")
        self.btn_refresh.clicked.connect(self.load_devices)
        layout.addWidget(self.btn_refresh)

        # NEW FEATURE: LOG WINDOW
        layout.addWidget(QLabel("Operation Log:"))
        self.log_box = QTextEdit()
        self.log_box.setReadOnly(True)
        layout.addWidget(self.log_box)

        self.pbar = QProgressBar()
        layout.addWidget(self.pbar)

        self.btn_start = QPushButton("INITIALIZE WIPE")
        self.btn_start.clicked.connect(self.start_wipe)
        layout.addWidget(self.btn_start)
        
        self.setLayout(layout)
        self.log("System Initialized. Ready to scan.")

    def log(self, message):
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        self.log_box.append(f"[{timestamp}] {message}")

    def load_devices(self):
        self.combo.clear()
        self.log("Scanning block devices...")
        try:
            cmd = "lsblk -d -o NAME,SIZE,MODEL -n"
            output = subprocess.check_output(cmd, shell=True).decode("utf-8")
            for line in output.split('\n'):
                if line and "loop" not in line:
                    self.combo.addItem(f"/dev/{line.split()[0]} - {line}")
                    self.log(f"Found: /dev/{line.split()[0]}")
        except:
            self.log("Error: Could not scan devices.")

    def start_wipe(self):
        if self.combo.count() == 0: return
        device = self.combo.currentText().split()[0]
        
        self.log(f"Process Started on {device}")
        self.worker = WipeWorker(device)
        self.worker.progress_updated.connect(self.pbar.setValue)
        self.worker.log_updated.connect(self.log)
        self.worker.finished_signal.connect(self.on_finished)
        
        self.btn_start.setEnabled(False) 
        self.worker.start()

    def on_finished(self):
        self.btn_start.setEnabled(True)
        self.log("Operation Complete.")
        QMessageBox.information(self, "Success", "Wipe Operation Complete")

if __name__ == "__main__":
    if os.geteuid() != 0:
        print("Please run as ROOT (sudo)")
        sys.exit(1)
        
    app = QApplication(sys.argv)
    window = Byte0Window()
    window.show()
    sys.exit(app.exec())