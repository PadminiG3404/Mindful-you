import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Mic,
  MicOff,
  Heart,
  AlertCircle,
  Smile,
  Wind,
  Notebook,
  Music,
  Sparkles,
  Sun,
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  mood?: string;
}

interface ChatInterfaceProps {
  userProfile: UserProfile;
  onEmergency: () => void;
  onSaveToJournal?: (text: string) => void;
}

const ChatInterface = ({
  userProfile,
  onEmergency,
  onSaveToJournal,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gemini API key from .env
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Crisis detection patterns
  const crisisPatterns = [
    "hurt myself",
    "suicide",
    "suicidal",
    "end it all",
    "kill myself",
    "better off dead",
    "give up",
    "self harm",
    "overdose",
    "end my life",
  ];

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: getWelcomeMessage(userProfile),
      sender: "assistant",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getWelcomeMessage = (profile: UserProfile) => {
    const pronoun = profile.pronouns ? ` (${profile.pronouns})` : "";
    let base = "Hi! I’m here to listen and support you.";
    if (profile.ageGroup === "16-18")
      base = "Hey! High school can be tough, but I’m here to listen.";
    if (profile.ageGroup === "18-24")
      base = "Hello! Life transitions can be overwhelming — I’m here with you.";
    let tone =
      profile.tonePreference === "gentle"
        ? "I’ll keep things gentle and kind."
        : profile.tonePreference === "direct"
        ? "I’ll be clear and straightforward."
        : "I’ll coach you through challenges.";
    return `${base} ${tone} How are you feeling today?${pronoun}`;
  };

  // Local supportive responses
  const localResponse = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();
    const isCrisis = crisisPatterns.some((pattern) =>
      lowerMessage.includes(pattern)
    );
    if (isCrisis) {
      onEmergency();
      return "I’m really concerned about your safety. If you’re in immediate danger, please call 911 or text HOME to 741741. You are not alone — would you like me to share crisis resources now?";
    }

    if (lowerMessage.includes("anxious"))
      return "I hear your anxiety. Let’s try this: breathe in for 4, hold for 4, out for 6. Want me to guide you?";
    if (lowerMessage.includes("stressed"))
      return "Stress can feel heavy. What’s one small thing you could do in the next 10 minutes to ease it?";
    if (lowerMessage.includes("lonely"))
      return "Feeling lonely is really tough. I want you to know I’m here with you right now.";
    if (lowerMessage.includes("sad") || lowerMessage.includes("down"))
      return "I can feel the sadness in your words. Thank you for sharing. What’s been the hardest part of your day?";
    if (lowerMessage.includes("good") || lowerMessage.includes("happy"))
      return "That’s wonderful! 🌟 What’s making you feel this way? Let’s celebrate it.";

    return null;
  };

  // Call Gemini API
  const fetchGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
          }),
        }
      );
      const data = await res.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I hear you — thank you for sharing that. Can you tell me more?"
      );
    } catch (err) {
      console.error("Gemini API error:", err);
      return "I’m here with you. Even if I can’t respond perfectly right now, you’re not alone.";
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowQuickActions(false);

    setIsTyping(true);

    // First check local fallback
    const local = localResponse(userMessage.content);
    if (local) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: local,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      return;
    }

    // Otherwise call Gemini
    const geminiText = await fetchGeminiResponse(userMessage.content);
    const aiResponse: Message = {
      id: (Date.now() + 2).toString(),
      content: geminiText,
      sender: "assistant",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickAction = (text: string) => {
    setInputValue(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
      {/* Emergency Button */}
      <div className="p-4 border-b border-border/50">
        <Button
          onClick={onEmergency}
          variant="outline"
          size="sm"
          className="w-full text-emergency border-emergency/30 hover:bg-emergency/10"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Need Immediate Help?
        </Button>
      </div>

      {/* Welcome & Info Section (only show at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pt-4 space-y-3">
          <Card className="p-4 shadow-gentle bg-gradient-to-r from-blue-50 to-indigo-50 border border-border/40">
            <h2 className="text-base font-semibold">
              Welcome, {userProfile.name || "Friend"}{" "}
              {userProfile.pronouns && `(${userProfile.pronouns})`} 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This is your safe space. You can share freely — I’m here to listen
              and support you.
            </p>
          </Card>

          <Card className="p-4 shadow-sm bg-card/70">
            <h3 className="text-sm font-medium mb-1">💡 Wellness Tip</h3>
            <p className="text-xs text-muted-foreground">
              Take a slow deep breath: in for 4 counts, hold for 4, out for 6.
              Try this 3 times — it helps calm your nervous system.
            </p>
          </Card>

          <Card className="p-4 shadow-sm bg-background/80 border border-border/40">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                All your chats here are private and secure 💙
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Card
              onClick={() => handleQuickAction("I want to reflect in my journal")}
              className="p-3 text-sm text-center cursor-pointer hover:bg-accent/10 transition rounded-xl"
            >
              📓 Journal Reflection
            </Card>
            <Card
              onClick={() => handleQuickAction("Can you check in on my mood?")}
              className="p-3 text-sm text-center cursor-pointer hover:bg-accent/10 transition rounded-xl"
            >
              😊 Mood Check-In
            </Card>
            <Card
              onClick={() =>
                handleQuickAction("Guide me through a grounding exercise")
              }
              className="p-3 text-sm text-center cursor-pointer hover:bg-accent/10 transition rounded-xl"
            >
              🌍 Grounding Exercise
            </Card>
            <Card
              onClick={() => handleQuickAction("Play some calming sounds for me")}
              className="p-3 text-sm text-center cursor-pointer hover:bg-accent/10 transition rounded-xl"
            >
              🎶 Calming Sounds
            </Card>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex space-x-3 max-w-[80%] ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback
                  className={
                    message.sender === "user"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/30 text-secondary-foreground"
                  }
                >
                  {message.sender === "user"
                    ? userProfile.pronouns?.charAt(0)?.toUpperCase() || "U"
                    : <Heart className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`p-3 shadow-gentle transition-all ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-secondary/20"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="mt-1 text-xs opacity-70 flex items-center">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {message.sender === "assistant" && onSaveToJournal && (
                    <Button
                      size="xs"
                      variant="ghost"
                      className="ml-2 text-[10px] underline"
                      onClick={() => onSaveToJournal(message.content)}
                    >
                      Save to Journal
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-150">●</span>
            <span className="animate-bounce delay-300">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Extra Tools */}
      <div className="flex justify-around border-t border-border/50 bg-background/30 py-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSaveToJournal?.("Reflection: ")}
        >
          <Notebook className="w-4 h-4 mr-1" /> Journal
        </Button>
        <Button size="sm" variant="ghost">
          <Music className="w-4 h-4 mr-1" /> Calming Music
        </Button>
        <Button size="sm" variant="ghost">
          <Wind className="w-4 h-4 mr-1" /> Breathing
        </Button>
        <Button size="sm" variant="ghost">
          <Sparkles className="w-4 h-4 mr-1" /> Affirmation
        </Button>
        <Button size="sm" variant="ghost">
          <Sun className="w-4 h-4 mr-1" /> Gratitude
        </Button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what’s on your mind..."
              className="pr-12 bg-background border-border/50 focus:border-primary/50"
            />
          </div>
          <Button
            onClick={() => setIsListening(!isListening)}
            variant="outline"
            size="icon"
            className={isListening ? "bg-accent text-accent-foreground" : ""}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-primary border-0 hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Your conversations are private and secure 💙
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
