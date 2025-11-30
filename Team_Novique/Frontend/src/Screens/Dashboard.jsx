import React, { useEffect, useState } from "react";
import {
  Flame,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  Circle,
} from "lucide-react";
import MonthlyCalendar from "../components/MonthlyCalendar";
import axios from "axios"
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const DashBoard = () => {
  const [allSubjects,setallSubjects] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    const fetch = async() => {
      try {
        const response = await axios.get("http://localhost:3000/api/allSubjectProgress")
        setallSubjects(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch();
  },[])
  const goToAnalytics = () => {
    navigate('/analytics');
  }
  const gotoSubjectPage = (id,sub) =>{
    navigate(`/paticular_Syllabus/${sub}/${id}/`);
  }
  const goToUploadPage = () =>{
    navigate('/upload');
  }
  const todaysTasks = [
    { id: 1, subject: "Mathematics", task: "Complete Calculus Chapter 5", completed: true },
    { id: 2, subject: "Physics", task: "Review Newton's Laws", completed: true },
    { id: 3, subject: "Chemistry", task: "Practice Organic Chemistry problems", completed: false },
    { id: 4, subject: "Biology", task: "Create flashcards for Cell Biology", completed: false },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#ADD8E6] px-8 py-8">
      <div className="max-w-7xl mx-auto mt-18">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* XP */}
          <div className="bg-white rounded-3xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0000FF] rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total XP</div>
              <div className="text-3xl text-gray-900">2,450</div>
              <div className="text-sm text-[#0000FF]">Level 12</div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-3xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Study Streak</div>
              <div className="text-3xl text-gray-900">15 Days</div>
              <div className="text-sm text-orange-600">Keep it up!</div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-3xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Badges Earned</div>
              <div className="text-3xl text-gray-900">8</div>
              <div className="text-sm text-yellow-600">View all</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* Welcome Banner */}
            <div className="bg-linear-to-r from-[#0000FF] to-[#4169E1] rounded-3xl p-8 text-white relative overflow-hidden mt-7">
              <div className="absolute top-0 right-0 opacity-20">
                <BookOpen className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h1 className="text-3xl mb-2">Welcome back! 👋</h1>
                <p className="text-white/90 mb-4">You're doing great! Let's continue your learning journey.</p>

                <button className="px-6 py-3 bg-white text-[#0000FF] rounded-2xl hover:bg-gray-100 transition" onClick={() => goToAnalytics()}>
                  View Analytics
                </button>
              </div>
            </div>
            {/* Tasks */}
            <div className="bg-white rounded-3xl p-8 mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Today's Tasks</h2>
                <span className="text-sm text-gray-600">
                  {todaysTasks.filter((t) => t.completed).length} of {todaysTasks.length} completed
                </span>
              </div>

              <div className="space-y-4">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#ADD8E6]/20 transition cursor-pointer">
                    <button className="shrink-0">
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className={`${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {task.task}
                      </div>
                      <div className="text-sm text-gray-500">{task.subject}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-[#0000FF] text-[#0000FF] rounded-2xl hover:bg-[#0000FF] hover:text-white transition">
                Add New Task
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6 h-auto">
            <div className="bg-white rounded-3xl p-9 text-center mt-9">
              <div className="w-24 h-24 rounded-full mx-auto bg-gray-400 mb-4">
              <img src="/p1.png" className="rounded-full"/>
                </div>
              <h3 className="text-xl font-semibold">Amrut</h3>
              <p className="text-gray-500 text-sm">Student</p>
            </div>
            <div className="mt-15">
              <MonthlyCalendar/>
            </div>
          </div>
        </div>
        {/* Subject */}
        <div className="bg-white rounded-3xl p-8 mt-8 w-11/12 ms-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Your Subjects</h2>
                <button className="text-sm text-[#0000FF] hover:underline" onClick={()=> goToUploadPage()}>Add Subject</button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {allSubjects.map((subject) => (
                  <button key={subject.subject} className="p-6 rounded-2xl border-2 border-gray-200 hover:border-[#0000FF] transition text-left" onClick={() => gotoSubjectPage(subject.id,subject.subject)}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl"></span>

                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold text-[20px]">{subject.subject}</div>
                        <div className="text-sm text-gray-500">{Math.round(subject.progress)}% complete</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${subject.progress}%`, backgroundColor: "#0000FF" }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
      </div>
    </div>
    </>
  );
};

export default DashBoard;
