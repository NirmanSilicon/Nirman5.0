/**
 * Heuristic analysis module for fast URL checks
 * Implements rule-based detection for common phishing patterns
 */

// Known URL shortener domains
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd',
  'buff.ly', 'adf.ly', 'tiny.cc', 'short.io', 'rebrand.ly',
  'cutt.ly', 'v.gd', 'shorturl.at', 'rb.gy'
];

// Known legitimate domains that are often impersonated
const IMPERSONATED_BRANDS = [
  'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
  'netflix', 'bank', 'chase', 'wellsfargo', 'citibank', 'usbank',
  'dropbox', 'linkedin', 'twitter', 'instagram', 'whatsapp'
];

/**
 * Check if URL uses HTTPS
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkHttps(url) {
  try {
    const parsed = new URL(url);
    const isSecure = parsed.protocol === 'https:';
    return {
      name: 'HTTPS Check',
      passed: isSecure,
      severity: isSecure ? 'none' : 'medium',
      message: isSecure ? 'Connection is encrypted' : 'Connection is not encrypted (HTTP)'
    };
  } catch {
    return {
      name: 'HTTPS Check',
      passed: false,
      severity: 'high',
      message: 'Invalid URL format'
    };
  }
}

/**
 * Check if URL uses IP address instead of domain
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkIPAddress(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const isIPv6 = /^\[.*\]$/.test(hostname);
    
    return {
      name: 'IP Address Check',
      passed: !isIP && !isIPv6,
      severity: isIP || isIPv6 ? 'high' : 'none',
      message: isIP || isIPv6 ? 'Uses IP address instead of domain name' : 'Uses valid domain name'
    };
  } catch {
    return {
      name: 'IP Address Check',
      passed: false,
      severity: 'high',
      message: 'Could not parse URL'
    };
  }
}

/**
 * Check for URL shortener usage
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkShortener(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const isShortener = URL_SHORTENERS.some(shortener => 
      hostname === shortener || hostname.endsWith('.' + shortener)
    );
    
    return {
      name: 'URL Shortener Check',
      passed: !isShortener,
      severity: isShortener ? 'medium' : 'none',
      message: isShortener ? 'URL shortener detected - destination unknown' : 'Direct URL'
    };
  } catch {
    return {
      name: 'URL Shortener Check',
      passed: true,
      severity: 'none',
      message: 'Could not check for shortener'
    };
  }
}

/**
 * Check for obfuscated URL patterns
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkObfuscation(url) {
  const issues = [];
  
  // Check for excessive URL encoding
  const encodedCount = (url.match(/%[0-9a-fA-F]{2}/g) || []).length;
  if (encodedCount > 10) {
    issues.push('Excessive URL encoding');
  }
  
  // Check for hex encoded characters
  if (/0x[0-9a-fA-F]+/i.test(url)) {
    issues.push('Hex-encoded characters');
  }
  
  // Check for unicode/punycode
  if (/xn--/.test(url)) {
    issues.push('Internationalized domain (possible homograph attack)');
  }
  
  // Check for @ symbol in URL (can hide actual destination)
  if (url.includes('@') && !url.startsWith('mailto:')) {
    issues.push('@ symbol in URL (may mask destination)');
  }
  
  // Check for multiple redirects indicated by URL structure
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    issues.push('Multiple URLs embedded');
  }

  return {
    name: 'Obfuscation Check',
    passed: issues.length === 0,
    severity: issues.length > 0 ? 'high' : 'none',
    message: issues.length > 0 ? issues.join('; ') : 'No obfuscation detected',
    details: issues
  };
}

/**
 * Check for brand impersonation patterns
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkBrandImpersonation(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const parts = hostname.split('.');
    
    const issues = [];
    
    for (const brand of IMPERSONATED_BRANDS) {
      // Check if brand name appears but it's not the actual domain
      const brandPattern = new RegExp(brand, 'i');
      if (brandPattern.test(hostname)) {
        // Check if it's not the legitimate domain
        const legitimateDomains = [
          `${brand}.com`, `www.${brand}.com`, `${brand}.co.uk`, 
          `${brand}.net`, `${brand}.org`
        ];
        
        const isLegitimate = legitimateDomains.some(legit => 
          hostname === legit || hostname.endsWith('.' + legit)
        );
        
        if (!isLegitimate) {
          issues.push(`Possible ${brand} impersonation`);
        }
      }
    }
    
    // Check for lookalike characters (homograph)
    const lookalikes = {
      '0': 'o', 'o': '0', '1': 'l', 'l': '1', 
      'rn': 'm', 'vv': 'w', 'cl': 'd'
    };
    
    for (const [fake, real] of Object.entries(lookalikes)) {
      if (hostname.includes(fake)) {
        const potentialBrand = hostname.replace(new RegExp(fake, 'g'), real);
        for (const brand of IMPERSONATED_BRANDS) {
          if (potentialBrand.includes(brand)) {
            issues.push(`Lookalike characters detected (${fake} → ${real})`);
            break;
          }
        }
      }
    }

    return {
      name: 'Brand Impersonation Check',
      passed: issues.length === 0,
      severity: issues.length > 0 ? 'high' : 'none',
      message: issues.length > 0 ? issues.join('; ') : 'No impersonation detected',
      details: issues
    };
  } catch {
    return {
      name: 'Brand Impersonation Check',
      passed: true,
      severity: 'none',
      message: 'Could not analyze for impersonation'
    };
  }
}

/**
 * Check for suspicious path patterns
 * @param {string} url - URL to check
 * @returns {Object} Check result
 */
