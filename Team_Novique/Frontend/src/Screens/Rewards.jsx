import { Star, Flame, Trophy, Target, Zap, Award, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

export function Rewards({ onNavigate }) {

  const xpLevel = {
    current: 2450,
    required: 3000,
    level: 12,
    percentage: (2450 / 3000) * 100
  };

  const streakData = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'Th', completed: true },
    { day: 'F', completed: true },
    { day: 'Sa', completed: true },
    { day: 'Su', completed: true },
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'Th', completed: true },
    { day: 'F', completed: true },
    { day: 'Sa', completed: true },
    { day: 'Su', completed: true },
    { day: 'M', completed: true },
    { day: 'T', completed: false },
    { day: 'W', completed: false },
    { day: 'Th', completed: false },
    { day: 'F', completed: false },
    { day: 'Sa', completed: false },
    { day: 'Su', completed: false },
  ];

  const badges = [
    { id: 1, name: 'Flashcard Master', description: 'Mastered 100 flashcards', icon: '🎯', earned: true, color: '#0000FF', earnedDate: 'Nov 10, 2025' },
    { id: 2, name: 'Quiz King', description: 'Scored 100% on 5 quizzes', icon: '👑', earned: true, color: '#FFD700', earnedDate: 'Nov 15, 2025' },
    { id: 3, name: 'Study Beast', description: 'Study for 7 days straight', icon: '🔥', earned: true, color: '#FF4500', earnedDate: 'Nov 12, 2025' },
    { id: 4, name: 'Early Bird', description: 'Study before 8 AM for 5 days', icon: '🌅', earned: true, color: '#FFA500', earnedDate: 'Nov 8, 2025' },
    { id: 5, name: 'Night Owl', description: 'Study after 10 PM for 5 days', icon: '🦉', earned: true, color: '#4B0082', earnedDate: 'Nov 14, 2025' },
    { id: 6, name: 'Speed Learner', description: 'Complete 10 topics in a week', icon: '⚡', earned: true, color: '#FFFF00', earnedDate: 'Nov 16, 2025' },
    { id: 7, name: 'Perfect Score', description: 'Get 100% on a difficult quiz', icon: '💯', earned: true, color: '#00FF00', earnedDate: 'Nov 18, 2025' },
    { id: 8, name: 'Dedicated Scholar', description: 'Study for 30 days straight', icon: '📚', earned: true, color: '#8B4513', earnedDate: 'Nov 5, 2025' },
    { id: 9, name: 'Marathon Learner', description: 'Study for 5+ hours in one day', icon: '🏃', earned: false, color: '#808080', earnedDate: '' },
    { id: 10, name: 'Social Butterfly', description: 'Help 10 peers in AI chat', icon: '🦋', earned: false, color: '#808080', earnedDate: '' },
    { id: 11, name: 'Grand Master', description: 'Reach Level 20', icon: '🏆', earned: false, color: '#808080', earnedDate: '' },
    { id: 12, name: 'Century Club', description: 'Complete 100 quizzes', icon: '💪', earned: false, color: '#808080', earnedDate: '' },
  ];

  const milestones = [
    { xp: 500, label: 'Beginner', achieved: true },
    { xp: 1000, label: 'Novice', achieved: true },
    { xp: 2000, label: 'Intermediate', achieved: true },
    { xp: 3000, label: 'Advanced', achieved: false },
    { xp: 5000, label: 'Expert', achieved: false },
    { xp: 10000, label: 'Master', achieved: false },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen mt-15 bg-[#ADD8E6]">
        

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Rewards & Achievements</h1>
          <p className="text-xl text-gray-600">Track your progress and celebrate your wins</p>
        </div>

        {/* XP LEVEL CARD */}
        <div className="bg-linear-to-r from-[#0000FF] to-[#4169E1] rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-white/80 mb-2">Current Level</div>
              <div className="text-5xl mb-2">Level {xpLevel.level}</div>
              <div className="text-white/90">{xpLevel.current.toLocaleString()} / {xpLevel.required.toLocaleString()} XP</div>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Star className="w-16 h-16 mx-auto mb-2" />
                <div className="text-sm">Level {xpLevel.level}</div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/30 rounded-full h-4">
            <div 
              className="h-4 bg-white rounded-full transition-all"
              style={{ width: `${xpLevel.percentage}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-1">550</div>
              <div className="text-sm text-white/80">XP to next level</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-1">8</div>
              <div className="text-sm text-white/80">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-1">15</div>
              <div className="text-sm text-white/80">Day Streak</div>
            </div>
          </div>
        </div>

        {/* STREAK CALENDAR */}
        <div className="bg-white rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Study Streak</h2>
              <p className="text-gray-600">Keep your streak alive by studying every day!</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-linear-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">15 Days</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {streakData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                <div className={`aspect-square rounded-2xl flex items-center justify-center ${
                  day.completed 
                    ? 'bg-[#0000FF] text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {day.completed && <Flame className="w-5 h-5" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BADGES */}
        <div className="bg-white rounded-3xl p-8 mb-8">
          <h2 className="text-2xl text-gray-900 mb-6">Badges</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-6 rounded-3xl text-center transition ${
                  badge.earned 
                    ? 'bg-linear-to-br from-[#ADD8E6]/30 to-[#ADD8E6]/10 border-2 border-[#0000FF]' 
                    : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                }`}
              >
                <div className="relative inline-block mb-4">
                  <div 
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                      badge.earned ? '' : 'grayscale'
                    }`}
                    style={{ 
                      backgroundColor: badge.earned ? badge.color : '#E5E7EB',
                      opacity: badge.earned ? 1 : 0.5
                    }}
                  >
                    {badge.earned ? badge.icon : <Lock className="w-8 h-8 text-gray-400" />}
                  </div>
                  {badge.earned && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-gray-900 mb-1">{badge.name}</div>
                <div className="text-sm text-gray-600 mb-2">{badge.description}</div>
                {badge.earned && (
                  <div className="text-xs text-[#0000FF]">Earned {badge.earnedDate}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MILESTONES */}
        {/* ... Keep the same milestones JSX as above ... */}
        <div className="bg-white rounded-3xl p-8">
          <h2 className="text-2xl text-gray-900 mb-6">XP Milestones</h2>
          
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-center gap-6">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.achieved 
                      ? 'bg-[#0000FF]' 
                      : 'bg-gray-200'
                  }`}>
                    {milestone.achieved ? (
                      <Trophy className="w-6 h-6 text-white" />
                    ) : (
                      <Target className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg text-gray-900">{milestone.label}</div>
                        <div className="text-sm text-gray-600">{milestone.xp.toLocaleString()} XP</div>
                      </div>
                      {milestone.achieved ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm">
                          Achieved
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
