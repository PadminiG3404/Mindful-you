import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Heart, 
  BookOpen, 
  Settings, 
  Menu,
  X,
  Shield,
  Bell,
  Users,
  TrendingUp,
  Compass
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userProfile: UserProfile;
  onEmergency: () => void;
}

const Navigation = ({ currentView, onViewChange, userProfile, onEmergency }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "mood", label: "Mood", icon: Heart },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "resources", label: "Resources", icon: Compass },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {userProfile.pronouns?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground text-sm">Mindful You</div>
              <div className="text-xs text-muted-foreground">Your safe space</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEmergency}
              className="text-emergency border-emergency/30 hover:bg-emergency/10"
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-foreground">Navigation</h2>
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className="w-full justify-start h-12"
                  onClick={() => {
                    onViewChange(item.id);
                    toggleMenu();
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
            
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="outline"
                className="w-full justify-start h-12 text-emergency border-emergency/30 hover:bg-emergency/10"
                onClick={() => {
                  onEmergency();
                  toggleMenu();
                }}
              >
                <Shield className="w-5 h-5 mr-3" />
                Emergency Support
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card/50 backdrop-blur-sm border-r border-border/50">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-primary text-lg">Mindful You</div>
                <div className="text-xs text-muted-foreground">Your wellness companion</div>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary/30 text-secondary-foreground">
                  {userProfile.pronouns?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {userProfile.pronouns ? `Welcome (${userProfile.pronouns})` : 'Welcome'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Age: {userProfile.ageGroup}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className={`w-full justify-start h-11 transition-all ${
                    currentView === item.id 
                      ? "bg-gradient-primary border-0 text-primary-foreground shadow-gentle" 
                      : "hover:bg-secondary/30"
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Emergency Button */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="outline"
              className="w-full justify-start h-11 text-emergency border-emergency/30 hover:bg-emergency/10 transition-all"
              onClick={onEmergency}
            >
              <Shield className="w-5 h-5 mr-3" />
              Emergency Support
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center space-x-1 mb-1">
                <Shield className="w-3 h-3" />
                <span className="font-medium">Your privacy matters</span>
              </div>
              <div>
                Conversations are encrypted and secure. We only share information in emergencies for your safety.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;