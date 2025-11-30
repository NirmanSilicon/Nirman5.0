// frontend/static/js/main.js
let video = null;
let canvas = null;
let preview = null;
let startCameraBtn = null;
let autoCaptureBtn = null;
let captureBtn = null;
let stopCameraBtn = null;
let analyzeBtn = null;
let statusText = null;

let capturedImageData = null;
let streamRef = null;
let autoInterval = null;

window.addEventListener("DOMContentLoaded", () => {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  preview = document.getElementById("preview");
  startCameraBtn = document.getElementById("startCamera");
  autoCaptureBtn = document.getElementById("autoCapture");
  captureBtn = document.getElementById("capture");
  stopCameraBtn = document.getElementById("stopCamera");
  analyzeBtn = document.getElementById("analyzeBtn");
  statusText = document.getElementById("statusText");

  startCameraBtn.addEventListener("click", startCamera);
  stopCameraBtn.addEventListener("click", stopCamera);
  captureBtn.addEventListener("click", manualCapture);
  autoCaptureBtn.addEventListener("click", smartAutoCapture);
  analyzeBtn.addEventListener("click", analyzeTongue);
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef = stream;
    video.srcObject = stream;
    captureBtn.disabled = false;
    stopCameraBtn.disabled = false;
    autoCaptureBtn.disabled = false;
    statusText.textContent = "Camera started. Position your tongue in front of the camera.";
  } catch (err) {
    alert("Could not access camera: " + err.message);
    console.error(err);
  }
}

function stopCamera() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
  if (streamRef) {
    streamRef.getTracks().forEach(t => t.stop());
    streamRef = null;
    video.srcObject = null;
  }
  captureBtn.disabled = true;
  stopCameraBtn.disabled = true;
  autoCaptureBtn.disabled = true;
  statusText.textContent = "Camera stopped.";
}

function manualCapture() {
  if (!video.videoWidth || !video.videoHeight) {
    alert("Camera not ready yet, please wait a second.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  capturedImageData = canvas.toDataURL("image/png");
  preview.src = capturedImageData;
  preview.style.display = "block";
  statusText.textContent = "Manual capture done. You can now analyze.";
}

function smartAutoCapture() {
  if (!video.videoWidth || !video.videoHeight) {
    statusText.textContent = "Waiting for camera to be ready...";
    return;
  }
  if (autoInterval) {
    clearInterval(autoInterval);
  }
  statusText.textContent = "Smart capture started. Align your tongue; we will auto-capture when it's clear.";

  autoInterval = setInterval(async () => {
    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frameData = canvas.toDataURL("image/jpeg", 0.6);

    try {
      const res = await fetch("/auto_tongue_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_data: frameData })
      });

      const data = await res.json();
      if (res.status !== 200) {
        statusText.textContent = data.message || "Error in auto tongue check.";
        return;
      }

      statusText.textContent =
        data.message +
        ` (tongue ratio: ${data.tongue_ratio.toFixed(2)}, sharpness: ${data.sharpness.toFixed(1)})`;

      if (data.ok) {
        capturedImageData = frameData;
        preview.src = frameData;
        preview.style.display = "block";

        clearInterval(autoInterval);
        autoInterval = null;
        statusText.textContent = "Best frame captured automatically. You can now analyze.";
      }
    } catch (err) {
      console.error(err);
      statusText.textContent = "Error during smart capture: " + err.message;
    }
  }, 800);
}

async function analyzeTongue() {
  if (!capturedImageData) {
    alert("Please capture a tongue photo first (manual or smart).");
    return;
  }

  const diseaseKey = document.getElementById("diseaseKey").value;
  const symptoms = document.getElementById("symptoms").value;

  const payload = {
    image_data: capturedImageData,
    disease_key: diseaseKey,
    symptoms: symptoms
  };

  try {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    const res = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Dosha & Get Remedies";

    if (data.error) {
      alert(data.error);
      return;
    }

    const box = document.getElementById("result");
    box.style.display = "block";

    const probs = data.ml_probs;
    let probsHtml = "";
    if (probs) {
      probsHtml =
        '<h3>CNN Dosha Probabilities</h3><ul class="result-list">' +
        Object.keys(probs)
          .map(
            k => `<li>${k.toUpperCase()}: ${(probs[k] * 100).toFixed(1)}%</li>`
          )
          .join("") +
        "</ul>";
    }

    box.innerHTML = `
      <h2>3. Ayurvedic Analysis Result</h2>
      <p><strong>Final Dosha:</strong> ${data.dosha ? data.dosha.toUpperCase() : "N/A"}</p>
      <p><strong>Rule-based Dosha:</strong> ${data.rule_dosha ? data.rule_dosha.toUpperCase() : "N/A"}</p>
      ${probsHtml}
      <p><strong>Tongue Color (CV):</strong> ${data.tongue_color}</p>
      <p><strong>Coating (CV):</strong> ${data.coating} (${data.white_percent.toFixed(1)}% white area)</p>
      <p><strong>Texture (CV):</strong> ${data.texture}</p>
      <p>${data.message || ""}</p>

      <h3>Suggested Remedies</h3>
      <ul class="result-list">
        ${(data.remedies || []).map(r => `<li>${r}</li>`).join("") || "<li>No remedies configured yet.</li>"}
      </ul>

      <h3>Diet Suggestions</h3>
      <ul class="result-list">
        ${(data.diet || []).map(r => `<li>${r}</li>`).join("") || "<li>No diet suggestions available.</li>"}
      </ul>

      <h3>Lifestyle Suggestions</h3>
      <ul class="result-list">
        ${(data.lifestyle || []).map(r => `<li>${r}</li>`).join("") || "<li>No lifestyle suggestions available.</li>"}
      </ul>

      <p class="meta">${data.note || ""}</p>
    `;
  } catch (err) {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Dosha & Get Remedies";
    alert("Error contacting backend: " + err.message);
    console.error(err);
  }
}
