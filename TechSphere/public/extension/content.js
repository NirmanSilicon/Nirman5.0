/**
 * SafeBrowse Content Script
 * Handles warning overlay display on malicious/suspicious pages
 */

let warningOverlay = null;

/**
 * Create and display warning overlay
 * @param {Object} data - Analysis result data
 */
function showWarning(data) {
  // Remove existing warning if any
  if (warningOverlay) {
    warningOverlay.remove();
  }

  const ismalicious = data.status === 'malicious';
  const themeColor = ismalicious ? '#EF4444' : '#F59E0B';
  const themeBg = ismalicious ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
  const statusText = ismalicious ? 'Dangerous Website Detected' : 'Suspicious Website Detected';
  const iconPath = ismalicious ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' : 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

  // Create overlay container
  warningOverlay = document.createElement('div');
  warningOverlay.id = 'safebrowse-warning';
  warningOverlay.innerHTML = `
    <div class="safebrowse-overlay">
      <div class="safebrowse-modal" style="--theme-color: ${themeColor}; --theme-bg: ${themeBg};">
        <div class="safebrowse-header">
          <div class="safebrowse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="${iconPath}" />
            </svg>
          </div>
          <h1 class="safebrowse-title">${statusText}</h1>
          <p class="safebrowse-subtitle">SafeBrowse has detected potential threats on this website</p>
        </div>

        <div class="safebrowse-score">
          <div class="safebrowse-score-circle">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="${themeColor}"
                stroke-width="3"
                stroke-dasharray="${data.combinedScore}, 100"
                stroke-linecap="round"
              />
            </svg>
            <span class="safebrowse-score-value">${data.combinedScore}</span>
          </div>
          <div class="safebrowse-score-label">Risk Score</div>
        </div>

        <div class="safebrowse-threats">
          <h3>Detected Threats</h3>
          <ul>
            ${data.threats.slice(0, 5).map(threat => `
              <li class="safebrowse-threat-item ${threat.severity}">
                <span class="safebrowse-threat-badge">${threat.severity}</span>
                <span class="safebrowse-threat-text">${threat.detail}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${data.recommendations && data.recommendations.length > 0 ? `
          <div class="safebrowse-recommendations">
            <h3>Recommendations</h3>
            <ul>
              ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="safebrowse-actions">
          <button class="safebrowse-btn safebrowse-btn-safe" id="safebrowse-goback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back Safely
          </button>
          <button class="safebrowse-btn safebrowse-btn-danger" id="safebrowse-proceed">
            Proceed Anyway
          </button>
        </div>

        <div class="safebrowse-footer">
          <img src="${chrome.runtime.getURL('icons/icon32.png')}" alt="SafeBrowse" onerror="this.style.display='none'" />
          <span>Protected by SafeBrowse</span>
        </div>
      </div>
    </div>
  `;

  document.documentElement.appendChild(warningOverlay);

  // Animate in
  requestAnimationFrame(() => {
    warningOverlay.classList.add('safebrowse-visible');
  });

  // Event handlers
  document.getElementById('safebrowse-goback').addEventListener('click', () => {
    window.history.back();
    // Fallback if no history
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 100);
  });

  document.getElementById('safebrowse-proceed').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'PROCEED_ANYWAY',
      url: window.location.href
    });
    hideWarning();
  });
}

/**
 * Hide and remove warning overlay
 */
function hideWarning() {
  if (warningOverlay) {
    warningOverlay.classList.remove('safebrowse-visible');
    setTimeout(() => {
      warningOverlay.remove();
      warningOverlay = null;
    }, 300);
  }
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_WARNING') {
    showWarning(message.data);
    sendResponse({ shown: true });
  } else if (message.type === 'HIDE_WARNING') {
    hideWarning();
    sendResponse({ hidden: true });
  }
});

console.log('[SafeBrowse] Content script loaded');
