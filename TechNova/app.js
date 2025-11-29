// ================== Firebase setup ==================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAApLXXYd4snh426cTduHFWIP62yGXZTK0",
  authDomain: "smart-air-quality-monito-15bdb.firebaseapp.com",
  projectId: "smart-air-quality-monito-15bdb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== Theme toggle ==================
const themeToggleBtn = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  document.body.className = theme === "dark" ? "theme-dark" : "theme-light";
  themeToggleBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

setTheme("light");

themeToggleBtn.addEventListener("click", () => {
  const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

// ================== Sidebar navigation ==================
document.querySelectorAll("#sensorNav .nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll("#sensorNav .nav-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.getAttribute("data-target");
    document.querySelectorAll(".section").forEach((s) => s.classList.add("d-none"));
    document.getElementById(target).classList.remove("d-none");
  });
});

// ================== Helpers ==================
function aqiClass(aqi) {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  return "unhealthy";
}

function toJsDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (typeof ts === "string") return new Date(ts);
  if (typeof ts === "number") return new Date(ts);
  return null;
}

function findLatestWith(rows, field) {
  for (let i = rows.length - 1; i >= 0; i--) {
    const v = rows[i][field];
    if (v !== null && v !== undefined && v !== "") return rows[i];
  }
  return null;
}

function lastNonNull(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== null && arr[i] !== undefined) return arr[i];
  }
  return null;
}

// ================== Time-series charts ==================
function createLineChart(canvasId, label, color, yMin = null, yMax = null) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label,
          data: [],
          borderColor: color,
          backgroundColor: "transparent",
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 8,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          grid: { display: false },
        },
        y: {
          beginAtZero: yMin === 0,
          min: yMin ?? undefined,
          max: yMax ?? undefined,
          grace: "5%",
          grid: { color: "rgba(100,100,100,0.15)" },
        },
      },
    },
  });
}

function updateChart(chart, data, labels) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// NOTE: yMax = null → auto max with padding (fixes CO AQI stuck at top)
const charts = {
  // Main AQI
  aqi:    createLineChart("aqiChart",    "AQI",             "#ef4444", 0, null),

  // Sensor values
  temp:   createLineChart("tempChart",   "Temperature (°C)", "#3b82f6", 0, 50),
  humidity: createLineChart("humidityChart", "Humidity (%)", "#06b6d4", 0, 100),
  co2:    createLineChart("co2Chart",    "CO₂ (ppm)",        "#22c55e", 0, 2000),

  // CO (Carbon Monoxide)
  co:     createLineChart("coChart",     "CO (ppm)",         "#06b6d4", 0, 1000),

  no2:    createLineChart("no2Chart",    "NO₂ (ppm)",        "#eab308", 0, 2),
  pm:     createLineChart("pmChart",     "PM2.5 (µg/m³)",    "#9333ea", 0, 500),

  // AQI sub-indices (auto Y max so 500 is visible with margin)
  aqiPm:  createLineChart("aqiPmChart",  "AQI (PM2.5)",      "#9333ea", 0, null),
  aqiCo:  createLineChart("aqiCoChart",  "AQI (CO)",         "#06b6d4", 0, null),
  aqiNo2: createLineChart("aqiNo2Chart", "AQI (NO₂)",        "#f97316", 0, null),
};

// ================== Circular gauges (Chart.js doughnut) ==================
const gauges = {
  aqi: null,
  co2: null,
  no2: null,
  co: null, // CO gauge
};

function gaugeColorForAQI(value, max) {
  if (value == null) return "#6b7280";
  if (value <= 50) return "#22c55e";
  if (value <= 100) return "#eab308";
  if (value <= 200) return "#f97316";
  return "#ef4444";
}

function createGaugeChart(canvasId, max, label) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [label],
      datasets: [
        {
          data: [0, max], // value, remaining
          backgroundColor: [
            "#22c55e", // will be recolored for AQI dynamically
            "rgba(148, 163, 184, 0.35)",
          ],
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      rotation: -0.5 * Math.PI, // start at 12 o'clock
      circumference: 2 * Math.PI, // full circle
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  });
}

function updateGaugeChart(chart, value, max, forAQI = false) {
  if (!chart) return;
  const v = typeof value === "number" ? Math.max(0, Math.min(value, max)) : 0;
  chart.data.datasets[0].data[0] = v;
  chart.data.datasets[0].data[1] = Math.max(0, max - v);
  if (forAQI) {
    chart.data.datasets[0].backgroundColor[0] = gaugeColorForAQI(v, max);
  }
  chart.update();
}

