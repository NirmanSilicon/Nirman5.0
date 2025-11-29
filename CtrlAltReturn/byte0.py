import sys
import os
import subprocess
import re
from PyQt6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QLabel, 
                             QPushButton, QComboBox, QProgressBar, QMessageBox)
from PyQt6.QtCore import QThread, pyqtSignal
class WipeWorker(QThread):
    progress_updated = pyqtSignal(float)
    finished_signal = pyqtSignal()
    def __init__(self, device_path):
        super().__init__()
        self.device_path = device_path
    def run(self):
        try:
            size_cmd = f"blockdev --getsize64 {self.device_path}"
            total_bytes = int(subprocess.check_output(size_cmd, shell=True))
        except:
            total_bytes = 0
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
        self.progress_updated.emit(100)
        self.finished_signal.emit()

class Byte0Window(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Byte-0 (Phase 2 Prototype)")
        self.resize(500, 300)
        self.initUI()
        self.load_devices()

    def initUI(self):
        layout = QVBoxLayout()
        layout.addWidget(QLabel("Select Drive to Wipe:"))
        self.combo = QComboBox()
        layout.addWidget(self.combo)
        self.btn_refresh = QPushButton("Refresh Drives")
        self.btn_refresh.clicked.connect(self.load_devices)
        layout.addWidget(self.btn_refresh)
        self.pbar = QProgressBar()
        layout.addWidget(self.pbar)
        self.btn_start = QPushButton("Start Wipe Process")
        self.btn_start.clicked.connect(self.start_wipe)
        layout.addWidget(self.btn_start)
        self.setLayout(layout)

    def load_devices(self):
        self.combo.clear()
        try:
            cmd = "lsblk -d -o NAME,SIZE,MODEL -n"
            output = subprocess.check_output(cmd, shell=True).decode("utf-8")
            for line in output.split('\n'):
                if line and "loop" not in line:
                    self.combo.addItem(f"/dev/{line.split()[0]} - {line}")
        except:
            pass

    def start_wipe(self):
        if self.combo.count() == 0: return
        device = self.combo.currentText().split()[0]
        self.worker = WipeWorker(device)
        self.worker.progress_updated.connect(self.pbar.setValue)
        self.worker.finished_signal.connect(self.on_finished)
        self.btn_start.setEnabled(False)
        self.worker.start()

    def on_finished(self):
        self.btn_start.setEnabled(True)
        QMessageBox.information(self, "Success", "Wipe Operation Complete")
        
if __name__ == "__main__":
    if os.geteuid() != 0:
        print("Please run as ROOT (sudo)")
        sys.exit(1)
    app = QApplication(sys.argv)
    window = Byte0Window()
    window.show()
    sys.exit(app.exec())