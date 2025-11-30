var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// app.ts
// ===== VIEW SWITCHING =====
const views = document.querySelectorAll(".view");
function showView(id) {
    views.forEach((v) => v.classList.remove("active"));
    const target = document.getElementById(id);
    if (target)
        target.classList.add("active");
}
document.querySelectorAll("[data-view-target]").forEach((el) => {
    el.addEventListener("click", () => {
        const target = el.getAttribute("data-view-target");
        if (target) {
            showView(target);
        }
    });
});
// ===== SIMPLE IN-MEMORY STATE =====
let issues = []; // shared between citizen & gov dashboards
let citizenName = "Citizen";
// ===== LOGIN SIMULATION =====
const citizenLoginForm = document.getElementById("citizenLoginForm");
const govLoginForm = document.getElementById("govLoginForm");
const citizenNameBadge = document.getElementById("citizenNameBadge");
const citizenLogoutBtn = document.getElementById("citizenLogoutBtn");
const govLogoutBtn = document.getElementById("govLogoutBtn");
citizenLoginForm === null || citizenLoginForm === void 0 ? void 0 : citizenLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = citizenLoginForm.querySelector('input[type="email"]');
    if (!emailInput)
        return;
    const email = emailInput.value;
    citizenName = email.split("@")[0] || "Citizen";
    if (citizenNameBadge) {
        citizenNameBadge.textContent = citizenName;
    }
    showView("citizenDashboardView");
    updateDashboards();
});
govLoginForm === null || govLoginForm === void 0 ? void 0 : govLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showView("govDashboardView");
    updateDashboards();
});
citizenLogoutBtn === null || citizenLogoutBtn === void 0 ? void 0 : citizenLogoutBtn.addEventListener("click", () => {
    showView("landingView");
});
govLogoutBtn === null || govLogoutBtn === void 0 ? void 0 : govLogoutBtn.addEventListener("click", () => {
    showView("landingView");
});
// ===== LEAFLET MAP + GEOLOCATION =====
let map = null;
let marker = null;
const locationText = document.getElementById("locationText");
const useLocationBtn = document.getElementById("useLocationBtn");
const coordsLabel = document.getElementById("coordsLabel");
function initMap() {
    if (map)
        return;
    const defaultLat = 19.076;
    const defaultLng = 72.8777;
    map = L.map("map").setView([defaultLat, defaultLng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
        const pos = marker.getLatLng();
        updateCoordsLabel(pos.lat, pos.lng);
    });
}
function updateCoordsLabel(lat, lng) {
    if (!coordsLabel)
        return;
    coordsLabel.textContent = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    coordsLabel.dataset.lat = String(lat);
    coordsLabel.dataset.lng = String(lng);
    if (locationText && !locationText.value) {
        locationText.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}
function useLiveLocation(showAlert = true) {
    if (!navigator.geolocation) {
        if (showAlert) {
            alert("Geolocation is not supported by this browser.");
        }
        return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        if (!map)
            initMap();
        if (!map || !marker)
            return;
        map.setView([latitude, longitude], 16);
        marker.setLatLng([latitude, longitude]);
        updateCoordsLabel(latitude, longitude);
    }, (err) => {
        console.error(err);
        if (showAlert) {
            alert("Unable to fetch live location. Please enable location permission or enter manually.");
        }
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}
useLocationBtn === null || useLocationBtn === void 0 ? void 0 : useLocationBtn.addEventListener("click", () => useLiveLocation(true));
// Initialize map when citizen dashboard is first shown
const citizenDashboardView = document.getElementById("citizenDashboardView");
if (citizenDashboardView) {
    const observer = new MutationObserver(() => {
        if (citizenDashboardView.classList.contains("active")) {
            initMap();
            setTimeout(() => {
                if (map)
                    map.invalidateSize();
            }, 200);
            observer.disconnect();
        }
    });
    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
    });
}
// ===== ATTACHMENTS PREVIEW =====
const attachmentInput = document.getElementById("attachmentInput");
const attachmentPreview = document.getElementById("attachmentPreview");
attachmentInput === null || attachmentInput === void 0 ? void 0 : attachmentInput.addEventListener("change", () => {
    if (!attachmentPreview || !attachmentInput.files)
        return;
    attachmentPreview.innerHTML = "";
    const files = Array.from(attachmentInput.files);
    files.forEach((file) => {
        const pill = document.createElement("div");
        pill.className = "attachment-pill";
        pill.textContent = file.name;
        attachmentPreview.appendChild(pill);
    });
});
// ===== ISSUE FORM & LIST =====
const issueForm = document.getElementById("issueForm");
const issueFormStatus = document.getElementById("issueFormStatus");
const citizenIssuesList = document.getElementById("citizenIssuesList");
const citizenIssuesEmpty = document.getElementById("citizenIssuesEmpty");
function statusToProgress(status) {
    switch (status) {
        case "Submitted":
            return 15;
        case "Under Review":
            return 40;
        case "In Progress":
            return 70;
        case "Resolved":
            return 100;
        default:
            return 0;
    }
}
// 🔥 UPDATED: submit handler now calls backend API and then updates local UI
issueForm === null || issueForm === void 0 ? void 0 : issueForm.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c;
    e.preventDefault();
    if (!issueForm)
        return;
    const formData = new FormData(issueForm);
    const title = String((_a = formData.get("title")) !== null && _a !== void 0 ? _a : "");
    const category = String((_b = formData.get("category")) !== null && _b !== void 0 ? _b : "");
    const description = String((_c = formData.get("description")) !== null && _c !== void 0 ? _c : "");
    const latStr = coordsLabel === null || coordsLabel === void 0 ? void 0 : coordsLabel.dataset.lat;
    const lngStr = coordsLabel === null || coordsLabel === void 0 ? void 0 : coordsLabel.dataset.lng;
    const lat = latStr ? parseFloat(latStr) : 0;
    const lng = lngStr ? parseFloat(lngStr) : 0;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const newIssue = {
        id: issues.length + 1,
        citizen: citizenName,
        title,
        category,
        description,
        date: dateStr,
        status: "Submitted",
        lat,
        lng,
    };
    // 👉 Send to backend (Supabase via your Node API)
    try {
        const res = yield fetch("http://localhost:5000/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // later when auth ready: Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                category,
                description,
                lat,
                lng,
                imageUrl: null,
            }),
        });
        const data = yield res.json();
        if (!res.ok || !data.success) {
            console.error("Backend error:", data);
            if (issueFormStatus) {
                issueFormStatus.textContent =
                    data.message || "Failed to submit issue to server.";
                issueFormStatus.className = "form-status error";
            }
            return;
        }
    }
    catch (err) {
        console.error("Network error:", err);
        if (issueFormStatus) {
            issueFormStatus.textContent =
                "Network error while submitting issue to server.";
            issueFormStatus.className = "form-status error";
        }
        return;
    }
    // 👉 If backend succeeded, update local UI
    issues.unshift(newIssue);
    issueForm.reset();
    if (attachmentInput)
        attachmentInput.value = "";
    if (attachmentPreview)
        attachmentPreview.innerHTML = "";
    if (coordsLabel) {
        coordsLabel.textContent = "Coordinates: not set";
        delete coordsLabel.dataset.lat;
        delete coordsLabel.dataset.lng;
    }
    if (locationText)
        locationText.value = "";
    if (issueFormStatus) {
        issueFormStatus.textContent = "Issue submitted successfully.";
        issueFormStatus.className = "form-status success";
    }
    updateDashboards();
}));
// Render citizen issues
function renderCitizenIssues() {
    if (!citizenIssuesList || !citizenIssuesEmpty)
        return;
    const myIssues = issues.filter((iss) => iss.citizen === citizenName);
    if (myIssues.length === 0) {
        citizenIssuesEmpty.style.display = "block";
        citizenIssuesList.innerHTML = "";
        return;
    }
    citizenIssuesEmpty.style.display = "none";
    citizenIssuesList.innerHTML = "";
    myIssues.forEach((issue) => {
        const card = document.createElement("div");
        card.className = "issue-card";
        const header = document.createElement("div");
        header.className = "issue-header";
        header.innerHTML = `
        <div class="issue-title">${issue.title}</div>
        <span class="status-label">${issue.status}</span>
      `;
        const meta = document.createElement("div");
        meta.className = "issue-meta";
        const locIcon = issue.lat ? "📍" : "";
        meta.innerHTML = `
        <span>${issue.category}</span>
        <span>${issue.date}</span>
        <span>${locIcon}</span>
      `;
        const statusBar = document.createElement("div");
        statusBar.className = "status-bar";
        const inner = document.createElement("div");
        inner.className = "status-bar-inner";
        inner.style.width = `${statusToProgress(issue.status)}%`;
        statusBar.appendChild(inner);
        const statusText = document.createElement("div");
        statusText.className = "status-label";
        statusText.textContent = `Progress: ${statusToProgress(issue.status)}% – ${issue.status}`;
        card.appendChild(header);
        card.appendChild(meta);
        card.appendChild(statusBar);
        card.appendChild(statusText);
        citizenIssuesList.appendChild(card);
    });
}
// ===== GOVERNMENT TABLE =====
const govIssuesTableBody = document.getElementById("govIssuesTableBody");
const govIssuesEmpty = document.getElementById("govIssuesEmpty");
const filterStatus = document.getElementById("filterStatus");
// KPIs
const kpiTotalIssues = document.getElementById("kpiTotalIssues");
const kpiOpenIssues = document.getElementById("kpiOpenIssues");
const kpiInProgressIssues = document.getElementById("kpiInProgressIssues");
const kpiResolvedIssues = document.getElementById("kpiResolvedIssues");
// Landing stats
const statActiveIssues = document.getElementById("statActiveIssues");
const statResolvedIssues = document.getElementById("statResolvedIssues");
const statAvgProgress = document.getElementById("statAvgProgress");
function renderGovIssues() {
    if (!govIssuesTableBody || !govIssuesEmpty || !filterStatus)
        return;
    const statusFilter = filterStatus.value;
    const filtered = statusFilter === "All"
        ? issues
        : issues.filter((i) => i.status === statusFilter);
    govIssuesTableBody.innerHTML = "";
    if (filtered.length === 0) {
        govIssuesEmpty.style.display = "block";
        return;
    }
    govIssuesEmpty.style.display = "none";
    filtered.forEach((issue) => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        tdId.textContent = String(issue.id);
        const tdTitle = document.createElement("td");
        tdTitle.textContent = issue.title;
        const tdCitizen = document.createElement("td");
        tdCitizen.textContent = issue.citizen;
        const tdCat = document.createElement("td");
        tdCat.textContent = issue.category;
        const tdDate = document.createElement("td");
        tdDate.textContent = issue.date;
        const tdStatus = document.createElement("td");
        const pill = document.createElement("span");
        pill.className =
            "status-pill status-" + issue.status.replace(" ", "");
        pill.textContent = issue.status;
        tdStatus.appendChild(pill);
        const tdUpdate = document.createElement("td");
        const select = document.createElement("select");
        const statuses = [
            "Submitted",
            "Under Review",
            "In Progress",
            "Resolved",
        ];
        statuses.forEach((st) => {
            const opt = document.createElement("option");
            opt.value = st;
            opt.textContent = st;
            if (st === issue.status)
                opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener("change", () => {
            issue.status = select.value;
            updateDashboards();
        });
        tdUpdate.appendChild(select);
        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdCitizen);
        tr.appendChild(tdCat);
        tr.appendChild(tdDate);
        tr.appendChild(tdStatus);
        tr.appendChild(tdUpdate);
        govIssuesTableBody.appendChild(tr);
    });
}
filterStatus === null || filterStatus === void 0 ? void 0 : filterStatus.addEventListener("change", renderGovIssues);
// ===== STATS / KPIS =====
function updateKPIsAndHeroStats() {
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === "Resolved").length;
    const inProgress = issues.filter((i) => i.status === "In Progress").length;
    const open = issues.filter((i) => i.status === "Submitted" || i.status === "Under Review").length;
    if (kpiTotalIssues)
        kpiTotalIssues.textContent = String(total);
    if (kpiOpenIssues)
        kpiOpenIssues.textContent = String(open);
    if (kpiInProgressIssues)
        kpiInProgressIssues.textContent = String(inProgress);
    if (kpiResolvedIssues)
        kpiResolvedIssues.textContent = String(resolved);
    if (statActiveIssues)
        statActiveIssues.textContent = String(open + inProgress);
    if (statResolvedIssues)
        statResolvedIssues.textContent = String(resolved);
    const avgProgress = issues.length === 0
        ? 0
        : Math.round(issues.reduce((sum, i) => sum + statusToProgress(i.status), 0) / issues.length);
    if (statAvgProgress)
        statAvgProgress.textContent = `${avgProgress}%`;
}
// ===== UPDATE ALL UI =====
function updateDashboards() {
    renderCitizenIssues();
    renderGovIssues();
    updateKPIsAndHeroStats();
}
// ===== CHATBOT (FRONTEND SIMULATION) =====
const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatWindow = document.querySelector(".chat-window");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
chatToggleBtn === null || chatToggleBtn === void 0 ? void 0 : chatToggleBtn.addEventListener("click", () => {
    if (!chatWindow)
        return;
    chatWindow.classList.toggle("hidden");
});
chatCloseBtn === null || chatCloseBtn === void 0 ? void 0 : chatCloseBtn.addEventListener("click", () => {
    if (!chatWindow)
        return;
    chatWindow.classList.add("hidden");
});
function addChatMessage(text, sender = "bot") {
    if (!chatMessages)
        return;
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// Very simple rule-based "AI" placeholder
function getBotReply(userText) {
    const text = userText.toLowerCase();
    if (text.includes("report")) {
        return "To report an issue, log in as a citizen, go to your dashboard, fill the form with title, category, description and allow location.";
    }
    if (text.includes("status")) {
        return "Each issue has a status bar: Submitted → Under Review → In Progress → Resolved. You can see this in your citizen dashboard.";
    }
    if (text.includes("location")) {
        return "When you click 'Use live location', we use your GPS to place a pin on the map. You can drag it to the exact spot.";
    }
    if (text.includes("gov") || text.includes("government")) {
        return "Government officers can log in through the Government Login and use the admin dashboard to update issue statuses.";
    }
    return "I can help with reporting issues, tracking status, or explaining the dashboards. Try asking: “How do I report an issue?”";
}
chatForm === null || chatForm === void 0 ? void 0 : chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatInput)
        return;
    const text = chatInput.value.trim();
    if (!text)
        return;
    addChatMessage(text, "user");
    chatInput.value = "";
    setTimeout(() => {
        const reply = getBotReply(text);
        addChatMessage(reply, "bot");
    }, 400);
});
// Initialize hero stats
updateKPIsAndHeroStats();