function checkSuspiciousPath(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname + parsed.search;
    const issues = [];
    
    // Check for sensitive file extensions
    const sensitiveExtensions = ['.exe', '.zip', '.scr', '.bat', '.cmd', '.msi'];
    for (const ext of sensitiveExtensions) {
      if (path.toLowerCase().endsWith(ext)) {
        issues.push(`Suspicious file download (${ext})`);
      }
    }
    
    // Check for double extensions
    if (/\.\w+\.\w+$/.test(path) && !path.endsWith('.html')) {
      const match = path.match(/\.(\w+)\.(\w+)$/);
      if (match && sensitiveExtensions.includes('.' + match[2])) {
        issues.push('Double extension detected (common malware trick)');
      }
    }
    
    // Check for suspicious parameter patterns
    if (/redirect|redir|url|goto|return|next|continue/i.test(path)) {
      if (/https?%3A%2F%2F|https?:\/\//i.test(path)) {
        issues.push('Open redirect pattern detected');
      }
    }
    
    // Check for base64 encoded data in URL
    if (/[A-Za-z0-9+/]{40,}={0,2}/.test(path)) {
      issues.push('Possible base64 encoded data');
    }

    return {
      name: 'Path Analysis',
      passed: issues.length === 0,
      severity: issues.length > 0 ? 'medium' : 'none',
      message: issues.length > 0 ? issues.join('; ') : 'Path appears safe',
      details: issues
    };
  } catch {
    return {
      name: 'Path Analysis',
      passed: true,
      severity: 'none',
      message: 'Could not analyze path'
    };
  }
}

/**
 * Run all heuristic checks
 * @param {string} url - URL to analyze
 * @returns {Object} Combined heuristic results
 */
export function runHeuristicChecks(url) {
  const checks = [
    checkHttps(url),
    checkIPAddress(url),
    checkShortener(url),
    checkObfuscation(url),
    checkBrandImpersonation(url),
    checkSuspiciousPath(url)
  ];
  
  const failedChecks = checks.filter(check => !check.passed);
  const highSeverity = failedChecks.filter(check => check.severity === 'high').length;
  const mediumSeverity = failedChecks.filter(check => check.severity === 'medium').length;
  
  // Calculate heuristic score
  let score = 0;
  score += highSeverity * 30;
  score += mediumSeverity * 15;
  score = Math.min(100, score);
  
  let riskLevel = 'safe';
  if (score >= 60 || highSeverity >= 2) riskLevel = 'high';
  else if (score >= 30 || highSeverity >= 1) riskLevel = 'medium';
  else if (score > 0) riskLevel = 'low';

  return {
    score,
    riskLevel,
    checks,
    failedChecks,
    summary: {
      total: checks.length,
      passed: checks.length - failedChecks.length,
      failed: failedChecks.length,
      highSeverity,
      mediumSeverity
    }
  };
}