// create the gauges
gauges.aqi = createGaugeChart("aqiGauge", 300, "AQI");
gauges.co2 = createGaugeChart("co2Gauge", 1500, "CO₂");
gauges.no2 = createGaugeChart("no2Gauge", 2, "NO₂");
gauges.co   = createGaugeChart("coGauge", 1000, "CO"); // CO gauge

// ================== DOM references ==================
const lastUpdateEl   = document.getElementById("lastUpdate");
const aqiBadge       = document.getElementById("aqiBadge");
const co2Badge       = document.getElementById("co2Badge");
const coBadge        = document.getElementById("coBadge");
const no2Badge       = document.getElementById("no2Badge");
const aqiPmBadge     = document.getElementById("aqiPmBadge");
const aqiCoBadge     = document.getElementById("aqiCoBadge");
const aqiNo2Badge    = document.getElementById("aqiNo2Badge");
const dominantEl     = document.getElementById("dominantPollutant");

const tempCurrentEl     = document.getElementById("tempCurrent");
const humidityCurrentEl = document.getElementById("humidityCurrent");
const pmCurrentEl       = document.getElementById("pmCurrent");

// ================== View mode toggle (Last 1 hour / Total) ==================
// We'll inject a small toggle control next to #lastUpdate so you don't need to change HTML
let viewMode = localStorage.getItem("viewMode") || "1h"; // '1h' or 'total'

function createViewToggle() {
  const span = document.createElement("span");
  span.style.marginLeft = "10px";
  span.style.display = "inline-flex";
  span.style.gap = "6px";
  span.style.alignItems = "center";

  const label = document.createElement("small");
  label.textContent = "View:";
  label.style.color = "inherit";
  label.style.opacity = "0.75";
  span.appendChild(label);

  const btn1 = document.createElement("button");
  btn1.className = "btn btn-sm btn-outline-primary";
  btn1.textContent = "Last 1h";
  btn1.dataset.mode = "1h";

  const btn2 = document.createElement("button");
  btn2.className = "btn btn-sm btn-outline-secondary";
  btn2.textContent = "Total";
  btn2.dataset.mode = "total";

  span.appendChild(btn1);
  span.appendChild(btn2);

  // click handlers
  function setButtons(m) {
    btn1.className = m === "1h" ? "btn btn-sm btn-primary" : "btn btn-sm btn-outline-primary";
    btn2.className = m === "total" ? "btn btn-sm btn-primary" : "btn btn-sm btn-outline-secondary";
  }
  setButtons(viewMode);

  span.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const m = b.dataset.mode;
    if (!m) return;
    viewMode = m;
    localStorage.setItem("viewMode", viewMode);
    setButtons(viewMode);
    // trigger a UI refresh by manually calling snapshot handler's last known rows if needed
    // We'll rely on onSnapshot to update charts when data arrives; otherwise user can toggle and data will redraw on next snapshot
  });

  // attach after lastUpdateEl
  if (lastUpdateEl && lastUpdateEl.parentNode) {
    lastUpdateEl.parentNode.appendChild(span);
  }
}
createViewToggle();

// ================== Firestore subscription ==================
// fetch a buffer of documents, then pick the subset to show depending on viewMode
const q = query(
  collection(db, "sensorData"),
  orderBy("timestamp", "desc"),
  limit(240)         // larger buffer for 'total' view (you can increase or decrease)
);

