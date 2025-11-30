import sys
import os
import ctypes
import urllib.request
import zipfile
import subprocess
import time
import re

from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QComboBox, QPushButton, 
                             QProgressBar, QTextEdit, QMessageBox)
from PyQt6.QtCore import QThread, pyqtSignal, Qt
from PyQt6.QtGui import QFont, QIcon

# --- CONFIGURATION ---
DD_DIR = r"C:\Tools\dd"
DD_EXE = os.path.join(DD_DIR, "dd.exe")
# Using a common mirror or original source. 
# Note: Newer versions of dd for windows exist, but this is the classic stable one.
DD_URL = "http://www.chrysocome.net/downloads/dd-0.5.zip"

# --- 1. ADMIN CHECK ---
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

if __name__ == "__main__" and not is_admin():
    # Re-run the script with Admin rights
    ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, __file__, None, 1)
    sys.exit()

# --- 2. WORKER THREAD (The Engine) ---
class WipeWorker(QThread):
    progress_signal = pyqtSignal(int)
    log_signal = pyqtSignal(str)
    finished_signal = pyqtSignal(bool)

    def __init__(self, disk_number, drive_size):
        super().__init__()
        self.disk_number = disk_number
        self.drive_size = drive_size # In bytes
        self.is_running = True

    def run(self):
        try:
            self.install_dd()
            
            # Step 1: Unlock/Clean
            if not self.run_diskpart_clean():
                self.finished_signal.emit(False)
                return

            # Step 2: Run DD
            if not self.run_dd_wipe():
                self.finished_signal.emit(False)
                return

            self.log_signal.emit("\n[DONE] Wipe completed successfully.")
            self.finished_signal.emit(True)

        except Exception as e:
            self.log_signal.emit(f"[CRITICAL ERROR] {str(e)}")
            self.finished_signal.emit(False)

    def install_dd(self):
        if not os.path.exists(DD_DIR):
            os.makedirs(DD_DIR)
        
        if not os.path.exists(DD_EXE):
            self.log_signal.emit("Downloading dd.exe...")
            zip_path = os.path.join(DD_DIR, "dd.zip")
            # Headers sometimes needed for certain servers, keeping it simple here
            urllib.request.urlretrieve(DD_URL, zip_path)
            
            with zipfile.ZipFile(zip_path, 'r') as z:
                for f in z.namelist():
                    if f.endswith("dd.exe"):
                        with z.open(f) as s, open(DD_EXE, "wb") as t:
                            t.write(s.read())
            self.log_signal.emit("dd.exe installed.")

    def run_diskpart_clean(self):
        self.log_signal.emit(f"Unlocking Disk {self.disk_number} (Removing partitions)...")
        script = f"select disk {self.disk_number}\nclean\nrescan\nexit"
        
        script_path = os.path.join(DD_DIR, "unlock.txt")
        with open(script_path, "w") as f:
            f.write(script)
            
        subprocess.run(f"diskpart /s {script_path}", stdout=subprocess.DEVNULL, shell=True)
        time.sleep(3) # Wait for Windows to release handles
        return True

    def run_dd_wipe(self):
        self.log_signal.emit("Starting DD Zero-Fill...")
        self.log_signal.emit("Depending on drive speed, this may take a while.")
        
        # Windows Path for raw disk
        target = f"\\\\.\\PhysicalDrive{self.disk_number}"
        
        cmd = [
            DD_EXE,
            "if=/dev/zero",
            f"of={target}",
            "bs=1M",
            "--progress"
        ]
        
        # Start DD process
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        
        process = subprocess.Popen(
            cmd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT, # DD outputs progress to stderr usually
            text=True,
            startupinfo=startupinfo
        )

        # Parse Output for Progress Bar
        while self.is_running:
            # Read line by line
            line = process.stdout.readline()
            
            # Check if process is dead
            if not line and process.poll() is not None:
                break
            
            if line:
                line = line.strip()
                
                # Check for progress data
                # DD Output format example: "123456789 bytes (123 MB) copied"
                match = re.search(r"(\d+) bytes", line)
                if match:
                    bytes_written = int(match.group(1))
                    if self.drive_size > 0:
                        percent = int((bytes_written / self.drive_size) * 100)
                        # Ensure we don't exceed 100 visually
                        percent = min(100, max(0, percent))
                        self.progress_signal.emit(percent)
                elif line:
                    # If line is not a progress update, it might be an error or status
                    # Log it so the user knows "Format is not making progress" is actually "DD is waiting/erroring"
                    self.log_signal.emit(f"DD: {line}")

        # Check return code
        if process.returncode != 0:
            self.log_signal.emit(f"DD exited with error code {process.returncode}")
            return True 
        
        self.progress_signal.emit(100)
        return True

    def stop(self):
        self.is_running = False

