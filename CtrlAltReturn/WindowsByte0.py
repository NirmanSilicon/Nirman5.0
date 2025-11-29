import sys
import os
import ctypes
import urllib.request
import zipfile
import subprocess
import time
import re
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QLabel, QComboBox, QPushButton, QProgressBar, QTextEdit, QMessageBox)
from PyQt6.QtCore import QThread, pyqtSignal, Qt

DD_DIR = r"C:\Tools\dd"
DD_EXE = os.path.join(DD_DIR, "dd.exe")
DD_URL = "http://www.chrysocome.net/downloads/dd-0.5.zip"

def is_admin():
    try: return ctypes.windll.shell32.IsUserAnAdmin()
    except: return False

if __name__ == "__main__" and not is_admin():
    ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, __file__, None, 1)
    sys.exit()

class Worker(QThread):
    progress = pyqtSignal(int)
    log = pyqtSignal(str)
    finished = pyqtSignal(bool)

    def __init__(self, disk_num, size):
        super().__init__()
        self.disk_num = disk_num
        self.size = size

    def run(self):
        try:
            self.setup_tools()
            self.unlock_disk()
            self.wipe_disk()
            self.finished.emit(True)
        except Exception as e:
            self.log.emit(f"Error: {e}")
            self.finished.emit(False)

    def setup_tools(self):
        if not os.path.exists(DD_EXE):
            self.log.emit("Downloading dependencies (dd)...")
            os.makedirs(DD_DIR, exist_ok=True)
            urllib.request.urlretrieve(DD_URL, os.path.join(DD_DIR, "dd.zip"))
            with zipfile.ZipFile(os.path.join(DD_DIR, "dd.zip"), 'r') as z:
                z.extractall(DD_DIR)

    def unlock_disk(self):
        self.log.emit(f"Unlocking Disk {self.disk_num} via Diskpart...")
        script = f"select disk {self.disk_num}\nclean\nrescan\nexit"
        with open(r"C:\Tools\dd\unlock.txt", "w") as f: f.write(script)
        subprocess.run(r"diskpart /s C:\Tools\dd\unlock.txt", stdout=subprocess.DEVNULL)
        time.sleep(2)

    def wipe_disk(self):
        self.log.emit("Starting Zero-Fill...")
        cmd = [DD_EXE, "if=/dev/zero", f"of=\\\\.\\PhysicalDrive{self.disk_num}", "bs=1M", "--progress"]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        while True:
            line = proc.stdout.readline()
            if not line and proc.poll() is not None: break
            if line:
                match = re.search(r"(\d+) bytes", line)
                if match and self.size > 0:
                    p = int((int(match.group(1)) / self.size) * 100)
                    self.progress.emit(min(100, p))

class Phase2Window(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BYTE-0 (Functional)")
        self.resize(600, 500)
        self.setStyleSheet("QMainWindow { background-color: #2b2b2b; color: white; }") 
        layout = QVBoxLayout()
        widget = QWidget()
        widget.setLayout(layout)
        self.setCentralWidget(widget)
        self.drive_combo = QComboBox()
        layout.addWidget(QLabel("Select Drive:"))
        layout.addWidget(self.drive_combo)
        btn_refresh = QPushButton("Scan Drives")
        btn_refresh.clicked.connect(self.scan)
        layout.addWidget(btn_refresh)
        self.btn_wipe = QPushButton("WIPE DRIVE")
        self.btn_wipe.setStyleSheet("background-color: red; color: white; padding: 10px;")
        self.btn_wipe.clicked.connect(self.wipe)
        layout.addWidget(self.btn_wipe)
        self.pbar = QProgressBar()
        layout.addWidget(self.pbar)
        self.logs = QTextEdit()
        layout.addWidget(self.logs)
        self.scan()

    def scan(self):
        self.drive_combo.clear()
        cmd = 'powershell "Get-Disk | Select Number, FriendlyName, Size | Format-Table -HideTableHeaders"'
        proc = subprocess.run(cmd, capture_output=True, text=True, shell=True)
        for line in proc.stdout.split('\n'):
            parts = line.split()
            if len(parts) >= 3 and parts[0] != "0":
                 self.drive_combo.addItem(f"Disk {parts[0]}: {parts[1]}", {"n": parts[0], "s": int(parts[-1])})

    def wipe(self):
        d = self.drive_combo.currentData()
        if not d: return
        self.worker = Worker(d['n'], d['s'])
        self.worker.log.connect(self.logs.append)
        self.worker.progress.connect(self.pbar.setValue)
        self.worker.start()
        
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Phase2Window()
    window.show()
    sys.exit(app.exec())