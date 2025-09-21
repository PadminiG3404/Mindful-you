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
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  userProfile: UserProfile;
  onEmergency: () => void;
  onSaveToJournal?: (text: string) => void;
}

const ChatInterface = ({ userProfile, onEmergency, onSaveToJournal }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gemini 2.5 Flash
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_MODEL = "gemini-2.5-flash";

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

    const tone =
      profile.tonePreference === "gentle"
        ? "I’ll keep things gentle and kind."
        : profile.tonePreference === "direct"
        ? "I’ll be clear and straightforward."
        : "I’ll coach you through challenges.";

    return `${base} ${tone} How are you feeling today?${pronoun}`;
  };

  const fetchGeminiResponse = async (userMessage: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is missing!");
    return "Sorry, I couldn’t generate a response right now. Let’s try again.";
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateText?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          temperature: 0.7,
          candidate_count: 1,
          max_output_tokens: 300,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API response error:", errorText);
      return "Sorry, I couldn’t generate a response right now. Let’s try again.";
    }

    const data = await res.json();
    console.log("Gemini API response:", data);

    // Try to extract text safely
    const aiText =
      data?.candidates?.[0]?.output?.[0]?.content ||
      data?.text ||
      "I hear you — thank you for sharing that. Can you tell me more?";

    return aiText;
  } catch (err) {
    console.error("Gemini API fetch error:", err);
    return "Sorry, something went wrong with the AI response. Let’s continue our chat!";
  }
};


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const aiText = await fetchGeminiResponse(userMessage.content);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiText,
      sender: "assistant",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);

    if (onSaveToJournal) onSaveToJournal(aiText);
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

      {/* Intro Section */}
      {messages.length === 1 && (
        <div className="px-4 pt-4 space-y-3">
          <Card className="p-4 shadow-gentle bg-gradient-to-r from-blue-50 to-indigo-50 border border-border/40">
            <h2 className="text-base font-semibold">
              Welcome, {userProfile.name || "Friend"} {userProfile.pronouns && `(${userProfile.pronouns})`} 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This is your safe space. You can share freely — I’m here to listen and support you.
            </p>
          </Card>

          <Card className="p-4 shadow-sm bg-card/70">
            <h3 className="text-sm font-medium mb-1">💡 Wellness Tip</h3>
            <p className="text-xs text-muted-foreground">
              Take a slow deep breath: in for 4 counts, hold for 4, out for 6. Try this 3 times — it helps calm your nervous system.
            </p>
          </Card>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={message.sender === "user" ? "bg-primary/10 text-primary" : "bg-secondary/30 text-secondary-foreground"}>
                  {message.sender === "user" ? userProfile.pronouns?.charAt(0)?.toUpperCase() || "U" : <Heart className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>

              <Card className={`p-3 shadow-gentle transition-all ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border-secondary/20"}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
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

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what’s on your mind..."
            />
          </div>
          <Button onClick={() => setIsListening(!isListening)} variant="outline" size="icon">
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
