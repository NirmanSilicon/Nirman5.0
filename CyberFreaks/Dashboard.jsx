import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const severityToken = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
}

const statusBadge = {
  secure: 'badge-secure',
  at_risk: 'badge-medium',
  compromised: 'badge-critical',
}

const fallbackSummaryCards = [
  {
    label: 'Overall Security Score',
    value: 90,
    unit: '/100',
    detail: 'Loading live telemetry…',
    accent: 'accent-cyan',
  },
  {
    label: 'Active Alerts',
    value: 0,
    detail: 'Fetching',
    accent: 'accent-magenta',
  },
  {
    label: 'Protected IoT Devices',
    value: 0,
    detail: 'Fetching',
    accent: 'accent-green',
  },
  {
    label: 'Detected Evil Twins',
    value: 0,
    detail: 'Fetching',
    accent: 'accent-amber',
  },
]

const defaultAssistantSuggestions = [
  'Summarize my current security posture',
  'Show me the highest risk alerts',
  'Give me steps to fix the top threat',
  'Suggest how to harden my WiFi',
]

function humanize(date) {
  if (!date) return '—'
  const delta = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(delta / (60 * 1000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} mins ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const modules = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'iot', label: 'IoT IDS' },
  { key: 'wifi', label: 'WiFi Watch' },
  { key: 'vault', label: 'Data Vault' },
  { key: 'assistant', label: 'Assistant' },
  { key: 'settings', label: 'Settings' },
]

const moduleTitle = {
  dashboard: 'Home Command Center',
  iot: 'IoT Intrusion Detection',
  wifi: 'WiFi Integrity Watch',
  vault: 'Encrypted Data Vault',
  assistant: 'AI Security Assistant',
  settings: 'Profile & Controls',
}

