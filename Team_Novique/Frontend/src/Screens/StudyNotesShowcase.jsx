// import React from "react";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { BookOpen, HelpCircle } from "lucide-react";

// // Proxy sample notes
// const sampleNotes = [
//   {
//     date: "Nov 28, 2025 • 7:45 PM",
//     studied: "Learned about Binary Search Trees and implemented insert + traversal.",
//     confusion: "Got confused between inorder vs preorder use cases during real-world scenarios.",
//   },
//   {
//     date: "Nov 27, 2025 • 9:10 PM",
//     studied: "Completed UI layout for Flashcard page and added animation.",
//     confusion: "How to keep text stable while flipping the card without mirroring?",
//   },
//   {
//     date: "Nov 26, 2025 • 5:22 PM",
//     studied: "Revised Express.js middleware and built custom authentication flow.",
//     confusion: "Unsure about difference between middleware order and route-level middleware priority.",
//   },
//   {
//     date: "Nov 25, 2025 • 8:34 PM",
//     studied: "Watched Kotlin coroutines video & practiced async flows.",
//     confusion: "Difference between suspend vs coroutineScope still confusing.",
//   },
//   {
//     date: "Nov 24, 2025 • 6:18 PM",
//     studied: "Created MongoDB aggregation pipeline for analytics dashboard.",
//     confusion: "Struggling to choose between lookup vs nested population.",
//   },
// ];

// export default function StudyNotesShowcase() {
//   return (
//     <div className="min-h-screen bg-white p-10 flex flex-col items-center">
//       <h1 className="text-4xl font-extrabold text-[#0000ff] mb-10 tracking-tight">Study Journal Grid</h1>

//       {/* GRID LAYOUT */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
//         {sampleNotes.map((entry, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.25, delay: idx * 0.05 }}
//           >
//             <Card className="shadow-lg rounded-3xl border border-[#ADD8E6] bg-[#fafdff] hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
//               <CardContent className="p-6">
//                 {/* Date */}
//                 <p className="text-sm text-gray-500 mb-4">{entry.date}</p>

//                 {/* Studied Section */}
//                 <div className="flex items-start gap-3 mb-4">
//                   <BookOpen className="text-[#0000ff]" />
//                   <div>
//                     <h2 className="font-bold text-[#0000ff] text-lg">What I Studied</h2>
//                     <p className="text-gray-700 mt-1 leading-relaxed text-sm">{entry.studied}</p>
//                   </div>
//                 </div>

//                 {/* Confusion Section */}
//                 <div className="flex items-start gap-3">
//                   <HelpCircle className="text-[#0000ff]" />
//                   <div>
//                     <h2 className="font-bold text-[#0000ff] text-lg">My Confusions</h2>
//                     <p className="text-gray-700 mt-1 leading-relaxed text-sm">{entry.confusion}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";

// Proxy sample notes
const sampleNotes = [
  {
    date: "Nov 28, 2025 • 7:45 PM",
    studied: "Learned about Binary Search Trees and implemented insert + traversal.",
    confusion: "Got confused between inorder vs preorder use cases during real-world scenarios.",
  },
  {
    date: "Nov 27, 2025 • 9:10 PM",
    studied: "Completed UI layout for Flashcard page and added animation.",
    confusion: "How to keep text stable while flipping the card without mirroring?",
  },
  {
    date: "Nov 26, 2025 • 5:22 PM",
    studied: "Revised Express.js middleware and built custom authentication flow.",
    confusion: "Unsure about difference between middleware order and route-level middleware priority.",
  },
  {
    date: "Nov 25, 2025 • 8:34 PM",
    studied: "Watched Kotlin coroutines video & practiced async flows.",
    confusion: "Difference between suspend vs coroutineScope still confusing.",
  },
  {
    date: "Nov 24, 2025 • 6:18 PM",
    studied: "Created MongoDB aggregation pipeline for analytics dashboard.",
    confusion: "Struggling to choose between lookup vs nested population.",
  },
];

export default function StudyNotesShowcase() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white p-10 mt-15 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-[#0000ff] mb-10 tracking-tight">Study Journal Grid</h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {sampleNotes.map((entry, idx) => (
            <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
            <div className="shadow-lg rounded-3xl border border-[#ADD8E6] bg-[#fafdff] hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 p-6">
              {/* Date */}
              <p className="text-sm text-gray-500 mb-4">{entry.date}</p>

              {/* Studied Section */}
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="text-[#0000ff]" />
                <div>
                  <h2 className="font-bold text-[#0000ff] text-lg">What I Studied</h2>
                  <p className="text-gray-700 mt-1 leading-relaxed text-sm">{entry.studied}</p>
                </div>
              </div>

              {/* Confusion Section */}
              <div className="flex items-start gap-3">
                <HelpCircle className="text-[#0000ff]" />
                <div>
                  <h2 className="font-bold text-[#0000ff] text-lg">My Confusions</h2>
                  <p className="text-gray-700 mt-1 leading-relaxed text-sm">{entry.confusion}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
        </>
  );
}