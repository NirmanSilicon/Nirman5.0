import './ProfileScreen.css'

export default function ProfileScreen() {
  return (
    <div className="profile-screen">
      <h1>Your Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <h2>Farmer Profile</h2>
        <p className="role">Digital Crop Doctor User</p>
      </div>

      <div className="section">
        <h3>Settings</h3>
        <div className="setting-item">
          <span>Farmer Name</span>
          <span>John Doe</span>
        </div>
        <div className="setting-item">
          <span>Preferred Language</span>
          <span>English</span>
        </div>
        <div className="setting-item">
          <span>App Version</span>
          <span>1.0.0</span>
        </div>
      </div>

      <div className="section">
        <h3>About LeafSense AI</h3>
        <div className="info-text">
          <p>LeafSense AI is your digital crop doctor, designed to help farmers identify plant diseases quickly and accurately. Simply upload a photo of an affected leaf, and our AI will analyze it to detect potential diseases.</p>
          <p>Our goal is to empower farmers with technology that helps protect crops and improve yields. Get instant diagnosis, treatment recommendations, and prevention tips all in one app.</p>
        </div>
      </div>

      <div className="section">
        <div className="footer">
          <p>Made for farmers, with ❤️</p>
        </div>
      </div>
    </div>
  )
}
