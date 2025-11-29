import React from "react";

// ✅ 20 Embedded YouTube Videos (Healthy Habits, Menstruation & Hygiene)
const videos = [
  { title: "Daily Healthy Habits", url: "https://www.youtube.com/embed/G7dgGxJPd-c?si=BbtN9mToBU-6Ks9f" },
  { title: "Importance of Hygiene", url: "https://www.youtube.com/embed/r1ssrCW5w8o?si=s--qim_iGXAP7Zbo" },
  { title: "Healthy Morning Routine", url: "https://www.youtube.com/embed/3TJPtKY-vHs?si=n4CWQUMPByehDDCo" },
  { title: "Menstrual Hygiene Awareness", url: "https://www.youtube.com/embed/kmWbOC8Fbb0?si=mIx_eS_Ds_62IQAd" },
  { title: "Importance of Menstruation Education", url: "https://www.youtube.com/embed/ToLIii2wC4I?si=Igqn3-WIkpv67XNt" },
  { title: "Clean Hands Save Lives", url: "https://www.youtube.com/embed/kOKeFv5VvY4?si=vAiy3mZeDVhU-0JM" },
  { title: "Healthy Eating Habits", url: "https://www.youtube.com/embed/jwWpTAXu-Sg" },
  { title: "Girls & Menstrual Hygiene", url: "https://www.youtube.com/embed/6tS5PijjMrU?si=6nEs6H0VOpfFx0i1" },
  { title: "Personal Hygiene for Teens", url: "https://www.youtube.com/embed/l6XGE-Xuq3M?si=pD7yMIk-fD9ZGOZF" },
  { title: "Why Periods Matter", url: "https://www.youtube.com/embed/cjbgZwgdY7Q?si=YZ6pIOTrZ3O_lzEP" },
  { title: "Healthy Lifestyle Tips", url: "https://www.youtube.com/embed/nIUYfReOgLU?si=MQQmnggxJjVAmVeo" },
  { title: "Importance of Sanitary Pads", url: "https://www.youtube.com/embed/2_zNmK83iys?si=HWwJnWlPhJkqRrr0" },
  { title: "Women's Health Hygiene", url: "https://www.youtube.com/embed/Q90cb5ovK00?si=KM9oihLwrXfQTk0K" },
  { title: "Exercise & Hygiene", url: "https://www.youtube.com/embed/2pLT-olgUJs" },
  { title: "Healthy Sleep Habits", url: "https://www.youtube.com/embed/gedoSfZvBgE" },
  { title: "Hydration & Health", url: "https://www.youtube.com/embed/9iMGFqMmUFs?si=Xd1SzTVh_0239d8R" }
];

export default function HealthVideos() {
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
