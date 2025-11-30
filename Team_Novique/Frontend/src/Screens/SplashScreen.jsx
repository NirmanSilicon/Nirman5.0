import React, { useEffect, useRef, useState } from "react";

export default function SplashScreen({ autoHideMs = 3500, onFinish = () => {} }) {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    const timer = setTimeout(() => {
      if (rootRef.current) {
        rootRef.current.style.opacity = '0';
        rootRef.current.style.transform = 'scale(1.1)';
      }
      setTimeout(() => {
  const circle = document.querySelector('.reveal-circle');
  circle.classList.add('active');
  setTimeout(onFinish, 800);
}, autoHideMs - 1000);
    }, autoHideMs - 500);

    return () => clearTimeout(timer);
  }, [autoHideMs, onFinish]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={mounted ? 'splash-mounted' : ''}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0000BB 0%, #0000DD 40%, #0000FF 100%)",
        overflow: "hidden",
        perspective: "1400px",
        opacity: 0,
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      }}
    >
      {/* Animated gradient orbs */}
      <div className="orb-background" />

      {/* Decorative lines */}
      <div className="decorative-lines">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="deco-line"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Hexagonal geometric patterns */}
      <div className="geometric-patterns">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="hexagon"
            style={{
              width: 120 + i * 15,
              height: 120 + i * 15,
              animationDelay: `${0.3 + i * 0.1}s`,
              left: `${30 + Math.cos(i) * 20}%`,
              top: `${40 + Math.sin(i) * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Floating circles */}
      <div className="floating-circles">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="float-circle"
            style={{
              width: 80 + i * 30,
              height: 80 + i * 30,
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Expanding rings */}
      <div className="rings-container">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`ring ring-${i}`}
            style={{
              width: 250 + i * 80,
              height: 250 + i * 80,
              border: `2px solid rgba(173, 216, 230, ${0.4 - i * 0.12})`,
              animationDelay: `${0.3 + i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <div className="central-glow" />

      {/* Main content container */}
      <div className="content-container">
        {/* Orbital rings around logo */}
        <div className="orbitals-container">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="orbital"
              style={{
                border: `1px solid rgba(173, 216, 230, ${0.35 - i * 0.1})`,
                transform: `scale(${1 + i * 0.3})`,
                animationDuration: `${4 + i * 1.5}s`,
                animationDelay: `${0.5 + i * 0.2}s`,
              }}
            >
              <div className="orbital-dot" />
            </div>
          ))}
        </div>

        {/* Logo container with glass effect */}
        <div className="logo-container">
          <div className="logo-glow" />
          <img
            className="logo-image border-amber-50 border-2"
            src="/Logo.jpeg"
            alt="Project logo"
            draggable={false}
          />
        </div>

        {/* Main headline */}
        <div className="headline">
          Building Better Learning
        </div>

        {/* Subline */}
        <div className="subline">
          Learn . Track . Improve
        </div>

        {/* Enhanced particle system */}
        <div className="particles-container">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const distance = 150 + Math.sin(i) * 50;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;
            
            return (
              <span
                key={i}
                className="particle"
                style={{
                  width: i % 3 === 0 ? 6 : 10,
                  height: i % 3 === 0 ? 6 : 10,
                  background: [
                    "#ADD8E6",
                    "#0000FF", 
                    "#7EC8E3",
                    "#3366FF",
                    "#B8E0F0",
                    "#0033FF"
                  ][i % 6],
                  boxShadow: `0 0 15px ${["#ADD8E6", "#0000FF", "#7EC8E3", "#3366FF", "#B8E0F0", "#0033FF"][i % 6]}`,
                  animationDelay: `${1 + i * 0.03}s`,
                  '--target-x': `${targetX}px`,
                  '--target-y': `${targetY}px`,
                  '--rotation': `${180 + Math.random() * 360}deg`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Enhanced progress bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{
            animationDuration: `${autoHideMs / 1000}s`,
          }}
        />
      </div>
      <div className="reveal-circle" />
      <style>{`
        .splash-mounted {
          opacity: 1 !important;
        }

        .exit-animation {
  animation: exitBurst 0.9s ease forwards;
}

@keyframes exitBurst {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1);
  }
  40% {
    filter: brightness(2.5);
    transform: scale(1.08);
  }
  65% {
    opacity: 1;
    filter: brightness(3);
    transform: scale(1.15);
    background-color: white;
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1.1);
    filter: brightness(1);
  }
}


        .orb-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          background: radial-gradient(circle at 20% 30%, rgba(173, 216, 230, 0.2), transparent 40%), 
                      radial-gradient(circle at 80% 70%, rgba(0, 0, 255, 0.15), transparent 45%),
                      radial-gradient(circle at 50% 50%, rgba(173, 216, 230, 0.1), transparent 60%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        .decorative-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .deco-line {
          position: absolute;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(173, 216, 230, 0.3), transparent);
          opacity: 0;
          animation: lineSlide 2s ease-in-out infinite;
        }

        @keyframes lineSlide {
          0%, 100% { opacity: 0; transform: translateY(-100%); }
          50% { opacity: 0.6; transform: translateY(0%); }
        }

        .geometric-patterns {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .hexagon {
          position: absolute;
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
          background: linear-gradient(135deg, rgba(173, 216, 230, 0.08), rgba(0, 0, 255, 0.05));
          border: 1px solid rgba(173, 216, 230, 0.15);
          opacity: 0;
          transform: scale(0) rotate(-180deg);
          animation: hexagonAppear 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        @keyframes hexagonAppear {
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .floating-circles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .float-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(173, 216, 230, 0.12), transparent 70%);
          border: 2px solid rgba(173, 216, 230, 0.08);
          opacity: 0;
          animation: circleFloat ease-in-out infinite, circleAppear 0.8s ease-out forwards;
        }

        @keyframes circleFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes circleAppear {
          to { opacity: 1; }
        }

        .rings-container {
          position: absolute;
          width: 600px;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.3);
          animation: ringExpand 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        @keyframes ringExpand {
          to {
            opacity: 0.6;
            transform: scale(1);
          }
        }

        .central-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(173, 216, 230, 0.5), rgba(0, 0, 255, 0.3) 50%, transparent 70%);
          filter: blur(50px);
          opacity: 0;
          transform: scale(0);
          pointer-events: none;
          animation: glowBurst 0.8s ease-out 0.4s forwards, glowPulse 3s ease-in-out 1.5s infinite;
        }

        @keyframes glowBurst {
          to {
            opacity: 0.9;
            transform: scale(2);
          }
        }

        @keyframes glowPulse {
          0%, 100% { filter: blur(50px); }
          50% { filter: blur(60px); }
        }

        .content-container {
          position: relative;
          width: 400px;
          max-width: 90vw;
          display: flex;
          gap: 24px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .orbitals-container {
          position: absolute;
          width: 240px;
          height: 240px;
          pointer-events: none;
        }

        .orbital {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: spin linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .orbital-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ADD8E6;
          box-shadow: 0 0 15px #ADD8E6, 0 0 25px rgba(173, 216, 230, 0.5);
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.3); }
        }

        .logo-container {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 32px;
          display: grid;
          place-items: center;
          box-shadow: 0 25px 70px rgba(0, 0, 255, 0.5), 
                      0 0 100px rgba(173, 216, 230, 0.4),
                      inset 0 0 0 1px rgba(173, 216, 230, 0.25),
                      0 5px 15px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, rgba(173, 216, 230, 0.18), rgba(0, 0, 255, 0.12));
          backdrop-filter: blur(15px);
          transform-style: preserve-3d;
          border: 2px solid rgba(173, 216, 230, 0.3);
          transform: scale(0.2) rotateX(90deg) rotateY(-45deg) rotateZ(15deg) translateY(50px);
          opacity: 0;
          animation: logoEntrance 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards,
                     logoFloat 3s ease-in-out 1.8s infinite;
        }

        .logo-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(173, 216, 230, 0.4), transparent 70%);
          filter: blur(20px);
          animation: logoGlowPulse 2s ease-in-out infinite;
        }

        @keyframes logoGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes logoEntrance {
          to {
            transform: scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0);
            opacity: 1;
          }
        }

        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0) rotateY(0deg) rotateX(0deg); 
            box-shadow: 0 25px 70px rgba(0, 0, 255, 0.5), 
                        0 0 100px rgba(173, 216, 230, 0.4),
                        inset 0 0 0 1px rgba(173, 216, 230, 0.25),
                        0 5px 15px rgba(0, 0, 0, 0.3);
          }
          50% { 
            transform: translateY(-12px) rotateY(3deg) rotateX(2deg); 
            box-shadow: 0 30px 80px rgba(0, 0, 255, 0.6), 
                        0 0 120px rgba(173, 216, 230, 0.5),
                        inset 0 0 0 1px rgba(173, 216, 230, 0.35),
                        0 8px 20px rgba(0, 0, 0, 0.4);
          }
        }

        .logo-image {
          width: 75%;
          height: 75%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          display: block;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 255, 0.5));
          border-radius: 12px;
          transform: scale(0.8) rotate(-180deg);
          opacity: 0;
          animation: logoImageEntrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s forwards;
          position: relative;
          z-index: 1;
        }

        @keyframes logoImageEntrance {
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .headline {
          color: white;
          text-align: center;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: -0.5px;
          opacity: 0;
          pointer-events: none;
          text-shadow: 0 4px 20px rgba(0, 0, 255, 0.6), 0 0 40px rgba(173, 216, 230, 0.4);
          background: linear-gradient(135deg, #ADD8E6 0%, #ffffff 50%, #ADD8E6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          transform: translateY(20px) scale(0.95);
          animation: textEntrance 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.2s forwards,
                     textShimmer 3s linear 2s infinite;
        }

        @keyframes textEntrance {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes textShimmer {
          to { background-position: 200% center; }
        }

        .subline {
          color: #ADD8E6;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.5px;
          opacity: 0;
          pointer-events: none;
          text-shadow: 0 2px 12px rgba(0, 0, 255, 0.4), 0 0 20px rgba(173, 216, 230, 0.3);
          transform: translateY(15px);
          animation: sublineEntrance 0.6s ease-out 1.4s forwards;
        }

        @keyframes sublineEntrance {
          to {
            opacity: 0.9;
            transform: translateY(0);
          }
        }

        .particles-container {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          transform: translate3d(0, 0, 0) rotate(0deg) scale(0);
          opacity: 0;
          pointer-events: none;
          animation: particleBurst 1.5s ease-out forwards;
        }

        @keyframes particleBurst {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--target-x), var(--target-y), 0) rotate(var(--rotation)) scale(1.2);
            opacity: 0;
          }
        }

        .progress-bar-container {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 4px;
          border-radius: 8px;
          background: rgba(173, 216, 230, 0.15);
          overflow: hidden;
          pointer-events: none;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4), 0 0 20px rgba(173, 216, 230, 0.1);
        }

        .progress-bar-fill {
          width: 0%;
          height: 100%;
          border-radius: 8px;
          background: linear-gradient(90deg, #0000FF 0%, #ADD8E6 50%, #0000FF 100%);
          background-size: 200% 100%;
          box-shadow: 0 0 20px rgba(0, 0, 255, 0.8), 0 0 40px rgba(173, 216, 230, 0.6);
          pointer-events: none;
          will-change: width;
          animation: progressFill linear forwards, progressShimmer 2s linear infinite;
        }

        @keyframes progressFill {
          to { width: 100%; }
        }

        @keyframes progressShimmer {
          to { background-position: 200% 0; }
        }

        .reveal-circle {
  position: fixed;
  inset: 0;
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: white;
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  z-index: 10000;
  transition: transform 0.8s cubic-bezier(0.68,-0.55,0.265,1.55), opacity 0.3s ease;
}

.reveal-circle.active {
  opacity: 1;
  transform: scale(15);
}

      `}</style>
    </div>
  );
}