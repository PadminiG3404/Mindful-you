import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Heart, Smile, Frown, Meh, Angry, Zap } from "lucide-react";

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note?: string;
  timestamp: Date;
  triggers?: string[];
}

const moodOptions = [
  { name: "Happy", emoji: "😊", color: "mood-happy", icon: Smile },
  { name: "Calm", emoji: "😌", color: "mood-calm", icon: Heart },
  { name: "Anxious", emoji: "😰", color: "mood-anxious", icon: Zap },
  { name: "Sad", emoji: "😢", color: "mood-sad", icon: Frown },
  { name: "Stressed", emoji: "😤", color: "mood-stressed", icon: Angry },
  { name: "Neutral", emoji: "😐", color: "muted", icon: Meh },
];

const commonTriggers = [
  "School/Work", "Family", "Friends", "Social Media", "Health", "Money", "Future", "Relationships"
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Load mood history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindful-you-moods');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMoodHistory(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save mood history to localStorage
  const saveMoodHistory = (newHistory: MoodEntry[]) => {
    setMoodHistory(newHistory);
    localStorage.setItem('mindful-you-moods', JSON.stringify(newHistory));
  };

  const handleMoodSave = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity,
      note: note.trim() || undefined,
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
      timestamp: new Date(),
    };

    const newHistory = [newEntry, ...moodHistory];
    saveMoodHistory(newHistory);

    // Reset form
    setSelectedMood("");
    setIntensity(5);
    setNote("");
    setSelectedTriggers([]);
    setShowForm(false);
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const getMoodColor = (moodName: string) => {
    const mood = moodOptions.find(m => m.name === moodName);
    return mood?.color || "muted";
  };

  const getRecentMoodTrend = () => {
    if (moodHistory.length < 2) return null;
    
    const recent = moodHistory.slice(0, 5);
    const avgIntensity = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    
    return {
      average: Math.round(avgIntensity * 10) / 10,
      trend: recent[0].intensity > recent[recent.length - 1].intensity ? "up" : 
             recent[0].intensity < recent[recent.length - 1].intensity ? "down" : "stable"
    };
  };

  const trend = getRecentMoodTrend();

  return (
    <div className="space-y-6">
      {/* Quick Mood Check */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Heart className="w-5 h-5 mr-2" />
            How are you feeling right now?
          </CardTitle>
          <CardDescription>
            Take a moment to check in with yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <div className="grid grid-cols-3 gap-3">
              {moodOptions.map((mood) => {
                const MoodIcon = mood.icon;
                return (
                  <Button
                    key={mood.name}
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:shadow-gentle"
                    onClick={() => {
                      setSelectedMood(mood.name);
                      setShowForm(true);
                    }}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.name}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">
                  Feeling {selectedMood} {moodOptions.find(m => m.name === selectedMood)?.emoji}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Change
                </Button>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Intensity (1-10): <span className="font-medium text-foreground">{intensity}</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <Progress value={intensity * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  What might have triggered this feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonTriggers.map((trigger) => (
                    <Badge
                      key={trigger}
                      variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                      className="cursor-pointer hover:shadow-gentle"
                      onClick={() => toggleTrigger(trigger)}
                    >
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Any additional notes? (Optional)
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[80px] bg-background/50"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleMoodSave}
                  className="flex-1 bg-gradient-primary border-0 hover:opacity-90"
                >
                  Save Check-in
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Insights */}
      {trend && (
        <Card className="shadow-gentle border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <TrendingUp className="w-5 h-5 mr-2" />
              Your Recent Mood Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {trend.average}/10
                </div>
                <div className="text-sm text-muted-foreground">
                  Average intensity last 5 entries
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  trend.trend === 'up' ? 'text-mood-happy' :
                  trend.trend === 'down' ? 'text-mood-anxious' :
                  'text-muted-foreground'
                }`}>
                  {trend.trend === 'up' ? '↗ Trending up' :
                   trend.trend === 'down' ? '↘ Trending down' :
                   '→ Staying stable'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Mood History */}
      {moodHistory.length > 0 && (
        <Card className="shadow-gentle border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodHistory.slice(0, 5).map((entry) => {
                const moodOption = moodOptions.find(m => m.name === entry.mood);
                return (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <span className="text-2xl">{moodOption?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {entry.mood}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Intensity: {entry.intensity}/10
                      </div>
                      {entry.triggers && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.triggers.map((trigger) => (
                            <Badge key={trigger} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.note && (
                        <p className="text-sm text-foreground/80 mt-1 italic">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;