import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Receipt, Users, TrendingUp, LogOut, Menu, X } from "lucide-react";
import { logout, getCurrentUser } from "../components/services/auth";

import TripDashboard from "../components/TripDashboard";
import ExpenseTracker from "../components/ExpenseTracker";
import MapView from "../components/MapView";

const Dashboard = () => {
    const navigate = useNavigate();

    // dynamic values
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("trips");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [activeTrips, setActiveTrips] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [savings, setSavings] = useState(0);

    const color = {
        blue: "text-blue-400",
        green: "text-green-400",
        purple: "text-purple-400",
        orange: "text-orange-400",
    };

    // 🔥 LOAD LOGGED USER INTO STATE
    useEffect(() => {
        const storedUser = getCurrentUser();
        setUser(storedUser);  // now Welcome, {user.name} will work
    }, []);

    // ================== BACKEND DATA FETCH ==================
    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch("http://localhost:8080/api/dashboard/stats");
                const data = await res.json();

                setActiveTrips(data.activeTrips);
                setTotalMembers(data.totalMembers);
                setTotalExpenses(data.totalExpenses);
                setSavings(data.savings);
            } catch (err) { console.log("Backend offline"); }
        }

        loadStats(); 
        const interval = setInterval(loadStats, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">

            {/* NAVBAR */}
            <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <div className="flex items-center gap-3">
                        <button className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? <X /> : <Menu />}
                        </button>

                        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                            <MapPin className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-xl text-white font-bold">Travira</h1>
                            <p className="text-xs text-gray-300">Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white hidden md:block">Welcome, {user?.name || "User"}</span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-2">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>


            {/* SIDEBAR + CONTENT (unchanged) */}
            <div className="flex">
                <aside className={`w-64 fixed md:sticky top-16 h-[calc(100vh-4rem)] bg-white/5 border-r border-white/10 p-6 space-y-2 transition-all duration-300 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

                    <button className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 
            ${activeTab === "trips" ? "bg-linear-to-r from-blue-500 to-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                        onClick={() => { setActiveTab("trips"); setSidebarOpen(false) }}><MapPin /> My Trips</button>

                    <button className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 
            ${activeTab === "expenses" ? "bg-linear-to-r from-blue-500 to-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                        onClick={() => { setActiveTab("expenses"); setSidebarOpen(false) }}><Receipt /> Expenses</button>

                    <button className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 
            ${activeTab === "map" ? "bg-linear-to-r from-blue-500 to-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                        onClick={() => { setActiveTab("map"); setSidebarOpen(false) }}><Users /> Live Map</button>

                    <button className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 
            ${activeTab === "analytics" ? "bg-linear-to-r from-blue-500 to-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                        onClick={() => { setActiveTab("analytics"); setSidebarOpen(false) }}><TrendingUp /> Analytics</button>
                </aside>


                <main className="flex-1 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                        <motion.div className="p-6 bg-white/10 border border-white/20 rounded-2xl" whileHover={{ scale: 1.05 }}>
                            <MapPin className={`w-10 h-10 ${color.blue} mb-3`} />
                            <div className="text-white text-3xl font-bold">{activeTrips}</div>
                            <p className="text-gray-400">Active Trips</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white/10 border border-white/20 rounded-2xl" whileHover={{ scale: 1.05 }}>
                            <Users className={`w-10 h-10 ${color.green} mb-3`} />
                            <div className="text-white text-3xl font-bold">{totalMembers}</div>
                            <p className="text-gray-400">Members</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white/10 border border-white/20 rounded-2xl" whileHover={{ scale: 1.05 }}>
                            <Receipt className={`w-10 h-10 ${color.purple} mb-3`} />
                            <div className="text-white text-3xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                            <p className="text-gray-400">Total Expenses</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white/10 border border-white/20 rounded-2xl" whileHover={{ scale: 1.05 }}>
                            <TrendingUp className={`w-10 h-10 ${color.orange} mb-3`} />
                            <div className="text-white text-3xl font-bold">₹{savings.toLocaleString()}</div>
                            <p className="text-gray-400">Savings</p>
                        </motion.div>
                    </div>

                    {activeTab === "trips" && <TripDashboard />}
                    {activeTab === "expenses" && <ExpenseTracker />}
                    {activeTab === "map" && <MapView />}

                    {activeTab === "analytics" && (
                        <div className="bg-white/10 border border-white/20 p-8 rounded-2xl text-center">
                            <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                            <h2 className="text-2xl text-white font-bold">Analytics Coming Soon</h2>
                            <p className="text-gray-400">Visualization, charts & AI insights incoming...</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
