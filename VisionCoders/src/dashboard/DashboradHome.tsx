import GalaxyScene from '../galaxy/GalaxyScene';

export default function DashboardHome() {
    // TODO: Add stores when available
    const chatbots: any[] = [];
    const selectedBotId = null;
    const isLoadingChatbots = false;
    const user = null;

    const handlePlanetClick = (_botId: string) => {
        // TODO: Add setSelectedBot when available
    };

    return (
        <div className="relative w-full h-screen bg-[#0a0a0f]">
            {/* 3D Galaxy Scene */}
            <GalaxyScene
                chatbots={chatbots}
                onPlanetClick={handlePlanetClick}
                focusedPlanetId={selectedBotId || undefined}
            />

            {/* Loading State */}
            {isLoadingChatbots && chatbots.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white/70 text-sm">Loading your bots...</div>
                </div>
            )}

            {/* Empty State */}
            {!isLoadingChatbots && chatbots.length === 0 && user && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-2">
                        <p className="text-white/90 text-lg font-medium">No bots yet</p>
                        <p className="text-white/60 text-sm">Click the + button to create your first study bot!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
