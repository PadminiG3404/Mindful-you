import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Mic, 
  MicOff, 
  Save, 
  Trash2, 
  Calendar,
  Heart,
  Smile,
  Frown,
  Meh,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'stressed' | 'neutral';
  date: Date;
  tags: string[];
  isPrivate: boolean;
  audioUrl?: string;
}

interface JournalPageProps {
  userProfile: UserProfile;
}

const JournalPage = ({ userProfile }: JournalPageProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    isPrivate: true,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [showNewEntry, setShowNewEntry] = useState(false);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('mindful-you-journal');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem('mindful-you-journal', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleSaveEntry = () => {
    if (!currentEntry.title?.trim() && !currentEntry.content?.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title || `Entry ${new Date().toLocaleDateString()}`,
      content: currentEntry.content || '',
      mood: currentEntry.mood || 'neutral',
      date: new Date(),
      tags: currentEntry.tags || [],
      isPrivate: currentEntry.isPrivate ?? true,
      audioUrl: currentEntry.audioUrl,
    };

    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);
    
    // Reset form
    setCurrentEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: [],
      isPrivate: true,
    });
    setShowNewEntry(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      saveEntries(updatedEntries);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In production, this would use Web Speech API or similar
    if (!isRecording) {
      // Start recording logic
      console.log('Starting voice recording...');
    } else {
      // Stop recording and process
      console.log('Stopping voice recording...');
      // Mock adding voice-to-text content
      setCurrentEntry(prev => ({
        ...prev,
        content: (prev.content || '') + '\n[Voice recording processed...]'
      }));
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-4 h-4 text-mood-happy" />;
      case 'calm': return <Heart className="w-4 h-4 text-mood-calm" />;
      case 'sad': return <Frown className="w-4 h-4 text-mood-sad" />;
      case 'anxious': return <Frown className="w-4 h-4 text-mood-anxious" />;
      case 'stressed': return <Frown className="w-4 h-4 text-mood-stressed" />;
      default: return <Meh className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const getPersonalizedPrompts = () => {
    const prompts = [
      "How are you feeling today?",
      "What's one thing you're grateful for?",
      "Describe a moment that made you smile recently.",
    ];

    // Age-appropriate prompts
    if (userProfile.ageGroup === '13-15') {
      prompts.push("What's happening at school that's on your mind?");
      prompts.push("How are things with your friends?");
    } else if (userProfile.ageGroup === '16-18') {
      prompts.push("What are you excited or worried about for the future?");
      prompts.push("How are you handling stress lately?");
    } else {
      prompts.push("What transitions or changes are you navigating?");
      prompts.push("How are you taking care of yourself?");
    }

    return prompts;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Personal Journal</h1>
        <p className="text-muted-foreground">
          A private space for your thoughts, feelings, and reflections
        </p>
      </div>

      {/* New Entry Button */}
      {!showNewEntry && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowNewEntry(true)}
            className="bg-gradient-primary border-0 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      )}

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="shadow-gentle border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <BookOpen className="w-5 h-5 mr-2" />
              New Journal Entry
            </CardTitle>
            <CardDescription>
              Express yourself freely in this safe space
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Give your entry a title (optional)"
              value={currentEntry.title || ''}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">How are you feeling?</span>
                <div className="flex space-x-2">
                  {['happy', 'calm', 'neutral', 'anxious', 'sad', 'stressed'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood as any }))}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentEntry.mood === mood 
                          ? 'bg-primary/10 border-primary' 
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {getMoodIcon(mood)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <Textarea
                placeholder="What's on your mind? Write freely about your thoughts, feelings, or experiences..."
                value={currentEntry.content || ''}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="min-h-[200px]"
              />
              {userProfile.interactionMode !== 'text' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceRecording}
                  className={`absolute bottom-3 right-3 ${isRecording ? 'bg-emergency/10 border-emergency' : ''}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {/* Writing prompts */}
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Need inspiration? Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {getPersonalizedPrompts().slice(0, 3).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentEntry(prev => ({ ...prev, content: prompt + '\n\n' }))}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowNewEntry(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEntry}
                disabled={!currentEntry.title?.trim() && !currentEntry.content?.trim()}
                className="bg-gradient-primary border-0 hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      {entries.length > 0 && (
        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className="px-3 py-2 rounded-md border border-border bg-background"
                >
                  <option value="all">All moods</option>
                  <option value="happy">Happy</option>
                  <option value="calm">Calm</option>
                  <option value="neutral">Neutral</option>
                  <option value="anxious">Anxious</option>
                  <option value="sad">Sad</option>
                  <option value="stressed">Stressed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 && entries.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No entries match your search criteria.
          </div>
        )}
        
        {filteredEntries.length === 0 && entries.length === 0 && !showNewEntry && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Start Your First Entry</h3>
            <p className="text-muted-foreground mb-4">
              Journaling can help you process emotions and track your mental wellness journey.
            </p>
            <Button
              onClick={() => setShowNewEntry(true)}
              className="bg-gradient-primary border-0 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Entry
            </Button>
          </div>
        )}

        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="shadow-gentle border-secondary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary flex items-center">
                  {getMoodIcon(entry.mood)}
                  <span className="ml-2">{entry.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {entry.date.toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-muted-foreground hover:text-emergency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;