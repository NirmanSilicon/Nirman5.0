import { useState } from 'react'
import BottomNav from './components/BottomNav'
import HomeScreen from './components/HomeScreen'
import DiagnoseScreen from './components/DiagnoseScreen'
import DiseasePacksScreen from './components/DiseasePacksScreen'
import ChatScreen from './components/ChatScreen'
import ProfileScreen from './components/ProfileScreen'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [lastDisease, setLastDisease] = useState('unknown')

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />
      case 'diagnose':
        return <DiagnoseScreen onDiseaseDetected={setLastDisease} />
      case 'disease-packs':
        return <DiseasePacksScreen />
      case 'chat':
        return <ChatScreen lastDisease={lastDisease} />
      case 'profile':
        return <ProfileScreen />
      default:
        return <HomeScreen onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="app">
      <div className="screen-container">
        {renderScreen()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
