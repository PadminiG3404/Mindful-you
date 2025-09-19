import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Mic, MicOff, Heart, AlertCircle, Smile } from "lucide-react";
import { UserProfile } from "./Onboarding";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  mood?: string;
}

interface ChatInterfaceProps {
  userProfile: UserProfile;
  onEmergency: () => void;
}

const ChatInterface = ({ userProfile, onEmergency }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate welcoming first message based on user profile
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: getWelcomeMessage(userProfile),
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = (profile: UserProfile) => {
    const pronoun = profile.pronouns ? ` (${profile.pronouns})` : "";
    const ageAdjusted = profile.ageGroup === "13-15" 
      ? "Hi there! 👋 I'm here to chat and support you." 
      : profile.ageGroup === "16-18"
      ? "Hey! I'm here to listen and help you navigate whatever you're going through."
      : "Hello! I'm your wellness companion, here to support you through anything on your mind.";
    
    return `${ageAdjusted} This is your safe space${pronoun}. How are you feeling today?`;
  };

  const generateResponse = (userMessage: string): string => {
    // Simple placeholder responses - in production this would connect to Vertex AI
    const responses = [
      "That sounds really challenging. Thank you for sharing that with me. Would you like to talk more about what's making you feel this way?",
      "I hear you, and I want you to know that your feelings are completely valid. It takes courage to reach out.",
      "That must feel overwhelming. Let's take this one step at a time. What feels most pressing right now?",
      "I'm glad you felt comfortable sharing that. Sometimes just talking about things can help us process them better.",
      "It sounds like you're dealing with a lot. Remember, it's okay to feel however you're feeling right now.",
    ];
    
    // Simple crisis detection (placeholder)
    if (userMessage.toLowerCase().includes('hurt myself') || 
        userMessage.toLowerCase().includes('suicide') ||
        userMessage.toLowerCase().includes('end it all')) {
      return "I'm really concerned about you and I want to help. You mentioned some thoughts that worry me. Are you safe right now? If you're in immediate danger, please call emergency services or a crisis hotline. Would you like me to help you find support resources?";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowQuickActions(false);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      "feeling-anxious": "I'm feeling anxious today and could use some support.",
      "good-day": "I'm having a good day and wanted to check in!",
      "stressed": "I'm feeling really stressed about some things in my life.",
      "breathing": "Can you guide me through a breathing exercise?",
    };
    
    setInputValue(quickMessages[action as keyof typeof quickMessages] || action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-background">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={message.sender === 'user' ? 'bg-primary/10 text-primary' : 'bg-secondary/30 text-secondary-foreground'}>
                  {message.sender === 'user' ? (userProfile.pronouns?.charAt(0)?.toUpperCase() || 'U') : <Heart className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <Card className={`p-3 shadow-gentle ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border-secondary/20'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Card>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && messages.length <= 1 && (
        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-2">Quick check-ins:</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("feeling-anxious")}
              className="text-xs justify-start"
            >
              😰 Feeling anxious
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("good-day")}
              className="text-xs justify-start"
            >
              <Smile className="w-3 h-3 mr-1" /> Having a good day
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("stressed")}
              className="text-xs justify-start"
            >
              😤 Feeling stressed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("breathing")}
              className="text-xs justify-start"
            >
              🫁 Need breathing help
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="pr-12 bg-background border-border/50 focus:border-primary/50"
            />
          </div>
          
          <Button
            onClick={() => setIsListening(!isListening)}
            variant="outline"
            size="icon"
            className={isListening ? "bg-accent text-accent-foreground" : ""}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
          Your conversations are private and secure
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;