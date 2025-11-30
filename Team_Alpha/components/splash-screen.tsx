import React from 'react'

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-6 animate-float">
          <img
            src="/logosymptocare.png"
            alt="SymptoCare Logo"
            className="h-24 w-24 sm:h-32 sm:w-32 mx-auto drop-shadow-lg"
          />
        </div>

        {/* Brand Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-2 glow-text">
          SymptoCare
        </h1>
        <p className="text-lg sm:text-xl text-primary-foreground/90 font-medium">
          Your symptoms, our care!
        </p>

        {/* Loading Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
