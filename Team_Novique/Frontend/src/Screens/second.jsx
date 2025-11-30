// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import LayersIcon from "@mui/icons-material/Layers";
// import QuizIcon from "@mui/icons-material/Quiz";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import Third from './Third';

// export default function Second() {
//   return (
//     <Box sx={{ backgroundColor: "#ADD8E6" }}>
//       {/* Features Section */}
//       <Box sx={{ textAlign: "center", py: 10 }}>
//         <Typography sx={{ fontSize: 48, fontWeight: "bold", mb: 1, color: "#0000FF" }}>
//           Powerful Features for Better Learning
//         </Typography>
//         <Typography sx={{ fontSize: 22, mb: 8, color: "#222" }}>
//           Everything you need to succeed in your studies
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: 4,
//             px: 4,
//           }}
//         >
//           {[
//             {
//               icon: <EventNoteIcon sx={{ fontSize: 55, color: "#f36b09" }} />,
//               title: "Auto Study Plan",
//               desc: "AI generates personalized study schedules based on your syllabus and exam dates.",
//             },
//             {
//               icon: <LayersIcon sx={{ fontSize: 55, color: "#e9e50d" }} />,
//               title: "AI Flashcards",
//               desc: "Automatically create flashcards from study materials for efficient learning.",
//             },
//             {
//               icon: <QuizIcon sx={{ fontSize: 55, color: "#0dde22" }} />,
//               title: "Smart Quizzes",
//               desc: "Adaptive quizzes that focus on weak areas to improve retention.",
//             },
//             {
//               icon: <TrendingUpIcon sx={{ fontSize: 55, color: "#e81515" }} />,
//               title: "Progress Tracking",
//               desc: "Detailed analytics to monitor your learning journey.",
//             },
//           ].map((item, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: 280,
//                 minHeight: 230,
//                 backgroundColor: "white",
//                 borderRadius: 4,
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 p: 3,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 transition: "0.3s",
//                 cursor: "pointer",
//                 "&:hover": {
//                   transform: "translateY(-6px)",
//                   boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//                 },
//               }}
//             >
//               {item.icon}
//               <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 2 }}>
//                 {item.title}
//               </Typography>
//               <Typography sx={{ fontSize: 15, mt: 1, color: "#444" }}>
//                 {item.desc}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* How It Works */}
//       <Box sx={{ textAlign: "center", py: 10 }}>
//         <Typography sx={{ fontSize: 48, fontWeight: "bold", mb: 1, color: "#0000FF" }}>
//           How It Works
//         </Typography>
//         <Typography sx={{ fontSize: 22, mb: 8, color: "#222" }}>
//           Get started in 4 simple steps
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: 4,
//             px: 4,
//           }}
//         >
//           {[
//             {
//               icon: <CloudUploadIcon sx={{ fontSize: 55, color: "#f36b09" }} />,
//               step: "Step 1",
//               title: "Upload Syllabus",
//               desc: "Upload your course syllabus or study materials.",
//             },
//             {
//               icon: <AutoAwesomeIcon sx={{ fontSize: 55, color: "#e9e50d" }} />,
//               step: "Step 2",
//               title: "Auto Plan",
//               desc: "AI creates your personalized study plan.",
//             },
//             {
//               icon: <MenuBookIcon sx={{ fontSize: 55, color: "#0dde22" }} />,
//               step: "Step 3",
//               title: "Learn",
//               desc: "Study with flashcards, quizzes & AI.",
//             },
//             {
//               icon: <CheckCircleIcon sx={{ fontSize: 55, color: "#e81515" }} />,
//               step: "Step 4",
//               title: "Track",
//               desc: "Monitor progress and celebrate achievements.",
//             },
//           ].map((item, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: 280,
//                 minHeight: 230,
//                 backgroundColor: "white",
//                 borderRadius: 4,
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 p: 3,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 transition: "0.3s",
//                 cursor: "pointer",
//                 "&:hover": {
//                   transform: "translateY(-6px)",
//                   boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//                 },
//               }}
//             >
//               {item.icon}
//               <Typography sx={{ fontSize: 14, color: "#666", mt: 1 }}>
//                 {item.step}
//               </Typography>
//               <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}>
//                 {item.title}
//               </Typography>
//               <Typography sx={{ fontSize: 15, mt: 1, color: "#444" }}>
//                 {item.desc}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       <Third />
//     </Box>
//   );
// }
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LayersIcon from "@mui/icons-material/Layers";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Third from "./Third";

