/**
 * ML-inspired URL risk scoring module
 * Analyzes URL features to generate a risk score from 0-100
 */

// Suspicious keywords commonly found in phishing URLs
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm',
  'banking', 'password', 'credential', 'authenticate', 'validation',
  'suspended', 'unusual', 'activity', 'limited', 'restore', 'unlock',
  'free-gift', 'winner', 'prize', 'lottery', 'reward', 'bonus',
  'urgent', 'immediate', 'action-required', 'expire', 'deadline'
];

// High-risk TLDs often associated with malicious sites
const HIGH_RISK_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz', '.work', '.click',
  '.link', '.download', '.review', '.stream', '.racing', '.win', '.bid',
  '.loan', '.trade', '.webcam', '.date', '.faith', '.accountant'
];

// Medium-risk TLDs
const MEDIUM_RISK_TLDS = [
  '.ru', '.cn', '.br', '.info', '.biz', '.online', '.site', '.tech'
];

/**
 * Extract features from a URL for ML-style scoring
 * @param {string} url - The URL to analyze
 * @returns {Object} Feature object
 */
function extractFeatures(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { error: true };
  }

  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;
  const fullUrl = parsedUrl.href;

  return {
    // Length features
    urlLength: fullUrl.length,
    hostnameLength: hostname.length,
    pathLength: pathname.length,

    // Character features
    dotCount: (hostname.match(/\./g) || []).length,
    hyphenCount: (hostname.match(/-/g) || []).length,
    underscoreCount: (fullUrl.match(/_/g) || []).length,
    atSymbol: fullUrl.includes('@'),
    hasDoubleSlash: pathname.includes('//'),

    // Encoding features
    percentEncoded: (fullUrl.match(/%[0-9a-fA-F]{2}/g) || []).length,
    hexChars: (fullUrl.match(/0x[0-9a-fA-F]+/g) || []).length,

    // Domain features
    isIP: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname),
    hasPort: parsedUrl.port !== '',
    subdomainCount: hostname.split('.').length - 2,

    // Security features
    isHttps: parsedUrl.protocol === 'https:',
    
    // TLD analysis
    tld: '.' + hostname.split('.').pop(),

    // Keyword analysis
    suspiciousKeywords: SUSPICIOUS_KEYWORDS.filter(
      keyword => fullUrl.toLowerCase().includes(keyword)
    ),

    // URL shortener detection
    isShortener: /^(bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|is\.gd|buff\.ly|adf\.ly|tiny\.cc)$/i.test(hostname)
  };
}

/**
 * Calculate ML-based risk score
 * @param {string} url - URL to analyze
 * @returns {Object} Scoring result with score and breakdown
 */
export function calculateMLScore(url) {
  const features = extractFeatures(url);
  
  if (features.error) {
    return { score: 100, breakdown: { error: 'Invalid URL format' }, riskLevel: 'high' };
  }

  let score = 0;
  const breakdown = {};

  // URL Length scoring (long URLs are suspicious)
  if (features.urlLength > 100) {
    const lengthPenalty = Math.min(20, Math.floor((features.urlLength - 100) / 20) * 5);
    score += lengthPenalty;
    breakdown.urlLength = `+${lengthPenalty} (length: ${features.urlLength})`;
  }

  // Hostname length
  if (features.hostnameLength > 30) {
    const hostPenalty = Math.min(15, Math.floor((features.hostnameLength - 30) / 10) * 5);
    score += hostPenalty;
    breakdown.hostnameLength = `+${hostPenalty} (hostname length: ${features.hostnameLength})`;
  }

  // Dot count (excessive subdomains)
  if (features.dotCount > 3) {
    const dotPenalty = (features.dotCount - 3) * 8;
    score += Math.min(24, dotPenalty);
    breakdown.subdomains = `+${Math.min(24, dotPenalty)} (${features.dotCount} dots)`;
  }

  // Hyphen count
  if (features.hyphenCount > 2) {
    const hyphenPenalty = (features.hyphenCount - 2) * 5;
    score += Math.min(15, hyphenPenalty);
    breakdown.hyphens = `+${Math.min(15, hyphenPenalty)} (${features.hyphenCount} hyphens)`;
  }

  // @ symbol (highly suspicious)
  if (features.atSymbol) {
    score += 25;
    breakdown.atSymbol = '+25 (@ symbol detected)';
  }

  // IP address instead of domain
  if (features.isIP) {
    score += 30;
    breakdown.ipAddress = '+30 (IP address instead of domain)';
  }

  // Non-standard port
  if (features.hasPort) {
    score += 15;
    breakdown.nonStandardPort = '+15 (non-standard port)';
  }

  // No HTTPS
  if (!features.isHttps) {
    score += 20;
    breakdown.noHttps = '+20 (no HTTPS)';
  }

  // Percent encoding
  if (features.percentEncoded > 5) {
    const encodePenalty = Math.min(20, features.percentEncoded * 2);
    score += encodePenalty;
    breakdown.encoding = `+${encodePenalty} (${features.percentEncoded} encoded chars)`;
  }

  // High-risk TLD
  if (HIGH_RISK_TLDS.includes(features.tld.toLowerCase())) {
    score += 25;
    breakdown.highRiskTLD = `+25 (high-risk TLD: ${features.tld})`;
  } else if (MEDIUM_RISK_TLDS.includes(features.tld.toLowerCase())) {
    score += 10;
    breakdown.mediumRiskTLD = `+10 (medium-risk TLD: ${features.tld})`;
  }

  // Suspicious keywords
  if (features.suspiciousKeywords.length > 0) {
    const keywordPenalty = Math.min(30, features.suspiciousKeywords.length * 10);
    score += keywordPenalty;
    breakdown.keywords = `+${keywordPenalty} (keywords: ${features.suspiciousKeywords.join(', ')})`;
  }

  // URL shortener
  if (features.isShortener) {
    score += 20;
    breakdown.shortener = '+20 (URL shortener detected)';
  }

  // Double slash in path
  if (features.hasDoubleSlash) {
    score += 10;
    breakdown.doubleSlash = '+10 (double slash in path)';
  }

  // Excessive subdomains
  if (features.subdomainCount > 2) {
    const subPenalty = (features.subdomainCount - 2) * 8;
    score += Math.min(24, subPenalty);
    breakdown.excessiveSubdomains = `+${Math.min(24, subPenalty)} (${features.subdomainCount} subdomains)`;
  }

  // Cap score at 100
  score = Math.min(100, score);

  // Determine risk level
  let riskLevel = 'safe';
  if (score >= 70) riskLevel = 'high';
  else if (score >= 40) riskLevel = 'medium';
  else if (score >= 20) riskLevel = 'low';

  return {
    score,
    breakdown,
    riskLevel,
    features: {
      urlLength: features.urlLength,
      isHttps: features.isHttps,
      isIP: features.isIP,
      tld: features.tld,
      suspiciousKeywords: features.suspiciousKeywords.length
    }
  };
}
