import React, { useState } from 'react'
import LandingPage from './LandingPage';
import SplashScreen from './SplashScreen';


const Home = () => {
    const [showSplash, setShowSplash] = useState(true);
  return (
    <>
    {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    {!showSplash && <LandingPage />}
    </>
  )
}

export default Home