import { motion } from "framer-motion";

export default function Second() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    show: {
      transition: { staggerChildren: 0.18 },
    },
  };

  return (
    <Box sx={{ backgroundColor: "#ADD8E6" }}>
      {/* ================= FEATURES SECTION ================= */}
      <Box sx={{ textAlign: "center", py: 10 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Typography sx={{ fontSize: 48, fontWeight: "bold", mb: 1, color: "#0000FF" }}>
            Powerful Features for Better Learning
          </Typography>
          <Typography sx={{ fontSize: 22, mb: 8, color: "#222" }}>
            Everything you need to succeed in your studies
          </Typography>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "32px",
            paddingInline: "32px",
          }}
        >
          {[
            {
              icon: <EventNoteIcon sx={{ fontSize: 55, color: "#f36b09" }} />,
              title: "Auto Study Plan",
              desc: "AI generates personalized study schedules based on your syllabus and exam dates.",
            },
            {
              icon: <LayersIcon sx={{ fontSize: 55, color: "#e9e50d" }} />,
              title: "AI Flashcards",
              desc: "Automatically create flashcards from study materials for efficient learning.",
            },
            {
              icon: <QuizIcon sx={{ fontSize: 55, color: "#0dde22" }} />,
              title: "Smart Quizzes",
              desc: "Adaptive quizzes that focus on weak areas to improve retention.",
            },
            {
              icon: <TrendingUpIcon sx={{ fontSize: 55, color: "#e81515" }} />,
              title: "Progress Tracking",
              desc: "Detailed analytics to monitor your learning journey.",
            },
          ].map((item, index) => (
            <motion.div key={index} variants={fadeUp} whileHover={{ scale: 1.05 }}>
              <Box
                sx={{
                  width: 280,
                  minHeight: 230,
                  backgroundColor: "white",
                  borderRadius: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 2 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: 15, mt: 1, color: "#444" }}>
                  {item.desc}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Box sx={{ textAlign: "center", py: 10 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Typography sx={{ fontSize: 48, fontWeight: "bold", mb: 1, color: "#0000FF" }}>
            How It Works
          </Typography>
          <Typography sx={{ fontSize: 22, mb: 8, color: "#222" }}>
            Get started in 4 simple steps
          </Typography>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "32px",
            paddingInline: "32px",
          }}
        >
          {[
            {
              icon: <CloudUploadIcon sx={{ fontSize: 55, color: "#f36b09" }} />,
              step: "Step 1",
              title: "Upload Syllabus",
              desc: "Upload your course syllabus or study materials.",
            },
            {
              icon: <AutoAwesomeIcon sx={{ fontSize: 55, color: "#e9e50d" }} />,
              step: "Step 2",
              title: "Auto Plan",
              desc: "AI creates your personalized study plan.",
            },
            {
              icon: <MenuBookIcon sx={{ fontSize: 55, color: "#0dde22" }} />,
              step: "Step 3",
              title: "Learn",
              desc: "Study with flashcards, quizzes & AI.",
            },
            {
              icon: <CheckCircleIcon sx={{ fontSize: 55, color: "#e81515" }} />,
              step: "Step 4",
              title: "Track",
              desc: "Monitor progress and celebrate achievements.",
            },
          ].map((item, index) => (
            <motion.div key={index} variants={fadeUp} whileHover={{ scale: 1.05 }}>
              <Box
                sx={{
                  width: 280,
                  minHeight: 230,
                  backgroundColor: "white",
                  borderRadius: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                <Typography sx={{ fontSize: 14, color: "#666", mt: 1 }}>
                  {item.step}
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: 15, mt: 1, color: "#444" }}>
                  {item.desc}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>

      <Third />
    </Box>
  );
}