function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [networks, setNetworks] = useState([])
  const [alertLimit, setAlertLimit] = useState(4)
  const [toast, setToast] = useState(null)
  const [alertRefreshToken, setAlertRefreshToken] = useState(0)
  const [activeModule, setActiveModule] = useState('dashboard')
  const [iotOverview, setIotOverview] = useState(null)
  const [iotDevices, setIotDevices] = useState([])
  const [wifiOverview, setWifiOverview] = useState(null)
  const [vaultItems, setVaultItems] = useState([])
  const [settings, setSettings] = useState(null)
  const [assistantConversations, setAssistantConversations] = useState([])
  const [activeAssistantConversation, setActiveAssistantConversation] =
    useState(null)
  const [assistantMessages, setAssistantMessages] = useState([])
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantSending, setAssistantSending] = useState(false)
  const [assistantError, setAssistantError] = useState('')
  const [assistantBrief, setAssistantBrief] = useState('')
  const [assistantSuggestions, setAssistantSuggestions] = useState(
    defaultAssistantSuggestions,
  )

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summaryRes = await fetch(`${API_BASE}/summary`)
        if (!summaryRes.ok) throw new Error('Summary request failed')
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
        setNetworks(summaryData.networks ?? [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchSummary()
  }, [])

  useEffect(() => {
    const fetchAssistantBrief = async () => {
      try {
        const res = await fetch(`${API_BASE}/assistant/brief`)
        if (!res.ok) {
          throw new Error(`Failed to load assistant brief: ${res.status}`)
        }
        const data = await res.json()
        if (data.prompt) {
          setAssistantBrief(data.prompt)
        }
        if (Array.isArray(data.guidance) && data.guidance.length > 0) {
          setAssistantSuggestions(data.guidance)
        }
      } catch (error) {
        console.error('Error loading assistant brief:', error)
        setAssistantBrief('')
        setAssistantSuggestions(defaultAssistantSuggestions)
      }
    }

    fetchAssistantBrief()
  }, [])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts?limit=${alertLimit}`)
        if (!res.ok) throw new Error('Alerts request failed')
        setAlerts(await res.json())
      } catch (error) {
        console.error(error)
      }
    }
    fetchAlerts()
  }, [alertLimit, alertRefreshToken])

  useEffect(() => {
    const fetchIot = async () => {
      const [overviewRes, devicesRes] = await Promise.all([
        fetch(`${API_BASE}/iot/overview`),
        fetch(`${API_BASE}/iot/devices`),
      ])
      setIotOverview(await overviewRes.json())
      setIotDevices(await devicesRes.json())
    }

    if (activeModule === 'iot' && !iotOverview) {
      fetchIot()
    }
  }, [activeModule, iotOverview])

  useEffect(() => {
    const fetchWifi = async () => {
      const res = await fetch(`${API_BASE}/wifi/overview`)
      setWifiOverview(await res.json())
    }
    if (activeModule === 'wifi' && !wifiOverview) {
      fetchWifi()
    }
  }, [activeModule, wifiOverview])

  useEffect(() => {
    const fetchVault = async () => {
      const res = await fetch(`${API_BASE}/vault/items`)
      setVaultItems(await res.json())
    }
    if (activeModule === 'vault' && vaultItems.length === 0) {
      fetchVault()
    }
  }, [activeModule, vaultItems.length])

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch(`${API_BASE}/settings`)
      if (res.ok) {
        setSettings(await res.json())
      }
    }
    if (activeModule === 'settings' && !settings) {
      fetchSettings()
    }
  }, [activeModule, settings])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/assistant/conversations`)
        if (!res.ok) {
          throw new Error(`Failed to fetch conversations: ${res.status}`)
        }
        let data = await res.json()
        if (!Array.isArray(data)) data = []
        if (data.length === 0) {
          // Create a new conversation if none exist
          const newRes = await fetch(`${API_BASE}/assistant/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!newRes.ok) {
            throw new Error(`Failed to create conversation: ${newRes.status}`)
          }
          const newConversation = await newRes.json()
          data = [newConversation]
        }
        setAssistantConversations(data)
        if (data.length > 0) {
          setActiveAssistantConversation(data[0]._id)
        }
        setAssistantError('')
      } catch (error) {
        console.error('Error loading conversations:', error)
        setAssistantError('Failed to load conversations. Please try refreshing the page.')
        // Try to create a conversation anyway when user sends first message
      }
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (!activeAssistantConversation) return
    setAssistantMessages([])
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/assistant/conversations/${activeAssistantConversation}/messages`,
        )
        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.status}`)
        }
        const data = await res.json()
        setAssistantMessages(Array.isArray(data) ? data : [])
        setAssistantError('')
      } catch (error) {
        console.error('Error loading messages:', error)
        setAssistantError('Failed to load messages. Please try again.')
      }
    }
    fetchMessages()
  }, [activeAssistantConversation])

  const summaryCards = useMemo(() => {
    if (!summary) return fallbackSummaryCards
    return [
      {
        label: 'Overall Security Score',
        value: summary.securityScore,
        unit: '/100',
        detail: '+3 vs last week',
        accent: 'accent-cyan',
      },
      {
        label: 'Active Alerts',
        value: summary.metrics.activeAlerts,
        detail: `${summary.metrics.compromisedDevices} critical assets`,
        accent: 'accent-magenta',
      },
      {
        label: 'Protected IoT Devices',
        value: summary.metrics.protectedDevices,
        detail: `${summary.metrics.atRiskDevices} at risk`,
        accent: 'accent-green',
      },
      {
        label: 'Detected Evil Twins',
        value: summary.metrics.evilTwinCount,
        detail: summary.metrics.evilTwinCount
          ? 'Investigate now'
          : 'All clear',
        accent: 'accent-amber',
      },
    ]
  }, [summary])

  const chartSeries = summary?.alertsOverTime ?? []
  const chartValues = chartSeries.map((point) => point.value)
  const chartWidth = 520
  const chartHeight = 140
  const maxValue = Math.max(...chartValues, 1)
  const chartPoints = (chartValues.length ? chartValues : [0])
    .map((value, index) => {
      const x =
        (index / ((chartValues.length || 1) - 1 || 1)) *
        chartWidth
      const y = chartHeight - (value / maxValue) * chartHeight
      return `${x},${Number.isFinite(y) ? y : 0}`
    })
    .join(' ')
  const chartTotal = chartValues.reduce((acc, value) => acc + value, 0)

  const lastAssistantMessage =
    assistantMessages.filter((msg) => msg.role === 'assistant').slice(-1)[0]

  const assistantPrompt =
    lastAssistantMessage?.content ||
    assistantBrief ||
    `How can I harden my network against repeated evil twin attempts?`

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2600)
  }

  const handleDownloadCsv = async () => {
    const res = await fetch(`${API_BASE}/alerts?limit=100`)
    const data = await res.json()
    const csvHeader = 'id,severity,type,asset,riskScore,createdAt\n'
    const csvRows = data
      .map(
        (row) =>
          `${row.id},${row.severity},${row.type},${row.device},${row.riskScore},${row.createdAt}`,
      )
      .join('\n')
    const blob = new Blob([csvHeader + csvRows], {
      type: 'text/csv;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'alerts.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Export ready')
  }

  const handleManageNetworks = async () => {
    const res = await fetch(`${API_BASE}/networks`)
    const data = await res.json()
    setNetworks(data.slice(0, 3))
    showToast('Networks refreshed')
  }

  const ensureAssistantConversation = async () => {
    if (activeAssistantConversation) return activeAssistantConversation
    try {
      const res = await fetch(`${API_BASE}/assistant/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        throw new Error(`Failed to create conversation: ${res.status}`)
      }
      const conversation = await res.json()
      setAssistantConversations((prev) => [conversation, ...prev])
      setActiveAssistantConversation(conversation._id)
      
      // Fetch messages for the new conversation (including welcome message)
      const messagesRes = await fetch(
        `${API_BASE}/assistant/conversations/${conversation._id}/messages`,
      )
      if (messagesRes.ok) {
        const messages = await messagesRes.json()
        setAssistantMessages(Array.isArray(messages) ? messages : [])
      }
      
      return conversation._id
    } catch (error) {
      console.error('Error creating conversation:', error)
      setAssistantError('Failed to create conversation. Please try again.')
      return null
    }
  }

  const sendAssistantMessage = async (content) => {
    if (!content?.trim()) return
    const conversationId = await ensureAssistantConversation()
    if (!conversationId) {
      setAssistantError('Failed to create conversation')
      return
    }
    setAssistantSending(true)
    setAssistantError('')
    
    // Create temporary user message for immediate feedback
    const tempUserMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }
    setAssistantMessages((prev) => [...prev, tempUserMessage])
    
    try {
      const res = await fetch(
        `${API_BASE}/assistant/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        },
      )
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Assistant request failed')
      }
      const data = await res.json()
      
      // Replace temp message with real messages from server
      setAssistantMessages((prev) => {
        const filtered = prev.filter((msg) => msg._id !== tempUserMessage._id)
        return [...filtered, data.userMessage, data.assistantMessage]
      })
      
      setAssistantConversations((prev) =>
        prev
          .map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  updatedAt: new Date().toISOString(),
                }
              : conversation,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt),
          ),
      )
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setAssistantSuggestions(data.suggestions)
      } else {
        setAssistantSuggestions(defaultAssistantSuggestions)
      }

      return data
    } catch (error) {
      console.error('Assistant error:', error)
      // Remove temp message on error
      setAssistantMessages((prev) =>
        prev.filter((msg) => msg._id !== tempUserMessage._id),
      )
      setAssistantError(
        error.message || 'Assistant unavailable. Check API key or network.',
      )
    } finally {
      setAssistantSending(false)
    }
  }

  const handleNewConversation = async () => {
    try {
      const res = await fetch(`${API_BASE}/assistant/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        throw new Error(`Failed to create conversation: ${res.status}`)
      }
      const conversation = await res.json()
      setAssistantConversations((prev) => [conversation, ...prev])
      setActiveAssistantConversation(conversation._id)
      
      // Fetch messages for the new conversation (including welcome message)
      const messagesRes = await fetch(
        `${API_BASE}/assistant/conversations/${conversation._id}/messages`,
      )
      if (messagesRes.ok) {
        const messages = await messagesRes.json()
        setAssistantMessages(Array.isArray(messages) ? messages : [])
      } else {
        setAssistantMessages([])
      }
      setAssistantError('')
    } catch (error) {
      console.error('Error creating new conversation:', error)
      setAssistantError('Could not create conversation. Please try again.')
    }
  }

  const handleAcknowledge = async (alertId) => {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    })
    if (res.ok) {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert,
        ),
      )
      showToast('Alert acknowledged')
    }
  }

  const handleAssistantAsk = async (question) => {
    if (!question || assistantSending) return
    setActiveModule('assistant')
    await sendAssistantMessage(question)
    showToast('Assistant answered')
  }

  const handleAssistantSubmit = async (event) => {
    if (event) {
      event.preventDefault()
    }
    const messageContent = assistantInput.trim()
    if (!messageContent) {
      setAssistantError('Enter a question for the assistant')
      return
    }
    if (assistantSending) {
      return
    }
    const contentToSend = messageContent
    setAssistantInput('')
    await sendAssistantMessage(contentToSend)
  }

  const renderDashboard = () => (
    <>
      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className={`summary-card ${card.accent}`}
          >
            <p className="summary-label">{card.label}</p>
            <p className="summary-value">
              {card.value}
              {card.unit && <span>{card.unit}</span>}
            </p>
            <p className="summary-detail">{card.detail}</p>
            {card.label === 'Overall Security Score' && (
              <div className="progress-bar">
                <span style={{ width: `${card.value}%` }} />
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="grid-2">
        <article className="panel">
          <header className="panel-head">
            <div>
              <p className="eyebrow">Alerts over time</p>
              <h2>Last 12 hours</h2>
            </div>
            <button className="ghost-btn" onClick={handleDownloadCsv}>
              Download CSV
            </button>
          </header>
          <svg
            className="sparkline"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="rgba(80, 214, 255, 0.9)"
              strokeWidth="3"
              points={chartPoints}
            />
            <polyline
              fill="rgba(80, 214, 255, 0.2)"
              stroke="none"
              points={`${chartPoints} ${chartWidth},${chartHeight} 0,${chartHeight}`}
            />
          </svg>
          <div className="chart-legend">
            <div>
              <span className="legend-dot cyan" />
              <strong>{chartTotal} alerts</strong> in window
            </div>
            <p className="trend positive">Auto-updated</p>
          </div>
        </article>

        <article className="panel">
          <header className="panel-head">
            <div>
              <p className="eyebrow">Trusted networks</p>
              <h2>WiFi integrity</h2>
            </div>
            <button className="ghost-btn" onClick={handleManageNetworks}>
              Manage
            </button>
          </header>
          <ul className="network-list">
            {networks.map((network) => (
              <li key={network.id}>
                <div>
                  <p className="network-ssid">{network.ssid}</p>
                  <p className="network-meta">
                    {network.encryptionType} • {network.notes || 'stable'}
                  </p>
                </div>
                <span
                  className={`badge ${
                    network.isTrusted
                      ? 'badge-secure'
                      : network.encryptionType === 'OPEN'
                      ? 'badge-critical'
                      : ''
                  }`}
                >
                  {network.isTrusted ? 'Secure' : 'Suspect'}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel recent-alerts">
        <header className="panel-head">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2>Recent alerts</h2>
          </div>
          <button
            className="ghost-btn"
            onClick={() => setAlertLimit((limit) => limit + 4)}
          >
            View all
          </button>
        </header>
        <div className="table">
          <div className="table-head">
            <span>ID</span>
            <span>Severity</span>
            <span>Type</span>
            <span>Asset</span>
            <span>Detected</span>
            <span>Action</span>
          </div>
          {alerts.map((alert) => (
            <div key={alert.id} className="table-row">
              <span>{alert.id}</span>
              <span className={`badge ${severityToken[alert.severity]}`}>
                {alert.severity}
              </span>
              <span>{alert.type}</span>
              <span>{alert.device}</span>
              <span>{humanize(alert.createdAt)}</span>
              <button
                className="primary-link"
                onClick={() => handleAcknowledge(alert.id)}
              >
                {alert.status === 'acknowledged' ? 'Acknowledged' : 'Resolve'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const renderIot = () => (
    <>
      <section className="summary-grid">
        <article className="summary-card accent-cyan">
          <p className="summary-label">Monitored</p>
          <p className="summary-value">
            {iotOverview?.monitored ?? '--'}
          </p>
          <p className="summary-detail">devices enrolled</p>
        </article>
        <article className="summary-card accent-magenta">
          <p className="summary-label">Compromised</p>
          <p className="summary-value">
            {iotOverview?.compromised ?? '--'}
          </p>
          <p className="summary-detail">needs isolation</p>
        </article>
        <article className="summary-card accent-green">
          <p className="summary-label">Healthy</p>
          <p className="summary-value">
            {iotOverview?.healthy ?? '--'}
          </p>
          <p className="summary-detail">in optimal state</p>
        </article>
        <article className="summary-card accent-amber">
          <p className="summary-label">Critical alerts</p>
          <p className="summary-value">
            {iotOverview?.criticalAlerts ?? '--'}
          </p>
          <p className="summary-detail">within last scan</p>
        </article>
      </section>

      <section className="panel recent-alerts">
        <header className="panel-head">
          <div>
            <p className="eyebrow">Device posture</p>
            <h2>IoT fleet</h2>
          </div>
        </header>
        <div className="table">
          <div className="table-head">
            <span>Device</span>
            <span>Type</span>
            <span>Status</span>
            <span>Mac</span>
            <span>IP</span>
            <span>Added</span>
          </div>
          {iotDevices.map((device) => (
            <div key={device.id} className="table-row">
              <span>{device.name}</span>
              <span>{device.type}</span>
              <span className={`badge ${statusBadge[device.status] || ''}`}>
                {device.status.replace('_', ' ')}
              </span>
              <span>{device.mac}</span>
              <span>{device.ip}</span>
              <span>{humanize(device.createdAt)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const renderWifi = () => (
    <section className="panel recent-alerts">
      <header className="panel-head">
        <div>
          <p className="eyebrow">Wireless watch</p>
          <h2>Trusted networks</h2>
        </div>
        <div className="wifi-metrics">
          <span className="badge badge-secure">
            {wifiOverview?.trusted ?? 0} Trusted
          </span>
          <span className="badge badge-critical">
            {wifiOverview?.suspect ?? 0} Suspect
          </span>
        </div>
      </header>
      <ul className="network-list">
        {(wifiOverview?.networks ?? networks).map((network) => (
          <li key={network.id}>
            <div>
              <p className="network-ssid">{network.ssid}</p>
              <p className="network-meta">
                {network.encryptionType} • signal {network.signalScore}
              </p>
            </div>
            <span
              className={`badge ${
                network.isTrusted
                  ? 'badge-secure'
                  : network.encryptionType === 'OPEN'
                  ? 'badge-critical'
                  : ''
              }`}
            >
              {network.isTrusted ? 'Secure' : 'Suspect'}
            </span>
          </li>
        ))}
      </ul>
      {wifiOverview?.lastAlert && (
        <div className="wifi-alert">
          Last evil twin alert ·{' '}
          {humanize(wifiOverview.lastAlert.createdAt)} ·{' '}
          {wifiOverview.lastAlert.description}
        </div>
      )}
    </section>
  )

  const renderVault = () => (
    <section className="panel recent-alerts">
      <header className="panel-head">
      <div>
          <p className="eyebrow">Encrypted vault</p>
          <h2>Secure items</h2>
        </div>
      </header>
      <div className="table">
        <div className="table-head">
          <span>Name</span>
          <span>Category</span>
          <span>Status</span>
          <span>Size</span>
          <span>Accessed</span>
          <span>Shared with</span>
        </div>
        {vaultItems.map((item) => (
          <div key={item.id} className="table-row">
            <span>{item.name}</span>
            <span>{item.category}</span>
            <span className="badge badge-secure">{item.status}</span>
            <span>{item.sizeKb} KB</span>
            <span>{humanize(item.lastAccessed)}</span>
            <span>{item.sharedWith?.join(', ') || 'Private'}</span>
          </div>
        ))}
      </div>
    </section>
  )

  const renderAssistantModule = () => (
    <section className="panel assistant-module">
      <header className="panel-head">
        <div>
          <p className="eyebrow">Assistant mode</p>
          <h2>Conversations</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="ghost-btn" 
            onClick={() => navigate('/problem-solver')}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
          >
            🚀 Problem Solver
          </button>
          <button className="ghost-btn" onClick={handleNewConversation}>
            New chat
          </button>
        </div>
      </header>
      <div className="assistant-layout">
        <aside className="conversation-column">
          {assistantConversations.length === 0 ? (
            <div>
              <p className="chat-placeholder">No conversations yet.</p>
              {assistantError && assistantError.includes('Failed to load') && (
                <p className="assistant-error" style={{ marginTop: '10px', fontSize: '0.85em' }}>
                  {assistantError}
                </p>
              )}
            </div>
          ) : (
            <ul>
              {assistantConversations.map((conversation) => (
                <li key={conversation._id}>
                  <button
                    className={`conversation-item ${
                      conversation._id === activeAssistantConversation
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setActiveAssistantConversation(conversation._id)
                    }
                  >
                    <strong>{conversation.title}</strong>
                    <span>
                      {new Date(
                        conversation.updatedAt || conversation.createdAt,
                      ).toLocaleString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <div className="chat-window">
          <div className="chat-messages">
            {assistantMessages.length === 0 ? (
              <p className="chat-placeholder">
                Start the conversation. I can summarize alerts, explain
                risks, or suggest remediation steps.
              </p>
            ) : (
              assistantMessages.map((message) => (
                <div
                  key={message._id}
                  className={`chat-message ${message.role}`}
                >
                  <p>{message.content}</p>
                  <span>{humanize(message.createdAt)}</span>
                </div>
              ))
            )}
          </div>
          {assistantSuggestions.length > 0 && (
            <div className="chat-suggestions">
              <p>Try asking:</p>
              <div className="suggestion-chips">
                {assistantSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleAssistantAsk(suggestion)}
                    disabled={assistantSending}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <form className="chat-input" onSubmit={handleAssistantSubmit}>
            <input
              type="text"
              value={assistantInput}
              onChange={(event) => {
                setAssistantInput(event.target.value)
                setAssistantError('')
              }}
              placeholder="Ask anything about your security posture…"
              disabled={assistantSending}
              autoComplete="off"
            />
            <button type="submit" disabled={assistantSending || !assistantInput.trim()}>
              {assistantSending ? 'Thinking…' : 'Send'}
            </button>
          </form>
          {assistantError && (
            <p className="assistant-error">{assistantError}</p>
          )}
        </div>
      </div>
    </section>
  )

  const renderSettings = () => (
    <section className="panel recent-alerts">
      <header className="panel-head">
        <div>
          <p className="eyebrow">User controls</p>
          <h2>Current settings</h2>
        </div>
      </header>
      <div className="settings-grid">
        <article>
          <p className="summary-label">Risk threshold</p>
          <h3>{settings?.riskScoreThreshold ?? '--'}</h3>
          <p className="summary-detail">
            Alerts above this score escalate.
          </p>
        </article>
        <article>
          <p className="summary-label">Notifications</p>
          <h3>
            Email:{' '}
            {settings?.notificationPreferences?.email ? 'On' : 'Off'}
          </h3>
          <h3>
            Push:{' '}
            {settings?.notificationPreferences?.push ? 'On' : 'Off'}
          </h3>
        </article>
        <article>
          <p className="summary-label">Assistant tone</p>
          <h3>{settings?.assistantMode ?? '--'}</h3>
          <p className="summary-detail">
            Switch in settings API to change tone.
          </p>
        </article>
      </div>
    </section>
  )

  const renderModule = () => {
    switch (activeModule) {
      case 'iot':
        return renderIot()
      case 'wifi':
        return renderWifi()
      case 'vault':
        return renderVault()
      case 'assistant':
        return renderAssistantModule()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      <aside className="nav-rail">
        <div className="brand">
          <span className="brand-pill">CYBER</span>
          <span className="brand-pill alt">NOVA</span>
        </div>
        <nav>
          {modules.map((module) => (
            <button
              key={module.key}
              className={`nav-item ${
                activeModule === module.key ? 'active' : ''
              }`}
              onClick={() => setActiveModule(module.key)}
            >
              {module.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Security posture</p>
            <h1>{moduleTitle[activeModule]}</h1>
          </div>
          <div className="top-actions">
            <div className="search">
              <span>⌕</span>
              <input placeholder="Search alerts, devices, networks" />
            </div>
            <button
              className="ghost-btn"
              onClick={() =>
                setAlertRefreshToken((token) => token + 1)
              }
            >
              Refresh alerts
            </button>
            <div className="avatar">HS</div>
          </div>
        </header>
        {renderModule()}
      </main>

      <aside className="assistant-widget">
        <header>
          <p className="eyebrow">AI Security Assistant</p>
          <strong>Ready to help</strong>
        </header>
        <p className="assistant-snippet">{assistantPrompt}</p>
        <div className="assistant-preview">
          {assistantMessages.slice(-3).map((message) => (
            <p key={message._id} className={message.role}>
              <strong>{message.role === 'assistant' ? 'AI' : 'You'}:</strong>{' '}
              {message.content}
            </p>
          ))}
        </div>
        <div className="assistant-actions">
          <button
            className="primary-btn"
            onClick={() => setActiveModule('assistant')}
          >
            Open chat
          </button>
          <button
            className="ghost-btn ghost-light"
            onClick={() =>
              handleAssistantAsk(
                assistantSuggestions[0] || 'Give me a quick brief',
              )
            }
          >
            Quick brief
          </button>
        </div>
        {assistantSuggestions.length > 0 && (
          <div className="widget-suggestions">
            {assistantSuggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-chip ghost"
                onClick={() => handleAssistantAsk(suggestion)}
                disabled={assistantSending}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </aside>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default Dashboard
