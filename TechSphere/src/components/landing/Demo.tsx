import { useState } from "react";
import { Shield, AlertTriangle, XCircle, CheckCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScanResult = {
  url: string;
  status: 'safe' | 'suspicious' | 'malicious';
  score: number;
  mlScore: number;
  heuristicScore: number;
  reputationScore: number;
  threats: string[];
};

const mockResults: Record<string, ScanResult> = {
  'https://google.com': {
    url: 'https://google.com',
    status: 'safe',
    score: 5,
    mlScore: 0,
    heuristicScore: 0,
    reputationScore: 5,
    threats: []
  },
  'http://suspicious-login.tk/verify': {
    url: 'http://suspicious-login.tk/verify',
    status: 'malicious',
    score: 85,
    mlScore: 75,
    heuristicScore: 80,
    reputationScore: 90,
    threats: [
      'No HTTPS encryption',
      'High-risk TLD (.tk)',
      'Suspicious keywords: login, verify',
      'Flagged by Google Safe Browsing'
    ]
  },
  'https://amaz0n-secure.xyz/account': {
    url: 'https://amaz0n-secure.xyz/account',
    status: 'suspicious',
    score: 65,
    mlScore: 55,
    heuristicScore: 60,
    reputationScore: 70,
    threats: [
      'Possible Amazon impersonation',
      'High-risk TLD (.xyz)',
      'Suspicious keywords: secure, account'
    ]
  }
};

export function Demo() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    if (!url.trim()) return;
    
    setIsScanning(true);
    setResult(null);
    
    setTimeout(() => {
      // Check if URL matches a mock result
      const mockResult = mockResults[url.toLowerCase()];
      if (mockResult) {
        setResult(mockResult);
      } else {
        // Generate a generic safe result for unknown URLs
        setResult({
          url: url,
          status: 'safe',
          score: Math.floor(Math.random() * 20),
          mlScore: Math.floor(Math.random() * 15),
          heuristicScore: Math.floor(Math.random() * 10),
          reputationScore: 0,
          threats: []
        });
      }
      setIsScanning(false);
    }, 1500);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'malicious':
        return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Malicious' };
      case 'suspicious':
        return { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Suspicious' };
      default:
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Safe' };
    }
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try It <span className="gradient-text">Live</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Test the SafeBrowse detection engine with any URL. 
            Try these examples for different results.
          </p>
        </div>

        {/* Example URLs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.keys(mockResults).map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => setUrl(exampleUrl)}
              className="text-xs px-3 py-1.5 rounded-full glass hover:bg-card/70 transition-all text-muted-foreground hover:text-foreground"
            >
              {exampleUrl}
            </button>
          ))}
        </div>

        {/* Scanner */}
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL to scan..."
                  className="w-full h-12 pl-12 pr-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleScan}
                disabled={isScanning || !url.trim()}
              >
                {isScanning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Scan
              </Button>
            </div>
          </div>

          {/* Results */}
          {isScanning && (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground">Analyzing URL...</p>
            </div>
          )}

          {result && !isScanning && (
            <div className="glass rounded-2xl overflow-hidden animate-scale-in">
              {/* Status Header */}
              <div className={`p-6 ${getStatusConfig(result.status).bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const StatusIcon = getStatusConfig(result.status).icon;
                      return <StatusIcon className={`w-8 h-8 ${getStatusConfig(result.status).color}`} />;
                    })()}
                    <div>
                      <h3 className={`text-xl font-bold ${getStatusConfig(result.status).color}`}>
                        {getStatusConfig(result.status).label}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate max-w-md">{result.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getStatusConfig(result.status).color}`}>
                      {result.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-6 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  Analysis Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <ScoreBar label="ML Analysis" score={result.mlScore} />
                  <ScoreBar label="Heuristics" score={result.heuristicScore} />
                  <ScoreBar label="Reputation" score={result.reputationScore} />
                </div>
              </div>

              {/* Threats */}
              {result.threats.length > 0 && (
                <div className="p-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Detected Threats
                  </h4>
                  <ul className="space-y-2">
                    {result.threats.map((threat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 60) return 'bg-destructive';
    if (s >= 30) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{score}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
