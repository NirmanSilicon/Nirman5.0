import React from "react";

// ✅ 20 Embedded YouTube Videos (Healthy Habits, Menstruation & Hygiene)
const videos = [
  {  url: "https://www.youtube.com/embed/digpucxFbMo?si=QeX4FnPhwlLrxQay" },
  {  url: "https://www.youtube.com/embed/LhL5SNZfnQs?si=k2dVYuYp26VCwKHf" },
  {  url: "https://www.youtube.com/embed/AdqrTg_hpEQ?si=r3Psqk8CaTYrUKYn" },
  {url: "https://www.youtube.com/embed/enYITYwvPAQ?si=71RLB0r4EwxvqAzJ" },
  { url: "https://www.youtube.com/embed/7W2N-Xcw17U?si=r3C8JV0rwVpIIKBm" },
  {  url: "https://www.youtube.com/embed/MUq6jBuQTPg?si=T16E4ZBAUENH6HbY" },
  {  url: "https://www.youtube.com/embed/agvdkRc_img?si=6M9y-ABTFpr7RgGe" },
  {  url: "https://www.youtube.com/embed/AEREJOT_Mpc?si=4x9JtS23S6tRbVBV" },
 
  
];

export default function Exercise() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Health Awareness Video Library</h1>
      <p style={styles.subheading}>
        Learn about healthy habits, menstrual health, and personal hygiene through these educational videos.
      </p>

      <div style={styles.grid}>
        {videos.map((video, index) => (
          <div key={index} style={styles.card}>
            <iframe
              src={video.url}
              title={video.title}
              style={styles.video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h3 style={styles.title}>{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
    
  );
}


const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(135deg, #78adb7ff)",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "10px",
    color: "#00695c"
  },
  subheading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px"
  },
  card: {
    background:"#4b95a8ff",
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  video: {
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    border: "none"
  },
  title: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#004d40"
  }
};
