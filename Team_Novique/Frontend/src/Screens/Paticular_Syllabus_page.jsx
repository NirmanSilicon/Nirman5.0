import { useEffect, useState } from "react";
import { 
  ChevronDown, 
  BookOpen, 
  FileText, 
  ListChecks, 
  Zap,
  GraduationCap,
  Beaker,
  Globe,
  Calculator,
  Languages,
  Atom
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const mockTopics = [
  {
    id: "1",
    title: "Algebra Fundamentals",
    description: "Master algebraic expressions, equations, inequalities, and graphing linear functions.",
    icon: <Calculator className="w-6 h-6" />,
  },
  {
    id: "2",
    title: "Geometry Basics",
    description: "Explore shapes, angles, theorems, and spatial reasoning with interactive proofs.",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: "3",
    title: "Chemistry Elements",
    description: "Discover the periodic table, chemical bonds, reactions, and molecular structures.",
    icon: <Beaker className="w-6 h-6" />,
  },
  {
    id: "4",
    title: "World Geography",
    description: "Study continents, countries, capitals, climate zones, and cultural landmarks.",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: "5",
    title: "English Literature",
    description: "Analyze classic novels, poetry, literary devices, and creative writing techniques.",
    icon: <Languages className="w-6 h-6" />,
  },
  {
    id: "6",
    title: "Physics Motion",
    description: "Understand velocity, acceleration, forces, energy, and Newton's laws of motion.",
    icon: <Atom className="w-6 h-6" />,
  },
];

function TopicCard({ title,id, description, icon,subid }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate()

  const handleAction = (action) => {
    console.log(`${action} clicked for ${title}`);
  };

  const onStudyClick = (topicId,topicname) => {
    navigate(`/notes/${subid}/${topicname}/${topicId}`);
  } 

  const onQuizClick = (topicId,topicname) => {
    navigate(`/quiz/${subid}/${topicname}/${topicId}`);
  }
  const onFlashClick = () => {
    navigate(`/flash`)
  }
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        borderLeft: "4px solid #0000FF",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        overflow: "visible",
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          padding: "32px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          textAlign: "left",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#ADD8E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#0000FF",
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px", fontFamily: "Poppins, sans-serif" }}>
            {title}
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>
        </div>

        <ChevronDown
          style={{
            width: "24px",
            height: "24px",
            color: "#6b7280",
            transition: "transform 0.3s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      <div
        style={{
          maxHeight: isExpanded ? "400px" : "0",
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div style={{ padding: "8px 32px 32px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ActionButton onClick={() => onStudyClick(id,title)} color="#6366F1" hoverColor="#4F46E5" icon={<BookOpen style={{ width: "20px", height: "20px" }} />} label="Study" />
            <ActionButton onClick={() => onQuizClick(id,title)} color="#FB923C" hoverColor="#F97316" icon={<FileText style={{ width: "20px", height: "20px" }} />} label="Quiz" />
            <ActionButton onClick={() => handleAction("MCQs")} color="#22C55E" hoverColor="#16A34A" icon={<ListChecks style={{ width: "20px", height: "20px" }} />} label="MCQs" />
            <ActionButton onClick={() => onFlashClick()} color="#F43F5E" hoverColor="#E11D48" icon={<Zap style={{ width: "20px", height: "20px" }} />} label="Flashcard" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, color, hoverColor, icon, label }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "56px",
        backgroundColor: isHovered ? hoverColor : color,
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: "14px",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        transition: "all 0.2s ease",
        boxShadow: isHovered ? "0 10px 15px -3px rgba(0, 0, 0, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function Paticular_Syllabus_page() {
  const [topics, setTopics] = useState([]);
  const [subject,setSubject] = useState("");
  const {id} = useParams()
  const {sub} = useParams()
  
  
  useEffect(()=>{
  const fetch = async() =>{
    try {
      setSubject(sub);
      const response = await axios.get(`http://localhost:3000/api/alltopics/${id}`);
      setTopics(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  fetch()
  },[id])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ADD8E6", fontFamily: "Inter, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#0000FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: "32px", height: "32px", color: "white" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#1a1a2e", margin: 0, fontFamily: "Poppins, sans-serif" }}>{subject}</h1>
              <p style={{ color: "#6b7280", marginTop: "4px", margin: 0 }}>Explore interactive topics and enhance your learning</p>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "768px", margin: "0 auto" }}>
          {topics.map((topic, index) => (
            <div key={topic._id} style={{ animation: `fadeInUp 0.5s ease ${index * 0.05}s both` }}>
              <TopicCard title={topic.topic_name} icon={<BookOpen className="w-6 h-6" />} id={topic._id} subid={id}/>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        button:focus { outline: 2px solid #0000FF; outline-offset: 2px; }
      `}</style>
    </div>
  );
}