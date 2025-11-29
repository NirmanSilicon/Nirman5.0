import { useNavigate } from 'react-router-dom'
import './Welcome.css'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      <div className="welcome-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <nav className="welcome-nav">
        <div className="brand">
          <span className="brand-pill">CYBER</span>
          <span className="brand-pill alt">NOVA</span>
        </div>
        <div className="nav-actions">
          <button className="ghost-btn" onClick={() => navigate('/signin')}>
            Sign In
          </button>
          <button className="primary-btn" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </nav>

      <main className="welcome-content">
        <div className="welcome-hero">
          <h1 className="welcome-title">
            <span className="gradient-text-cyan">Advanced</span>{' '}
            <span className="gradient-text-pink">Cybersecurity</span> Platform
          </h1>
          <p className="welcome-subtitle">
            Protect your network, monitor IoT devices, detect threats, and get
            AI-powered security recommendations—all in one powerful dashboard.
          </p>
          <div className="welcome-cta">
            <button
              className="primary-btn large"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
            </button>
            <button
              className="ghost-btn large"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon accent-cyan">🛡️</div>
            <h3>Real-Time Threat Detection</h3>
            <p>
              Monitor your network 24/7 with advanced intrusion detection and
              anomaly analysis.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon accent-magenta">📡</div>
            <h3>WiFi Security Watch</h3>
            <p>
              Detect evil twin attacks and rogue access points before they
              compromise your data.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon accent-green">🔐</div>
            <h3>IoT Device Protection</h3>
            <p>
              Secure and monitor all your connected devices with comprehensive
              security controls.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon accent-amber">🤖</div>
            <h3>AI Security Assistant</h3>
            <p>
              Get intelligent recommendations and step-by-step solutions for
              every security issue.
            </p>
          </div>
        </div>

        <div className="welcome-stats">
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Monitoring</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">AI-Powered</div>
            <div className="stat-label">Threat Detection</div>
          </div>
        </div>
      </main>

      <footer className="welcome-footer">
        <p>© 2024 CYBER-NOVA. All rights reserved.</p>
      </footer>
    </div>
  )
}


