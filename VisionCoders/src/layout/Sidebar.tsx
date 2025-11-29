import { Plus, Settings, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useChatStore } from '../../store/useChatStore';
// import { calculateLevel } from '../../lib/xp-utils';

export default function Sidebar() {
    // const { user } = useAuthStore();
    // const { setUploadModalOpen, chatbots, setSelectedBot } = useChatStore();

    // Sort bots: first by creation date (newest first), then by level (highest first)
    // const sortedBots = [...chatbots].sort((a, b) => {
    //     const dateA = new Date(a.lastActivity).getTime();
    //     const dateB = new Date(b.lastActivity).getTime();

        // First sort by creation date (newest first)
        // if (dateB !== dateA) {
        //     return dateB - dateA;
        // }

        // Then sort by level (highest first)
        // const levelA = calculateLevel(a.xp);
        // const levelB = calculateLevel(b.xp);
        // return levelB - levelA;
    // });

    // const handleBotClick = (_botId: string) => {
    //     setSelectedBot(botId);
    // };

    return (
        <div className="w-[260px] h-screen bg-[#F7F8FA] flex flex-col border-r border-gray-200 font-sans">
            {/* Logo Section */}
            <div className="p-5 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">PDF-GPT</span>
            </div>

            {/* New Bot Button */}
            <div className="px-5 mt-1">
                <button
                    // onClick={() => setUploadModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Study Bot
                </button>
            </div>

            {/* Your Study Bots Section */}
            <div className="flex-1 overflow-y-auto px-3 py-6">
                <div className="px-2 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your Study Bots
                </div>

                {/* Empty State */}
                <div className="px-2 py-1 text-sm text-gray-400 italic">
                    No bots created yet.
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
                <Link to="/profile">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                            {/* {user?.email?.[0].toUpperCase() || 'S'} */}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                Student User
                            </p>
                            <p className="text-xs text-gray-500">Free Plan</p>
                        </div>
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
