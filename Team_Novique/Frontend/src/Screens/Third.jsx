import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import p1 from "/p1.png";
import p2 from "/p2.png";

export default function Third() {
  const testimonials = [
    {
      img: p1,
      name: "Divakar",
      role: "College Student",
      text:
        "EduMate helped me organize my study schedule and I improved my grades by 20%!",
    },
    {
      img: p2,
      name: "Sree",
      role: "College Student",
      text:
        "Love the analytics feature! It shows me exactly where I need to focus my efforts.",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 10,
      }}
    >
      {/* Title */}
      <Typography
        sx={{ fontSize: 50, fontWeight: "bold", color: "#0000FF" }}
      >
        What Students Say
      </Typography>

      {/* Pill Accent */}
      <Box
        sx={{
          width: 100,
          height: 10,
          backgroundColor: "#0000FF",
          borderRadius: 20,
          mt: 1,
        }}
      ></Box>

      <Typography sx={{ fontSize: 22, opacity: 0.8, mt: 2 }}>
        Join thousands of successful students
      </Typography>

      {/* Testimonials */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 5,
          mt: 6,
        }}
      >
        {testimonials.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: 280,
              minHeight: 230,
              borderRadius: 4,
              padding: 3,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 12px 40px rgba(0, 0, 255, 0.25)",
              },
            }}
          >
            <Rating defaultValue={5} readOnly sx={{ mb: 1 }} />
            <Typography sx={{ fontSize: 16, mb: 2 }}>
              "{item.text}"
            </Typography>

            {/* Profile */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: 55,
                  height: 55,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />

              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                {item.name}
                <br />
                <span style={{ fontSize: 14, fontWeight: 400 }}>
                  {item.role}
                </span>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}