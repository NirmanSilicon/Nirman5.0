/**
 * SafeBrowse Popup Script
 * Handles popup UI interactions and communicates with background script
 */

// DOM Elements
const contentLoading = document.getElementById('content-loading');
const contentResults = document.getElementById('content-results');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const scoreBadge = document.getElementById('score-badge');
const urlDisplay = document.getElementById('url-display');
const mlScore = document.getElementById('ml-score');
const heuristicScore = document.getElementById('heuristic-score');
const reputationScore = document.getElementById('reputation-score');
const btnRescan = document.getElementById('btn-rescan');
const btnReport = document.getElementById('btn-report');
const reportModal = document.getElementById('report-modal');
const reportReason = document.getElementById('report-reason');
const btnCancelReport = document.getElementById('btn-cancel-report');
const btnSubmitReport = document.getElementById('btn-submit-report');
const toast = document.getElementById('toast');

let currentTabId = null;
let currentUrl = null;

/**
 * Get score severity class
 */
function getScoreSeverity(score) {
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

/**
 * Update UI with analysis results
 */
function updateUI(result) {
  contentLoading.style.display = 'none';
  contentResults.style.display = 'block';

  // Update status
  const status = result.status || 'pending';
  statusDot.className = `status-dot ${status}`;
  statusText.className = `status-text ${status}`;
  statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);

  // Update score
  const score = result.combinedScore || 0;
  scoreBadge.textContent = `Score: ${score}`;

  // Update URL
  urlDisplay.textContent = result.url || 'Unknown';
  currentUrl = result.url;

  // Update breakdown
  if (result.analysis) {
    const ml = result.analysis.ml?.score || 0;
    const heuristic = result.analysis.heuristic?.score || 0;
    const reputation = result.analysis.reputation?.score || 0;

    mlScore.textContent = ml;
    mlScore.className = `breakdown-value ${getScoreSeverity(ml)}`;

    heuristicScore.textContent = heuristic;
    heuristicScore.className = `breakdown-value ${getScoreSeverity(heuristic)}`;

    reputationScore.textContent = reputation;
    reputationScore.className = `breakdown-value ${getScoreSeverity(reputation)}`;
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Load analysis for current tab
 */
async function loadAnalysis() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabId = tab.id;
    currentUrl = tab.url;

    const response = await chrome.runtime.sendMessage({
      type: 'GET_ANALYSIS',
      tabId: currentTabId
    });

    if (response && response.status !== 'pending') {
      updateUI(response);
    } else {
      // If no analysis yet, trigger a scan
      rescan();
    }
  } catch (error) {
    console.error('Error loading analysis:', error);
    contentLoading.style.display = 'none';
    contentResults.style.display = 'block';
    statusText.textContent = 'Error';
    urlDisplay.textContent = 'Could not analyze this page';
  }
}

/**
 * Rescan current page
 */
async function rescan() {
  contentLoading.style.display = 'flex';
  contentResults.style.display = 'none';

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'RESCAN',
      tabId: currentTabId
    });

    if (response) {
      updateUI(response);
    }
  } catch (error) {
    console.error('Error rescanning:', error);
    showToast('Error scanning page');
  }
}

/**
 * Submit report
 */
async function submitReport() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'REPORT_WEBSITE',
      url: currentUrl,
      reason: reportReason.value
    });

    if (response.success) {
      showToast('Report submitted successfully!');
      reportModal.classList.remove('active');
      reportReason.value = '';
    }
  } catch (error) {
    console.error('Error submitting report:', error);
    showToast('Error submitting report');
  }
}

// Event Listeners
btnRescan.addEventListener('click', rescan);

btnReport.addEventListener('click', () => {
  reportModal.classList.add('active');
});

btnCancelReport.addEventListener('click', () => {
  reportModal.classList.remove('active');
  reportReason.value = '';
});

btnSubmitReport.addEventListener('click', submitReport);

reportModal.addEventListener('click', (e) => {
  if (e.target === reportModal) {
    reportModal.classList.remove('active');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadAnalysis);
