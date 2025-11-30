import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios'
import Navbar from '../components/Navbar';

const Analytics = () => {
  const [subjectStrength,setSubjectStrength] = useState([])
  const [allSubjects,setallSubjects] = useState([])
  const [subjectid,setSubjectid] = useState([])
  const [dayStrength,setDayStrength] = useState([])
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(null)

  useEffect(()=>{
    const fetch = async () =>{
      try {
        const res1 = await axios.get('http://localhost:3000/api/allSubjectAnalytics')
        const res2 = await axios.get('http://localhost:3000/api/allSubjects')
        setSubjectStrength(res1.data)
        setallSubjects(res2.data.map((sub) => sub.subject))
        setSubjectid(res2.data.map((sub) => sub.id))
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  },[])

  useEffect(()=>{
    const fetchProgress = async () =>{
      if(selectedSubjectIndex !== null && subjectid[selectedSubjectIndex]){
        try {
          const res = await axios.get(`http://localhost:3000/api/progress/${subjectid[selectedSubjectIndex]}`)
          setDayStrength(res.data.progress_summary)
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetchProgress()
  },[selectedSubjectIndex, subjectid])

  const completionData = [
    { name: 'Completed', value: 35, color: '#0000FF' },
    { name: 'In Progress', value: 10, color: '#ADD8E6' },
    { name: 'Not Started', value: 50, color: '#E5E7EB' },
  ];

  const stats = [
    { label: 'Study Streak', value: '15 days', change: '+3', trend: 'up' },
    { label: 'Total Study Time', value: '48.5 hrs', change: '+5.2', trend: 'up' },
    { label: 'Avg. Quiz Score', value: '82%', change: '+7', trend: 'up' },
    { label: 'Tasks Completed', value: '124', change: '0', trend: 'neutral' },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#ADD8E6]">
      <div className="max-w-7xl mx-auto px-8 py-8 mt-18">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2 font-bold">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600">Track your learning progress and insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6">
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="text-3xl text-gray-900 mb-2">{stat.value}</div>
              <div className="flex items-center gap-2">
                {stat.trend === 'up' && (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">{stat.change} this week</span>
                  </>
                )}
                {stat.trend === 'down' && (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">{stat.change} this week</span>
                  </>
                )}
                {stat.trend === 'neutral' && (
                  <>
                    <Minus className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">No change</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strength/Weakness Chart */}
          <div className="bg-white rounded-3xl p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Subject Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectStrength}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="subject_name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #0000FF',
                    borderRadius: '16px',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="average_depth_score" fill="#0000FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#0000FF] rounded"></div>
                <span className="text-sm text-gray-600">Strength Score</span>
              </div>
            </div>
          </div>

           <div className="bg-white rounded-3xl p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Overall Completion</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {completionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-sm text-gray-600">{item.name}</div>
                  <div className="text-sm text-gray-900">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        <div className=" gap-8">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-900">Weekly Study Time</h2>
              <select 
                value={selectedSubjectIndex ?? ''}
                onChange={(e) => {
                  const index = parseInt(e.target.value);
                  setSelectedSubjectIndex(index);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-[#0000FF]"
              >
                <option value="">Select Subject</option>
                {allSubjects.map((subject, index) => (
                  <option key={index} value={index}>{subject}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dayStrength}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis  stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #0000FF',
                    borderRadius: '16px',
                    padding: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_score" 
                  stroke="#0000FF" 
                  strokeWidth={3}
                  dot={{ fill: '#0000FF', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">Total this week</div>
              <div className="text-2xl text-gray-900">21 hours</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 mt-8">
          <h2 className="text-2xl text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Completed Quiz', subject: 'DAA2', score: '85%', time: '2 hours ago', color: '#0000FF' },
              { action: 'Studied Flashcards', subject: 'DAA2', score: '20 cards', time: '5 hours ago', color: '#4169E1' },
              { action: 'Completed Task', subject: 'Math', score: 'Lab Report', time: '1 day ago', color: '#1E90FF' },
              { action: 'Generated Study Plan', subject: 'Java', score: 'Next 2 weeks', time: '2 days ago', color: '#00BFFF' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#ADD8E6]/10 transition">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.action[0]}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.subject} • {activity.score}</div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Analytics