# --- 3. MAIN GUI WINDOW ---
class WiperWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BYTE-0")
        self.resize(600, 500)
        self.setStyleSheet("""
            QMainWindow { background-color: #2b2b2b; color: #ffffff; }
            QLabel { color: #dddddd; font-size: 14px; }
            QComboBox { padding: 5px; font-size: 14px; }
            QPushButton { 
                background-color: #d32f2f; 
                color: white; 
                font-weight: bold; 
                padding: 10px; 
                border-radius: 4px; 
            }
            QPushButton:hover { background-color: #b71c1c; }
            QPushButton:disabled { background-color: #555555; color: #aaaaaa; }
            QTextEdit { background-color: #1e1e1e; color: #00ff00; font-family: Consolas; }
            QProgressBar { text-align: center; font-weight: bold; }
        """)

        # Main Layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Title
        title = QLabel("BYTE-0")
        title.setStyleSheet("font-size: 20px; font-weight: bold; color: #ef5350;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        # Drive Selection
        layout.addWidget(QLabel("Select Target Drive:"))
        self.drive_combo = QComboBox()
        layout.addWidget(self.drive_combo)

        # Refresh Button
        self.btn_refresh = QPushButton("Refresh Drive List")
        self.btn_refresh.setStyleSheet("background-color: #1976d2;")
        self.btn_refresh.clicked.connect(self.scan_drives)
        layout.addWidget(self.btn_refresh)

        # Removed NTFS Format Option as requested
        
        # Wipe Button
        self.btn_wipe = QPushButton("DESTROY DATA (WRITE ZEROS)")
        self.btn_wipe.clicked.connect(self.confirm_wipe)
        layout.addWidget(self.btn_wipe)

        # Progress Bar
        self.progress = QProgressBar()
        self.progress.setRange(0, 100)
        self.progress.setValue(0)
        layout.addWidget(self.progress)

        # Log Window
        layout.addWidget(QLabel("Process Log:"))
        self.log_box = QTextEdit()
        self.log_box.setReadOnly(True)
        layout.addWidget(self.log_box)

        # Init
        self.scan_drives()
        self.worker = None

    def scan_drives(self):
        self.drive_combo.clear()
        self.log_message("Scanning physical drives via PowerShell...")
        
        # Use PowerShell to get clean object data
        cmd = 'powershell -Command "Get-Disk | Select-Object Number, FriendlyName, Size | Format-Table -HideTableHeaders"'
        try:
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            proc = subprocess.run(cmd, capture_output=True, text=True, shell=True, startupinfo=startupinfo)
            
            lines = proc.stdout.split('\n')
            count = 0
            for line in lines:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 2:
                        # Logic to extract Number and Size
                        # Better Parsing Strategy:
                        disk_num = parts[0]
                        size_str = parts[-1]
                        
                        if not disk_num.isdigit() or not size_str.isdigit():
                            continue

                        size_bytes = int(size_str)
                        size_gb = size_bytes / (1024**3)
                        
                        # reconstruct name
                        name = " ".join(parts[1:-1])

                        # Safety: Skip Disk 0
                        if disk_num == "0":
                            continue

                        display_text = f"Disk {disk_num}: {name} ({size_gb:.2f} GB)"
                        
                        # Store essential data in the combo box item
                        self.drive_combo.addItem(display_text, {"number": disk_num, "size": size_bytes})
                        count += 1
            
            if count == 0:
                self.log_message("No external drives found (Disk 0 hidden for safety).")
            else:
                self.log_message(f"Found {count} wipeable drives.")

        except Exception as e:
            self.log_message(f"Error scanning drives: {e}")

    def confirm_wipe(self):
        if self.drive_combo.count() == 0:
            return

        data = self.drive_combo.currentData()
        disk_num = data['number']
        name = self.drive_combo.currentText()

        # Double Safety Check
        if disk_num == "0":
            QMessageBox.critical(self, "Safety Stop", "You cannot wipe Disk 0 (System Drive).")
            return

        msg = QMessageBox()
        msg.setIcon(QMessageBox.Icon.Warning)
        msg.setWindowTitle("CONFIRM DESTRUCTION")
        msg.setText(f"Are you sure you want to wipe:\n\n{name}\n\nAll data will be overwritten with Zeros.\nThis cannot be undone.")
        msg.setStandardButtons(QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        
        if msg.exec() == QMessageBox.StandardButton.Yes:
            self.start_wipe(disk_num, data['size'])

    def start_wipe(self, disk_num, size):
        self.btn_wipe.setEnabled(False)
        self.btn_refresh.setEnabled(False)
        self.progress.setValue(0)
        self.log_box.clear()
        
        # Init Worker - No format option passed
        self.worker = WipeWorker(disk_num, size)
        self.worker.log_signal.connect(self.log_message)
        self.worker.progress_signal.connect(self.progress.setValue)
        self.worker.finished_signal.connect(self.wipe_finished)
        self.worker.start()

    def wipe_finished(self, success):
        self.btn_wipe.setEnabled(True)
        self.btn_refresh.setEnabled(True)
        if success:
            QMessageBox.information(self, "Success", "Drive wiped successfully (Zero-Fill).")
        else:
            QMessageBox.critical(self, "Failed", "The wipe process encountered an error.\nCheck logs.")

    def log_message(self, text):
        self.log_box.append(text)

# --- ENTRY POINT ---
if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # Optional: Set a fusion style for better look
    app.setStyle("Fusion")
    
    window = WiperWindow()
    window.show()
    sys.exit(app.exec())