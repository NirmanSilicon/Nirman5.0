import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import logo from "/Logo.jpeg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Analytics", path: "/analytics" },
    { label: "Upload", path: "/upload" },
    { label: "Reward", path: "/reward"},
    { label: "Preview" , path:"/study"}
  ];

  // Update indicator position based on active route
  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const rect = navRefs.current[activeIndex].getBoundingClientRect();
      setIndicatorStyle({
        left: navRefs.current[activeIndex].offsetLeft,
        width: rect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#FFFFFF",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 3,
          mx: 2,
          mt: 2,
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: 50,
                height: "auto",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: 26,
                fontWeight: 700,
                color: "#000",
                fontFamily: "Poppins"
              }}
            >
              EduMate
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ position: "relative", display: "flex", gap: 2 }}>
            {navItems.map((item, idx) => (
              <Button
                key={item.label}
                ref={el => (navRefs.current[idx] = el)}
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  color: "#000",
                  background: "transparent",
                  "&:hover": {
                    color: "#000",
                    background: "transparent",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Arrow indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                height: 4,
                borderRadius: 2,
                background: "linear-gradient(90deg, #ADD8E6, #0000FF)",
                transition: "all 0.3s ease",
                ...indicatorStyle,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
