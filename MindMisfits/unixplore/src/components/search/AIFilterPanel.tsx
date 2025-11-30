'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIFilterPanelProps {
    onFilter: (keywords: string[]) => void;
    onReset: () => void;
}

export function AIFilterPanel({ onFilter, onReset }: AIFilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        setIsAnalyzing(true);

        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple keyword extraction logic (Simulated AI)
        const text = input.toLowerCase();
        const keywords: string[] = [];

        // Technical mappings
        if (text.match(/code|coding|program|hack|tech|robot|software|app|web|developer|computer/)) {
            keywords.push('technical');
        }

        // Cultural mappings
        if (text.match(/dance|music|sing|art|drama|act|paint|draw|culture|festival|perform/)) {
            keywords.push('cultural');
        }

        // Sports mappings
        if (text.match(/sport|game|play|ball|cricket|football|badminton|tennis|run|athlete|fitness/)) {
            keywords.push('sports');
        }

        // Media mappings
        if (text.match(/photo|video|camera|edit|film|media|news|write|content|design/)) {
            keywords.push('media');
        }

        // Social mappings
        if (text.match(/social|help|volunteer|ngo|service|community|people|connect/)) {
            keywords.push('social');
        }

        setActiveTags(keywords);
        onFilter(keywords);
        setIsAnalyzing(false);
    };

    const handleReset = () => {
        setInput('');
        setActiveTags([]);
        onReset();
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-center"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 rounded-full px-8 py-6 h-auto text-lg font-medium transition-all hover:scale-105"
                        >
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            Find Clubs with AI
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-400" />
                                    AI Club Recommender
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="relative mb-4">
                                <Textarea
                                    placeholder="Describe what you're looking for... (e.g., 'I want to join a coding club' or 'I love dancing and music')"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="bg-black/20 border-white/10 focus:border-purple-500/50 min-h-[100px] text-white placeholder:text-gray-500 resize-none rounded-xl"
                                />
                                <div className="absolute bottom-3 right-3">
                                    <Button
                                        size="sm"
                                        onClick={handleAnalyze}
                                        disabled={!input.trim() || isAnalyzing}
                                        className={`bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all ${isAnalyzing ? 'opacity-80' : ''}`}
                                    >
                                        {isAnalyzing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </span>
                                        ) : (
                                            <>
                                                Analyze <Send className="ml-2 h-3 w-3" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {activeTags.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 flex-wrap"
                                >
                                    <span className="text-sm text-gray-400">Found categories:</span>
                                    {activeTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm capitalize"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={handleReset}
                                        className="text-gray-400 hover:text-white ml-auto h-auto p-0"
                                    >
                                        Clear Filter
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
