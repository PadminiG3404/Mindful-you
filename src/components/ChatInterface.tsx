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
    let ageAdjusted = "";
    
    if (profile.ageGroup === "13-15") {
      ageAdjusted = "Hi there! 👋 I'm here to chat and support you. This is your safe space to share anything that's on your mind.";
    } else if (profile.ageGroup === "16-18") {
      ageAdjusted = "Hey! I'm here to listen and help you navigate whatever you're going through. High school can be a lot, and you don't have to face it alone.";
    } else {
      ageAdjusted = "Hello! I'm your wellness companion, here to support you through anything on your mind. Transitions and life changes can be tough, but you've got this.";
    }
    
    // Add personalized elements based on profile
    let personalizations = [];
    if (profile.tonePreference === 'gentle') {
      personalizations.push("I'll keep our conversation gentle and supportive.");
    } else if (profile.tonePreference === 'direct') {
      personalizations.push("I'll be direct and straightforward with you.");
    } else if (profile.tonePreference === 'coaching') {
      personalizations.push("I'm here to help coach you through challenges.");
    }
    
    if (profile.interactionMode === 'voice' || profile.interactionMode === 'both') {
      personalizations.push("Feel free to use voice messages if that's easier for you.");
    }

    const personalizationText = personalizations.length > 0 ? ` ${personalizations.join(' ')}` : "";
    
    return `${ageAdjusted}${personalizationText} How are you feeling today?${pronoun}`;
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced crisis detection with more patterns
    const crisisPatterns = [
      'hurt myself', 'suicide', 'suicidal', 'end it all', 'kill myself', 
      'don\'t want to live', 'better off dead', 'no point', 'give up',
      'self harm', 'cutting', 'overdose', 'end my life'
    ];
    
    const isCrisis = crisisPatterns.some(pattern => lowerMessage.includes(pattern));
    
    if (isCrisis) {
      return "I'm really concerned about you and I want to help. You mentioned some thoughts that worry me deeply. Are you safe right now? If you're in immediate danger, please call emergency services (911) or text HOME to 741741 for the Crisis Text Line. You don't have to go through this alone - there are people who want to help you. Would you like me to help you find local support resources?";
    }

    // Anxiety/stress responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      const anxietyResponses = [
        "Anxiety can feel really overwhelming. Thank you for sharing that with me. Let's try a quick grounding technique: Can you name 5 things you can see around you right now?",
        "I hear that you're feeling anxious. That takes courage to share. Sometimes when anxiety hits, our breathing gets shallow. Would you like to try a simple breathing exercise with me?",
        "Anxiety is tough, but you're tougher for reaching out. What's one small thing that usually helps you feel a bit calmer? Even tiny steps count."
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }

    // Stress responses  
    if (lowerMessage.includes('stressed') || lowerMessage.includes('stress') || lowerMessage.includes('overwhelming')) {
      const stressResponses = [
        "That sounds really overwhelming. Thank you for trusting me with this. When everything feels like too much, sometimes it helps to focus on just the next small step. What's one thing you could do in the next 10 minutes that might help?",
        "Stress can make everything feel impossible. You're not alone in feeling this way. Would it help to talk through what's weighing on you most right now?",
        "I can hear how much pressure you're under. That's really hard. Sometimes stress is our mind's way of caring about things that matter to us. What matters most to you in this situation?"
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }

    // Depression/sadness responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hopeless')) {
      const sadnessResponses = [
        "I can hear the pain in your words, and I'm really glad you shared this with me. Sadness is heavy, but you don't have to carry it alone. What's been the hardest part of your day?",
        "Thank you for being brave enough to share how you're feeling. Sometimes when we're down, small acts of kindness toward ourselves can help. Have you been able to do anything gentle for yourself today?",
        "That sounds incredibly difficult. Your feelings are completely valid - it's okay to not be okay. What's one thing that has brought you even a tiny moment of comfort recently?"
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }

    // Loneliness responses
    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      const lonelinessResponses = [
        "Loneliness can feel so heavy. I'm here with you right now, and I want you to know that you matter. What's making you feel most disconnected lately?",
        "Feeling alone is one of the hardest human experiences. Thank you for reaching out - that takes real strength. You're not as alone as it might feel right now.",
        "I hear how isolated you're feeling. That's really painful. Sometimes connection can start small - even this conversation is a form of connection. Is there anyone in your life you might feel comfortable reaching out to?"
      ];
      return lonelinessResponses[Math.floor(Math.random() * lonelinessResponses.length)];
    }

    // School/academic stress (age-appropriate)
    if (lowerMessage.includes('school') || lowerMessage.includes('college') || lowerMessage.includes('grades') || lowerMessage.includes('exam')) {
      let schoolResponses = [];
      if (userProfile.ageGroup === '13-15') {
        schoolResponses = [
          "School can feel like so much pressure sometimes. What's the hardest part about school for you right now?",
          "I hear you. School stress is real, and it can feel overwhelming. Have you been able to talk to anyone at school or at home about what you're going through?",
        ];
      } else if (userProfile.ageGroup === '16-18') {
        schoolResponses = [
          "High school pressure is intense, especially with college and future decisions looming. What's weighing on you most about school right now?",
          "That sounds like a lot to handle. Between academics, social life, and thinking about the future, it's no wonder you're feeling overwhelmed. What feels most urgent?",
        ];
      } else {
        schoolResponses = [
          "College and post-graduation life transitions are huge. It's completely normal to feel uncertain about the future. What aspect of your academic life is causing you the most stress?",
          "Academic pressure at your stage is intense. You're juggling so much - studies, maybe work, thinking about career paths. What support do you have right now?",
        ];
      }
      return schoolResponses[Math.floor(Math.random() * schoolResponses.length)];
    }

    // Positive/good day responses
    if (lowerMessage.includes('good') || lowerMessage.includes('better') || lowerMessage.includes('happy') || lowerMessage.includes('great')) {
      const positiveResponses = [
        "That's wonderful to hear! I'm so glad you're having a good day. What's been the best part of your day so far?",
        "It makes me happy to hear you're doing well! Good days are worth celebrating. What's contributing to your positive mood?",
        "That's fantastic! It's beautiful when we can recognize and appreciate the good moments. What's making today feel good for you?"
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // General supportive responses
    const generalResponses = [
      "Thank you for sharing that with me. It sounds like you have a lot on your mind. What feels most important to talk about right now?",
      "I hear you, and I want you to know that your feelings are completely valid. Sometimes just putting words to our experiences can help us process them better.",
      "That sounds really challenging. Thank you for trusting me with this. You don't have to face this alone - I'm here to listen and support you.",
      "I can tell you're going through something difficult. It takes courage to reach out and talk about hard things. What would feel most helpful right now?",
      "Your feelings make complete sense given what you're experiencing. What's been the most difficult part of your day today?",
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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
      "feeling-anxious": "I'm feeling anxious today and could use some support and grounding techniques.",
      "good-day": "I'm having a good day and wanted to check in! Things are going well for me.",
      "stressed": "I'm feeling really stressed about some things in my life and need to talk through them.",
      "breathing": "Can you guide me through a breathing exercise? I need to calm down and center myself.",
      "lonely": "I'm feeling pretty lonely and isolated today. Could use some connection.",
      "school-stress": "School is overwhelming me right now and I'm struggling to keep up.",
      "sleep-help": "I'm having trouble sleeping and it's affecting my mood and energy.",
      "body-image": "I'm struggling with how I feel about my body and appearance.",
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
            {userProfile.ageGroup !== '13-15' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("lonely")}
                  className="text-xs justify-start"
                >
                  😔 Feeling lonely
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("school-stress")}
                  className="text-xs justify-start"
                >
                  📚 School stress
                </Button>
              </>
            )}
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