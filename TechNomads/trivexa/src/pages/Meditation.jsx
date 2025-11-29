import React, { useRef, useState } from "react";


export default function MeditationPage() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (file) => {
    // If same track clicked → toggle pause/play
    if (currentTrack === file) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // If new track clicked → stop previous & play new
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(`/music/${file}`);
    audioRef.current = newAudio;
    newAudio.play();

    setCurrentTrack(file);
    setIsPlaying(true);
  };

  return (
    <>
      <style>{`
        .med-container {
          padding: 35px;
          background: #78adb7ff;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .med-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 30px;
        }
        .med-card {
          background: #4b95a8ff;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
        }
        .med-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .med-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 18px;
        }
        .med-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #99cfdcff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .med-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .med-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .pink { background: linear-gradient(135deg, #e879f9, #d946ef); }
        .blue { background: linear-gradient(135deg, #38bdf8, #0ea5e9); }

        .med-text h4 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .med-text p {
          font-size: 12px;
          color: #6b7280;
          margin: 2px 0 0 0;
        }
        .play-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>

      <div className="med-container">
        <div className="med-grid">

          {/* ================= GUIDED MEDITATION ================= */}
          <div className="med-card">
            <h2 className="med-title">Guided Meditation</h2>
            <p className="med-subtitle">Expert-led meditation sessions</p>

            {[
              { name: "Mindfulness Meditation", time: "10 mins", file: "mindfulness.mp3" },
              
              { name: "Deep Relaxation", time: "15 mins", file: "deep_relaxation.mp3" },
              { name: "Anxiety Relief Meditation", time: "12 mins", file: "anxiety.mp3" },
              { name: "Sleep Meditation", time: "20 mins", file: "sleep.mp3" },
              { name: "Morning Energy Meditation", time: "8 mins", file: "morning_energy.mp3" }
            ].map((item, index) => (
              <div key={index} className="med-item">
                <div className="med-left">
                  <div className="med-icon pink">♪</div>
                  <div className="med-text">
                    <h4>{item.name}</h4>
                    <p>{item.time}</p>
                  </div>
                </div>

                <button
                  className="play-btn"
                  onClick={() => handlePlay(item.file)}
                  
                >
                  {currentTrack === item.file && isPlaying ? "Pause" : "Play"}
                </button>
              </div>
            ))}
          </div>

          {/* ================= THERAPEUTIC MUSIC ================= */}
          <div className="med-card">
            <h2 className="med-title">Therapeutic Music</h2>
            <p className="med-subtitle">Calming music for stress relief</p>

            {[
              { name: "Nature Sounds", time: "30 mins", file: "nature.mp3" },
              { name: "Healing Frequencies", time: "45 mins", file: "healing.mp3" },
              { name: "Piano Relaxation", time: "25 mins", file: "piano.mp3" },
              { name: "Ocean Waves", time: "60 mins", file: "ocean.mp3" },
              { name: "Forest Ambience", time: "40 mins", file: "forest.mp3" }
            ].map((item, index) => (
              <div key={index} className="med-item">
                <div className="med-left">
                  <div className="med-icon blue">♪</div>
                  <div className="med-text">
                    <h4>{item.name}</h4>
                    <p>{item.time}</p>
                  </div>
                </div>

                <button
                  className="play-btn"
                  onClick={() => handlePlay(item.file)}
                >
                  {currentTrack === item.file && isPlaying ? "Pause" : "Play"}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

