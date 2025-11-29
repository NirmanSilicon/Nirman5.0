/**
 * Reputation API module
 * Integrates with external threat intelligence services
 * Note: Uses mock implementations for demo - replace with real API keys for production
 */

// API configuration (replace with real keys in production)
const CONFIG = {
  googleSafeBrowsing: {
    apiKey: 'YOUR_GOOGLE_SAFE_BROWSING_API_KEY',
    endpoint: 'https://safebrowsing.googleapis.com/v4/threatMatches:find'
  },
  virusTotal: {
    apiKey: 'YOUR_VIRUSTOTAL_API_KEY',
    endpoint: 'https://www.virustotal.com/api/v3/urls'
  }
};

// Mock malicious domains for demonstration
const MOCK_MALICIOUS_DOMAINS = [
  'malware-test.com',
  'phishing-example.net',
  'suspicious-login.tk',
  'free-prize-winner.xyz',
  'secure-bank-verify.ru',
  'account-update-urgent.ml'
];

const MOCK_SUSPICIOUS_DOMAINS = [
  'download-free-software.info',
  'login-verify-account.top',
  'special-offer-deal.click'
];

/**
 * Check URL against Google Safe Browsing API
 * @param {string} url - URL to check
 * @returns {Promise<Object>} API result
 */
async function checkGoogleSafeBrowsing(url) {
  // Check if we have a real API key
  if (CONFIG.googleSafeBrowsing.apiKey === 'YOUR_GOOGLE_SAFE_BROWSING_API_KEY') {
    // Use mock response
    return mockGoogleSafeBrowsing(url);
  }

  try {
    const response = await fetch(
      `${CONFIG.googleSafeBrowsing.endpoint}?key=${CONFIG.googleSafeBrowsing.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: {
            clientId: 'safebrowse-extension',
            clientVersion: '1.0.0'
          },
          threatInfo: {
            threatTypes: [
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION'
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }]
          }
        })
      }
    );

    const data = await response.json();
    
    return {
      service: 'Google Safe Browsing',
      checked: true,
      flagged: data.matches && data.matches.length > 0,
      threats: data.matches ? data.matches.map(m => m.threatType) : [],
      raw: data
    };
  } catch (error) {
    console.error('Google Safe Browsing API error:', error);
    return {
      service: 'Google Safe Browsing',
      checked: false,
      error: error.message
    };
  }
}

/**
 * Mock Google Safe Browsing response
 * @param {string} url - URL to check
 * @returns {Object} Mock result
 */
function mockGoogleSafeBrowsing(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const isMalicious = MOCK_MALICIOUS_DOMAINS.some(d => hostname.includes(d));
    const isSuspicious = MOCK_SUSPICIOUS_DOMAINS.some(d => hostname.includes(d));
    
    return {
      service: 'Google Safe Browsing',
      checked: true,
      flagged: isMalicious,
      threats: isMalicious ? ['SOCIAL_ENGINEERING', 'MALWARE'] : [],
      isMock: true
    };
  } catch {
    return {
      service: 'Google Safe Browsing',
      checked: true,
      flagged: false,
      threats: [],
      isMock: true
    };
  }
}

/**
 * Check URL against VirusTotal API
 * @param {string} url - URL to check
 * @returns {Promise<Object>} API result
 */
async function checkVirusTotal(url) {
  // Check if we have a real API key
  if (CONFIG.virusTotal.apiKey === 'YOUR_VIRUSTOTAL_API_KEY') {
    // Use mock response
    return mockVirusTotal(url);
  }

  try {
    // First, submit the URL for analysis
    const urlId = btoa(url).replace(/=/g, '');
    
    const response = await fetch(
      `${CONFIG.virusTotal.endpoint}/${urlId}`,
      {
        headers: {
          'x-apikey': CONFIG.virusTotal.apiKey
        }
      }
    );

    const data = await response.json();
    
    const stats = data.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    
    return {
      service: 'VirusTotal',
      checked: true,
      flagged: malicious > 0,
      maliciousCount: malicious,
      suspiciousCount: suspicious,
      totalEngines: Object.values(stats).reduce((a, b) => a + b, 0),
      raw: data
    };
  } catch (error) {
    console.error('VirusTotal API error:', error);
    return {
      service: 'VirusTotal',
      checked: false,
      error: error.message
    };
  }
}

/**
 * Mock VirusTotal response
 * @param {string} url - URL to check
 * @returns {Object} Mock result
 */
function mockVirusTotal(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const isMalicious = MOCK_MALICIOUS_DOMAINS.some(d => hostname.includes(d));
    const isSuspicious = MOCK_SUSPICIOUS_DOMAINS.some(d => hostname.includes(d));
    
    return {
      service: 'VirusTotal',
      checked: true,
      flagged: isMalicious,
      maliciousCount: isMalicious ? 12 : 0,
      suspiciousCount: isSuspicious ? 3 : 0,
      totalEngines: 70,
      isMock: true
    };
  } catch {
    return {
      service: 'VirusTotal',
      checked: true,
      flagged: false,
      maliciousCount: 0,
      suspiciousCount: 0,
      totalEngines: 70,
      isMock: true
    };
  }
}

/**
 * Check against local blocklist
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkLocalBlocklist(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const isMalicious = MOCK_MALICIOUS_DOMAINS.some(d => hostname.includes(d));
    const isSuspicious = MOCK_SUSPICIOUS_DOMAINS.some(d => hostname.includes(d));
    
    return {
      service: 'Local Blocklist',
      checked: true,
      flagged: isMalicious || isSuspicious,
      severity: isMalicious ? 'high' : isSuspicious ? 'medium' : 'none',
      matchedDomain: isMalicious 
        ? MOCK_MALICIOUS_DOMAINS.find(d => hostname.includes(d))
        : isSuspicious 
          ? MOCK_SUSPICIOUS_DOMAINS.find(d => hostname.includes(d))
          : null
    };
  } catch {
    return {
      service: 'Local Blocklist',
      checked: false,
      error: 'Invalid URL'
    };
  }
}

/**
 * Run all reputation checks
 * @param {string} url - URL to check
 * @returns {Promise<Object>} Combined reputation results
 */
export async function checkReputation(url) {
  const results = await Promise.all([
    checkGoogleSafeBrowsing(url),
    checkVirusTotal(url),
    Promise.resolve(checkLocalBlocklist(url))
  ]);

  const [googleResult, vtResult, localResult] = results;
  
  // Determine if any service flagged the URL
  const isFlagged = results.some(r => r.flagged);
  const flaggedServices = results.filter(r => r.flagged);
  
  // Calculate reputation score (lower is better, 0-100 scale inverted)
  let score = 0;
  
  if (googleResult.flagged) score += 40;
  if (vtResult.flagged) score += 35;
  if (vtResult.suspiciousCount > 0) score += Math.min(15, vtResult.suspiciousCount * 5);
  if (localResult.flagged) score += localResult.severity === 'high' ? 25 : 10;
  
  score = Math.min(100, score);
  
  let riskLevel = 'safe';
  if (score >= 50) riskLevel = 'high';
  else if (score >= 25) riskLevel = 'medium';
  else if (score > 0) riskLevel = 'low';

  return {
    score,
    riskLevel,
    isFlagged,
    services: {
      googleSafeBrowsing: googleResult,
      virusTotal: vtResult,
      localBlocklist: localResult
    },
    flaggedServices: flaggedServices.map(s => s.service),
    summary: {
      totalServices: 3,
      servicesChecked: results.filter(r => r.checked).length,
      servicesFlagged: flaggedServices.length
    }
  };
}
