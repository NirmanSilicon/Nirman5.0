import './BottomNav.css'

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'diagnose', label: 'Diagnose', icon: '📷' },
    { id: 'disease-packs', label: 'Disease Packs', icon: '📚' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="icon">{tab.icon}</span>
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
