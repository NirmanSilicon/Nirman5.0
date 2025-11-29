# SafeBrowse Chrome Extension

Real-time malicious website detection with ML scoring, reputation checks, and heuristic analysis.

## Features

- **ML-Powered Scoring**: Analyzes URL patterns, suspicious keywords, and structural anomalies
- **Reputation Checks**: Integration with Google Safe Browsing and VirusTotal APIs
- **Heuristic Analysis**: Fast rule-based checks for common threat indicators
- **Instant Warnings**: Beautiful warning overlays for malicious/suspicious sites
- **User Reports**: Community-powered threat reporting

## Installation

1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. SafeBrowse is now active!

## Structure

```
/SafeBrowse
├── manifest.json          # Extension configuration (MV3)
├── background.js          # Service worker for URL analysis
├── content.js             # Warning overlay injection
├── popup.html/js          # Extension popup UI
├── styles.css             # Warning overlay styles
├── icons/                 # Extension icons
└── utils/
    ├── ml_scoring.js      # ML-inspired risk scoring
    ├── heuristics.js      # Rule-based detection
    └── reputation_api.js  # API integrations
```

## API Configuration

For production use, replace the mock API keys in `utils/reputation_api.js`:

- `GOOGLE_SAFE_BROWSING_API_KEY`: Get from Google Cloud Console
- `VIRUSTOTAL_API_KEY`: Get from VirusTotal

## Detection Methods

### ML Scoring (0-100)
- URL length analysis
- Suspicious keyword detection
- TLD risk assessment
- Encoding/obfuscation detection
- Domain structure analysis

### Heuristic Checks
- HTTPS verification
- IP-based URL detection
- URL shortener identification
- Brand impersonation patterns
- Suspicious path patterns

### Reputation APIs
- Google Safe Browsing
- VirusTotal URL Scan
- Local blocklist

## License

MIT License - Free to use and modify.
