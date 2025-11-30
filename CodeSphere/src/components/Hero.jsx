import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Receipt, Clock } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stats = [
        { icon: Users, label: 'Active Users', value: '10K+' },
        { icon: MapPin, label: 'Trips Tracked', value: '50K+' },
        { icon: Receipt, label: 'Expenses Managed', value: '₹2Cr+' },
        { icon: Clock, label: 'Time Saved', value: '100K hrs' }
    ];

    return (
        <section className="relative pt-32 pb-20 px-6">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center"
                    initial="initial"
                    animate="animate"
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-block bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-blue-400/30"
                        variants={fadeInUp}
                    >
                        <span className="text-blue-300 font-semibold">🏆 AI + Maps + FinTech Integration</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
                        variants={fadeInUp}
                    >
                        Smart Travel Tracking<br />& Expense Management
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                        variants={fadeInUp}
                    >
                        Track your trips in real-time, manage expenses with AI-powered OCR, and split costs automatically. All in one seamless platform.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={fadeInUp}
                    >
                        
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
                        >
                            View Demo
                        </button>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
                        variants={fadeInUp}
                    >
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                            >
                                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;