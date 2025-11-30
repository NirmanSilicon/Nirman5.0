import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const Upload = () => {
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [preview, setPreview] = useState(null);
  const [preview2,setPreview2] = useState(null)
  const [image,setImage] = useState(null)
  const [image2,setImage2] = useState(null);
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    setImage2(file);
    if (file) setPreview2(URL.createObjectURL(file));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      setLoading(false)
      setTotalDays(3)
      formData.append("subject_name",subjectName);
      formData.append("exam_date",examDate);
      formData.append("study_hours_per_day",studyHours);
      formData.append("total_days",totalDays);
      formData.append("file",image);
      await axios.post(`http://localhost:3000/api/extractSyllabus`,formData,{headers:{"Content-Type":"multipart/form-data"}})
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(true)
      navigate("/dashboard");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-linear-to-br from-[#E9F4FF] to-[#D2E8FF] flex justify-center items-center p-6 mt-22">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl backdrop-blur-xl bg-white/40 border border-white/40 shadow-2xl rounded-3xl p-10"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-[#0000FF] text-center mb-6"
        >
          Upload Subject
        </motion.h1>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Subject Name */}
          <motion.input
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-[#ADD8E6] bg-white/70 backdrop-blur-md text-gray-800 focus:border-[#0000FF] focus:ring-2 ring-[#ADD8E6] outline-none transition placeholder:text-gray-500"
          />

          {/* Exam Date */}
          <motion.input
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-[#ADD8E6] bg-white/70 backdrop-blur-md text-gray-800 focus:border-[#0000FF] focus:ring-2 ring-[#ADD8E6] outline-none transition placeholder:text-gray-500"
          />

          {/* Study Hours per Day */}
          <motion.input
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            type="number"
            placeholder="Study Hours / Day"
            value={studyHours}
            onChange={(e) => setStudyHours(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-[#ADD8E6] bg-white/70 backdrop-blur-md text-gray-800 focus:border-[#0000FF] focus:ring-2 ring-[#ADD8E6] outline-none transition placeholder:text-gray-500"
          />

          {/* Total Days */}
        </div>

        {/* Upload Section */}
        <div className="mt-6">
          <label className="block font-semibold text-[#0000FF] mb-3 text-lg">
            Upload Syllabus Image
          </label>

          <motion.label
            whileHover={{ scale: 1.03 }}
            className="group relative border-2 border-dashed border-[#7FB9FF] rounded-2xl p-8 bg-white/60 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center transition shadow-lg hover:border-[#0000FF]"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-56 object-contain rounded-xl"
              />
            ) : (
              <>
                <FiUpload className="text-4xl text-[#0000FF] opacity-90 mb-3 group-hover:scale-110 transition" />
                <span className="text-gray-600">Click to upload image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </motion.label>
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-[#0000FF] mb-3 text-lg">
            Upload Notes Image
          </label>

          <motion.label
            whileHover={{ scale: 1.03 }}
            className="group relative border-2 border-dashed border-[#7FB9FF] rounded-2xl p-8 bg-white/60 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center transition shadow-lg hover:border-[#0000FF]"
          >
            {preview2 ? (
              <img
                src={preview2}
                alt="Preview"
                className="w-full h-56 object-contain rounded-xl"
              />
            ) : (
              <>
                <FiUpload className="text-4xl text-[#0000FF] opacity-90 mb-3 group-hover:scale-110 transition" />
                <span className="text-gray-600">Click to upload image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange2}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </motion.label>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full mt-8 py-3 rounded-2xl bg-[#0000FF] text-white font-bold shadow-xl hover:brightness-110 transition"
        >
          {loading ? "Save & Continue":"Creating Plan.."}
        </motion.button>
      </motion.div>
    </div>
    </>
  );
};

export default Upload;
