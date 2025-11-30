
import React from 'react';
import main from '/Study2.jpeg';
import Box from '@mui/material/Box';
import Second from './second';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Box sx={{ height: "300vh", backgroundColor: "#ADD8E6", position: "relative" }}>

        {/* BACKGROUND ANIMATED BLOBS */}
        <motion.div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            filter: "blur(30px)",
            top: "12%",
            left: "10%",
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <motion.div
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "rgba(173,216,230,0.25)",
            filter: "blur(35px)",
            bottom: "15%",
            right: "12%",
            zIndex: 1,
          }}
          animate={{ y: [0, -25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* HERO SECTION */}
        <Box
          sx={{
            backgroundColor: "#0000FF",
            width: "100%",
            minHeight: "100vh",
            padding: { xs: "20px", md: "60px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
              width: "100%",
              maxWidth: "1300px",
            }}
          >

            {/* LEFT TEXT */}
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              style={{ maxWidth: "50%", zIndex: 3 }}
            >
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                style={{
                  fontSize: "3rem",
                  lineHeight: "1.2",
                  color: "white",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {["Welcome to EduMate", "— Study Smarter."].map((line, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    style={{
                      display: "block",
                      color: i === 1 ? "#ADD8E6" : "white",
                      fontWeight: i === 1 ? 500 : 700,
                    }}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                style={{
                  marginTop: "1.5rem",
                  fontSize: "1.25rem",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.85)",
                  maxWidth: "600px",
                }}
              >
                Your AI-powered companion for study plans, flashcards, quizzes & analytics.
              </motion.p>

              {/* BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>

                  {/* SHIMMER BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      position: "relative",
                      padding: "14px 32px",
                      borderRadius: "12px",
                      backgroundColor: "#ADD8E6",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      overflow: "hidden",
                    }}
                  >
                    <span>Start Learning</span>

                    <motion.div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent)",
                      }}
                      animate={{ left: ["-100%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </motion.button>

                  {/* OUTLINE BUTTON */}
                  {/* <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "14px 32px",
                      borderRadius: "12px",
                      border: "2px solid white",
                      backgroundColor: "transparent",
                      color: "white",
                      fontSize: "18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    Try Demo
                  </motion.button> */}
                </Box>
              </motion.div>
            </motion.div>

            {/* RIGHT IMAGE (FLOATING) */}
            <motion.img
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.2,
                y: { duration: 4, repeat: Infinity },
              }}
              src={main}
              alt="Dashboard Preview"
              style={{
                width: "45%",
                maxWidth: "550px",
                height: "auto",
                borderRadius: "15px",
                objectFit: "cover",
                boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
              }}
            />

          </Box>
        </Box>

        <Second />
      </Box>
    </>
  );
}
