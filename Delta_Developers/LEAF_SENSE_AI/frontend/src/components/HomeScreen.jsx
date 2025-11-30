import './HomeScreen.css'

export default function HomeScreen({ onNavigate }) {
  return (
    <div className="home-screen">
      <div className="header">
        <h1>Hello, Farmer! 👋</h1>
        <p>What do you want to do today?</p>
      </div>

      <div className="primary-card" onClick={() => onNavigate('diagnose')}>
        <h2>Diagnose Leaf Disease</h2>
        <p>Upload a leaf photo and let LeafSense AI analyze it</p>
        <span className="arrow">→</span>
      </div>

      <div className="cards-grid">
        <div className="card" onClick={() => onNavigate('disease-packs')}>
          <span className="icon">📚</span>
          <h3>Disease Packs</h3>
          <p>Browse disease info</p>
        </div>
        <div className="card" onClick={() => onNavigate('chat')}>
          <span className="icon">💬</span>
          <h3>Ask AI</h3>
          <p>Get quick answers</p>
        </div>
      </div>
    </div>
  )
}