onSnapshot(
  q,
  (snapshot) => {
    // collect raw rows (newest->oldest), then reverse to oldest->newest
    const rawRows = [];
    snapshot.forEach((doc) => {
      rawRows.push(doc.data());
    });
    rawRows.reverse();

    // if viewMode === '1h' -> filter to last hour; otherwise use full rawRows
    const now = Date.now();
    const cutoff = now - 60 * 60 * 1000; // 1 hour
    let rowsToShow;
    if (viewMode === "1h") {
      rowsToShow = rawRows.filter((r) => {
        const t = toJsDate(r.timestamp);
        return t && t.getTime() >= cutoff;
      });
      if (rowsToShow.length === 0) {
        // fallback to last N points if no data in last hour
        rowsToShow = rawRows.slice(-24);
      }
    } else {
      // 'total' view — show all fetched rows (rawRows)
      rowsToShow = rawRows.slice(); // shallow copy
    }

    // create labels (time) for the chosen rows
    const labels = rowsToShow.map((r) => {
      const t = toJsDate(r.timestamp);
      return t ? t.toLocaleString([], { hour: "2-digit", minute: "2-digit" }) : "";
    });

    // coerce arrays from rowsToShow
    const tempArr   = rowsToShow.map((r) => (r.temperature == null ? null : Number(r.temperature)));
    const humArr    = rowsToShow.map((r) => (r.humidity == null ? null : Number(r.humidity)));
    const aqiArr    = rowsToShow.map((r) => (r.aqi == null ? null : Number(r.aqi)));
    const co2Arr    = rowsToShow.map((r) => {
      const v = r.co2_ppm ?? r.co2 ?? r.CO2 ?? null;
      return v == null ? null : Number(v);
    });
    const coArr     = rowsToShow.map((r) => {
      const v = r.co_ppm ?? r.co ?? r.CO_ppm ?? null;
      return v == null ? null : Number(v);
    });
    const pmArr     = rowsToShow.map((r) => (r.pm25 == null ? null : Number(r.pm25)));
    const no2Arr    = rowsToShow.map((r) => {
      const v = r.no2_ppm ?? r.no2 ?? null;
      return v == null ? null : Number(v);
    });
    const aqiPmArr  = rowsToShow.map((r) => (r.aqi_pm25 == null ? null : Number(r.aqi_pm25)));
    const aqiCoArr  = rowsToShow.map((r) => (r.aqi_co == null ? null : Number(r.aqi_co)));
    const aqiNo2Arr = rowsToShow.map((r) => (r.aqi_no2 == null ? null : Number(r.aqi_no2)));

    // update charts (they will adapt to number of points)
    updateChart(charts.aqi,    aqiArr,    labels);
    updateChart(charts.temp,   tempArr,   labels);
    updateChart(charts.humidity, humArr,  labels);
    updateChart(charts.co2,    co2Arr,    labels);
    updateChart(charts.co,     coArr,     labels);
    updateChart(charts.pm,     pmArr,     labels);
    updateChart(charts.no2,    no2Arr,    labels);
    updateChart(charts.aqiPm,  aqiPmArr,  labels);
    updateChart(charts.aqiCo,  aqiCoArr,  labels);
    updateChart(charts.aqiNo2, aqiNo2Arr, labels);

    // current values (last non-null in the rowsToShow)
    const latestTemp = lastNonNull(tempArr);
    if (tempCurrentEl) {
      tempCurrentEl.textContent =
        latestTemp != null ? `${latestTemp.toFixed(1)} °C` : "—";
    }

    const latestHum = lastNonNull(humArr);
    if (humidityCurrentEl) {
      humidityCurrentEl.textContent =
        latestHum != null ? `${latestHum.toFixed(1)} %` : "—";
    }

    const latestPm = lastNonNull(pmArr);
    if (pmCurrentEl) {
      pmCurrentEl.textContent =
        latestPm != null ? `${latestPm.toFixed(1)} µg/m³` : "—";
    }

    // newest timestamp among rowsToShow
    const newest = rowsToShow[rowsToShow.length - 1] || {};
    const newestTime = toJsDate(newest.timestamp);
    if (newestTime) {
      lastUpdateEl.textContent = `Last update: ${newestTime.toLocaleString()}`;
    } else {
      lastUpdateEl.textContent = `Last update: —`;
    }

    // find latest docs for each metric (within rowsToShow)
    const docAqi   = findLatestWith(rowsToShow, "aqi");
    const docCo2   = findLatestWith(rowsToShow, "co2_ppm") || findLatestWith(rowsToShow, "co2") || findLatestWith(rowsToShow, "CO2");
    const docCo    = findLatestWith(rowsToShow, "co_ppm") || findLatestWith(rowsToShow, "co") || findLatestWith(rowsToShow, "CO_ppm");
    const docNo2   = findLatestWith(rowsToShow, "no2_ppm") || findLatestWith(rowsToShow, "no2");
    const docAqiPm = findLatestWith(rowsToShow, "aqi_pm25");
    const docAqiCo = findLatestWith(rowsToShow, "aqi_co");
    const docAqiNo2 = findLatestWith(rowsToShow, "aqi_no2");

    // update gauges & badges (AQI, CO2, CO, NO2) - same logic as before
    if (docAqi && typeof docAqi.aqi === "number") {
      updateGaugeChart(gauges.aqi, docAqi.aqi, 300, true);
      aqiBadge.textContent = `AQI: ${docAqi.aqi}`;
      aqiBadge.className = `badge ${aqiClass(docAqi.aqi)}`;
    } else {
      updateGaugeChart(gauges.aqi, 0, 300, true);
      aqiBadge.textContent = "AQI: —";
      aqiBadge.className = "badge";
    }

    // CO₂
    (function updateCO2Block() {
      let v = null;
      if (docCo2) {
        v = Number(docCo2.co2_ppm ?? docCo2.co2 ?? docCo2.CO2 ?? NaN);
        if (isNaN(v)) v = null;
      }
      if (v !== null) {
        updateGaugeChart(gauges.co2, v, 1500);
        co2Badge.textContent = `CO₂: ${v} ppm`;
        co2Badge.className =
          v <= 800
            ? "badge good"
            : v <= 1200
            ? "badge moderate"
            : "badge unhealthy";
      } else {
        updateGaugeChart(gauges.co2, 0, 1500);
        co2Badge.textContent = "CO₂: —";
        co2Badge.className = "badge";
      }
    })();

    // CO
    (function updateCOBlock() {
      let v = null;
      if (docCo) {
        v = Number(docCo.co_ppm ?? docCo.co ?? docCo.CO_ppm ?? NaN);
        if (isNaN(v)) v = null;
      }
      if (v !== null) {
        updateGaugeChart(gauges.co, v, 1000);
        coBadge.textContent = `CO: ${v.toFixed(2)} ppm`;
        if (v <= 9) coBadge.className = "badge good";
        else if (v <= 35) coBadge.className = "badge moderate";
        else coBadge.className = "badge unhealthy";
      } else {
        updateGaugeChart(gauges.co, 0, 1000);
        coBadge.textContent = "CO: —";
        coBadge.className = "badge";
      }
    })();

    // NO2
    (function updateNo2Block() {
      let v = null;
      if (docNo2) {
        v = Number(docNo2.no2_ppm ?? docNo2.no2 ?? NaN);
        if (isNaN(v)) v = null;
      }
      if (v !== null) {
        updateGaugeChart(gauges.no2, v, 2);
        no2Badge.textContent = `NO₂: ${v.toFixed(4)} ppm`;
        const no2_ppb = v * 1000;
        no2Badge.className =
          no2_ppb <= 53
            ? "badge good"
            : no2_ppb <= 100
            ? "badge moderate"
            : "badge unhealthy";
      } else {
        updateGaugeChart(gauges.no2, 0, 2);
        no2Badge.textContent = "NO₂: —";
        no2Badge.className = "badge";
      }
    })();

    // AQI sub-indices badges
    if (docAqiPm && typeof docAqiPm.aqi_pm25 === "number") {
      aqiPmBadge.textContent = `PM2.5 AQI: ${docAqiPm.aqi_pm25}`;
      aqiPmBadge.className = `badge ${aqiClass(docAqiPm.aqi_pm25)}`;
    } else {
      aqiPmBadge.textContent = "PM2.5 AQI: —";
      aqiPmBadge.className = "badge";
    }

    if (docAqiCo && typeof docAqiCo.aqi_co === "number") {
      aqiCoBadge.textContent = `CO AQI: ${docAqiCo.aqi_co}`;
      aqiCoBadge.className = `badge ${aqiClass(docAqiCo.aqi_co)}`;
    } else {
      aqiCoBadge.textContent = "CO AQI: —";
      aqiCoBadge.className = "badge";
    }

    if (docAqiNo2 && typeof docAqiNo2.aqi_no2 === "number") {
      aqiNo2Badge.textContent = `NO₂ AQI: ${docAqiNo2.aqi_no2}`;
      aqiNo2Badge.className = `badge ${aqiClass(docAqiNo2.aqi_no2)}`;
    } else {
      aqiNo2Badge.textContent = "NO₂ AQI: —";
      aqiNo2Badge.className = "badge";
    }

    // dominant pollutant
    if (dominantEl) {
      const dom = {
        pm:  docAqiPm  ? docAqiPm.aqi_pm25  : -1,
        co:  docAqiCo  ? docAqiCo.aqi_co    : -1,
        no2: docAqiNo2 ? docAqiNo2.aqi_no2 : -1,
      };
      let label = "—";
      let value = -1;
      if (dom.pm  >= value) { value = dom.pm;  label = "PM2.5"; }
      if (dom.co  >= value) { value = dom.co;  label = "CO"; }
      if (dom.no2 >= value) { value = dom.no2; label = "NO₂"; }

      if (value >= 0) {
        dominantEl.textContent = `Dominant pollutant: ${label} (AQI ${value})`;
      } else {
        dominantEl.textContent = "Dominant pollutant: —";
      }
    }
  },
  (error) => {
    console.error("Firestore onSnapshot error:", error);
    lastUpdateEl.textContent = "Last update: error (see console)";
  }
);
