import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Star, 
  Heart, 
  Target, 
  Calendar,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'wellness' | 'social' | 'journal' | 'mood' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  journalEntries: number;
  communityPosts: number;
  achievements: Achievement[];
  weeklyGoals: {
    moodTracking: { current: number; target: number };
    journaling: { current: number; target: number };
    communityEngagement: { current: number; target: number };
  };
}

interface GamificationPanelProps {
  userProfile: UserProfile;
}

const GamificationPanel = ({ userProfile }: GamificationPanelProps) => {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    level: 3,
    xp: 250,
    xpToNextLevel: 500,
    currentStreak: 7,
    longestStreak: 12,
    totalCheckIns: 23,
    journalEntries: 8,
    communityPosts: 2,
    achievements: [],
    weeklyGoals: {
      moodTracking: { current: 5, target: 7 },
      journaling: { current: 2, target: 3 },
      communityEngagement: { current: 1, target: 2 },
    }
  });

  useEffect(() => {
    // Load gamification data from localStorage
    const savedData = localStorage.getItem('mindful-you-gamification');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setGamificationData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    }

    // Initialize achievements
    initializeAchievements();
  }, []);

  const initializeAchievements = () => {
    const allAchievements: Achievement[] = [
      {
        id: 'first-checkin',
        title: 'First Step',
        description: 'Completed your first mood check-in',
        icon: '🌱',
        category: 'mood',
        rarity: 'common',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'week-streak',
        title: 'Consistency Champion',
        description: 'Maintained a 7-day check-in streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'rare',
        unlockedAt: new Date(),
      },
      {
        id: 'first-journal',
        title: 'Mindful Writer',
        description: 'Wrote your first journal entry',
        icon: '📝',
        category: 'journal',
        rarity: 'common',
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'community-helper',
        title: 'Caring Friend',
        description: 'Shared support with the community',
        icon: '🤝',
        category: 'social',
        rarity: 'rare',
      },
      {
        id: 'mood-master',
        title: 'Emotion Navigator',
        description: 'Tracked your mood for 30 days',
        icon: '🧭',
        category: 'mood',
        rarity: 'epic',
      },
      {
        id: 'wellness-guru',
        title: 'Wellness Guru',
        description: 'Reached level 10 in your wellness journey',
        icon: '🏆',
        category: 'wellness',
        rarity: 'legendary',
      },
    ];

    setGamificationData(prev => ({
      ...prev,
      achievements: allAchievements
    }));
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-muted text-muted-foreground';
      case 'rare': return 'bg-mood-calm/20 text-mood-calm border-mood-calm/30';
      case 'epic': return 'bg-accent/20 text-accent-bright border-accent/30';
      case 'legendary': return 'bg-gradient-warm text-primary border-primary/30';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'wellness': return <Zap className="w-4 h-4" />;
      case 'social': return <Heart className="w-4 h-4" />;
      case 'journal': return <Star className="w-4 h-4" />;
      case 'mood': return <Target className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
    }
  };

  const unlockedAchievements = gamificationData.achievements.filter(a => a.unlockedAt);
  const lockedAchievements = gamificationData.achievements.filter(a => !a.unlockedAt);

  const getPersonalizedEncouragement = () => {
    const messages = [
      "You're doing great! Keep up the momentum! 💪",
      "Every small step counts on your wellness journey 🌟",
      "Your consistency is inspiring! 🔥",
    ];

    // Age-appropriate encouragement
    if (userProfile.ageGroup === '13-15') {
      messages.push("You're building amazing habits at such a young age! 🌱");
    } else if (userProfile.ageGroup === '16-18') {
      messages.push("Balancing everything is tough, but you're crushing it! 🎯");
    } else {
      messages.push("Taking care of your mental health shows real maturity 🧠");
    }

    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Your Wellness Journey</h1>
        <p className="text-muted-foreground">
          Track your progress and celebrate your growth
        </p>
      </div>

      {/* Level & XP */}
      <Card className="shadow-gentle border-secondary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Level {gamificationData.level}</h3>
                <p className="text-sm text-muted-foreground">Wellness Explorer</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{gamificationData.xp} / {gamificationData.xpToNextLevel} XP</div>
              <div className="text-xs text-muted-foreground">to next level</div>
            </div>
          </div>
          <Progress 
            value={(gamificationData.xp / gamificationData.xpToNextLevel) * 100} 
            className="h-3"
          />
          <div className="mt-3 text-center text-sm text-muted-foreground">
            {getPersonalizedEncouragement()}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 bg-gradient-warm rounded-full mx-auto mb-2 flex items-center justify-center">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{gamificationData.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 bg-gradient-calm rounded-full mx-auto mb-2 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{gamificationData.totalCheckIns}</div>
            <div className="text-xs text-muted-foreground">Check-ins</div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-full mx-auto mb-2 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary">{gamificationData.journalEntries}</div>
            <div className="text-xs text-muted-foreground">Journal Entries</div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 bg-mood-happy/30 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Heart className="w-4 h-4 text-mood-happy" />
            </div>
            <div className="text-2xl font-bold text-primary">{gamificationData.communityPosts}</div>
            <div className="text-xs text-muted-foreground">Community Posts</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Target className="w-5 h-5 mr-2" />
            This Week's Goals
          </CardTitle>
          <CardDescription>
            Small, achievable goals to keep you moving forward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  Mood Tracking
                </span>
                <span className="text-muted-foreground">
                  {gamificationData.weeklyGoals.moodTracking.current} / {gamificationData.weeklyGoals.moodTracking.target}
                </span>
              </div>
              <Progress 
                value={(gamificationData.weeklyGoals.moodTracking.current / gamificationData.weeklyGoals.moodTracking.target) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Journaling
                </span>
                <span className="text-muted-foreground">
                  {gamificationData.weeklyGoals.journaling.current} / {gamificationData.weeklyGoals.journaling.target}
                </span>
              </div>
              <Progress 
                value={(gamificationData.weeklyGoals.journaling.current / gamificationData.weeklyGoals.journaling.target) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-primary" />
                  Community Engagement
                </span>
                <span className="text-muted-foreground">
                  {gamificationData.weeklyGoals.communityEngagement.current} / {gamificationData.weeklyGoals.communityEngagement.target}
                </span>
              </div>
              <Progress 
                value={(gamificationData.weeklyGoals.communityEngagement.current / gamificationData.weeklyGoals.communityEngagement.target) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
          <CardDescription>
            Celebrate your wellness milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Unlocked ({unlockedAchievements.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-gradient-calm/20 rounded-lg border border-secondary/30"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-sm text-primary">{achievement.title}</h5>
                        <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {getCategoryIcon(achievement.category)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 opacity-60">
                Locked ({lockedAchievements.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-border opacity-60"
                  >
                    <div className="text-2xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-sm text-muted-foreground">{achievement.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {getCategoryIcon(achievement.category)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPanel;