/**
 * SafeBrowse Background Service Worker
 * Handles URL analysis and threat detection
 */

import { calculateMLScore } from './utils/ml_scoring.js';
import { runHeuristicChecks } from './utils/heuristics.js';
import { checkReputation } from './utils/reputation_api.js';

// Store scan results for each tab
const tabResults = new Map();

// User reports storage
let userReports = [];

/**
 * Analyze a URL using all detection methods
 * @param {string} url - URL to analyze
 * @returns {Promise<Object>} Combined analysis results
 */
async function analyzeUrl(url) {
  console.log('[SafeBrowse] Analyzing URL:', url);
  
  // Skip analysis for extension pages and local files
  if (url.startsWith('chrome://') || 
      url.startsWith('chrome-extension://') ||
      url.startsWith('about:') ||
      url.startsWith('file://')) {
    return {
      url,
      skipped: true,
      status: 'safe',
      message: 'Internal page - not analyzed'
    };
  }

  try {
    // Run all checks in parallel
    const [mlResult, heuristicResult, reputationResult] = await Promise.all([
      Promise.resolve(calculateMLScore(url)),
      Promise.resolve(runHeuristicChecks(url)),
      checkReputation(url)
    ]);

    // Calculate combined score (weighted average)
    const weights = { ml: 0.3, heuristic: 0.3, reputation: 0.4 };
    const combinedScore = Math.round(
      mlResult.score * weights.ml +
      heuristicResult.score * weights.heuristic +
      reputationResult.score * weights.reputation
    );

    // Determine overall risk level
    let status = 'safe';
    if (combinedScore >= 70 || reputationResult.isFlagged) {
      status = 'malicious';
    } else if (combinedScore >= 40) {
      status = 'suspicious';
    } else if (combinedScore >= 20) {
      status = 'caution';
    }

    const result = {
      url,
      timestamp: Date.now(),
      status,
      combinedScore,
      analysis: {
        ml: mlResult,
        heuristic: heuristicResult,
        reputation: reputationResult
      },
      threats: collectThreats(mlResult, heuristicResult, reputationResult),
      recommendations: generateRecommendations(status, mlResult, heuristicResult, reputationResult)
    };

    console.log('[SafeBrowse] Analysis complete:', result);
    return result;

  } catch (error) {
    console.error('[SafeBrowse] Analysis error:', error);
    return {
      url,
      timestamp: Date.now(),
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Collect all detected threats
 */
function collectThreats(ml, heuristic, reputation) {
  const threats = [];

  // ML-detected issues
  if (ml.score >= 40) {
    Object.entries(ml.breakdown).forEach(([key, value]) => {
      threats.push({
        source: 'ML Analysis',
        type: key,
        detail: value,
        severity: ml.score >= 70 ? 'high' : 'medium'
      });
    });
  }

  // Heuristic issues
  heuristic.failedChecks.forEach(check => {
    threats.push({
      source: 'Heuristic Analysis',
      type: check.name,
      detail: check.message,
      severity: check.severity
    });
  });

  // Reputation issues
  if (reputation.isFlagged) {
    reputation.flaggedServices.forEach(service => {
      threats.push({
        source: 'Reputation Check',
        type: service,
        detail: `Flagged by ${service}`,
        severity: 'high'
      });
    });
  }

  return threats;
}

/**
 * Generate user-friendly recommendations
 */
function generateRecommendations(status, ml, heuristic, reputation) {
  const recs = [];

  if (status === 'malicious') {
    recs.push('Do not enter any personal information on this site');
    recs.push('Leave this website immediately');
    recs.push('Consider reporting this site if you believe it\'s malicious');
  } else if (status === 'suspicious') {
    recs.push('Exercise caution when interacting with this site');
    recs.push('Verify the URL is correct before entering any information');
    recs.push('Look for signs of legitimacy (SSL certificate, official branding)');
  } else if (status === 'caution') {
    recs.push('This site has some minor risk indicators');
    recs.push('Proceed with awareness');
  }

  if (!heuristic.checks.find(c => c.name === 'HTTPS Check')?.passed) {
    recs.push('This site does not use HTTPS encryption');
  }

  return recs;
}

/**
 * Update extension badge based on status
 */
function updateBadge(tabId, status) {
  const badgeConfig = {
    safe: { text: '✓', color: '#10B981' },
    caution: { text: '!', color: '#F59E0B' },
    suspicious: { text: '!!', color: '#F97316' },
    malicious: { text: '✕', color: '#EF4444' },
    error: { text: '?', color: '#6B7280' }
  };

  const config = badgeConfig[status] || badgeConfig.error;
  
  chrome.action.setBadgeText({ tabId, text: config.text });
  chrome.action.setBadgeBackgroundColor({ tabId, color: config.color });
}

/**
 * Handle navigation events
 */
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // Only analyze main frame navigations
  if (details.frameId !== 0) return;

  const result = await analyzeUrl(details.url);
  tabResults.set(details.tabId, result);
  
  updateBadge(details.tabId, result.status);

  // Send warning to content script if needed
  if (result.status === 'malicious' || result.status === 'suspicious') {
    try {
      await chrome.tabs.sendMessage(details.tabId, {
        type: 'SHOW_WARNING',
        data: result
      });
    } catch (e) {
      console.log('[SafeBrowse] Could not send message to tab:', e);
    }
  }
});

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_ANALYSIS':
      const tabId = message.tabId;
      const result = tabResults.get(tabId);
      sendResponse(result || { status: 'pending', message: 'No analysis available' });
      break;

    case 'RESCAN':
      (async () => {
        const tab = await chrome.tabs.get(message.tabId);
        const result = await analyzeUrl(tab.url);
        tabResults.set(message.tabId, result);
        updateBadge(message.tabId, result.status);
        sendResponse(result);
      })();
      return true; // Keep channel open for async response

    case 'REPORT_WEBSITE':
      const report = {
        url: message.url,
        reason: message.reason,
        timestamp: Date.now(),
        id: crypto.randomUUID()
      };
      userReports.push(report);
      console.log('[SafeBrowse] Website reported:', report);
      
      // Store in chrome.storage
      chrome.storage.local.get(['reports'], (data) => {
        const reports = data.reports || [];
        reports.push(report);
        chrome.storage.local.set({ reports });
      });
      
      sendResponse({ success: true, report });
      break;

    case 'GET_REPORTS':
      chrome.storage.local.get(['reports'], (data) => {
        sendResponse({ reports: data.reports || [] });
      });
      return true;

    case 'PROCEED_ANYWAY':
      // User chose to proceed despite warning
      console.log('[SafeBrowse] User proceeding to risky site:', message.url);
      sendResponse({ acknowledged: true });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

/**
 * Clean up when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  tabResults.delete(tabId);
});

console.log('[SafeBrowse] Background service worker initialized');
