import { useState, useEffect } from "react";
import OnboardingFlow, { UserProfile } from "@/components/Onboarding";
import Navigation from "@/components/Navigation";
import ChatInterface from "@/components/ChatInterface";
import MoodTracker from "@/components/MoodTracker";
import ResourcesPage from "@/components/ResourcesPage";
import SettingsPage from "@/components/SettingsPage";
import JournalPage from "@/components/JournalPage";
import CommunityPage from "@/components/CommunityPage";
import GamificationPanel from "@/components/GamificationPanel";
import EmergencyModal from "@/components/EmergencyModal";
import Home from "@/components/HomePage";

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Load user profile from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("mindful-you-profile");
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, []);

  // Save user profile to localStorage when it changes
  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("mindful-you-profile", JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    handleProfileUpdate(profile);
  };

  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
  };

  // Show onboarding if no profile exists
  if (!userProfile) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Render main application
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        userProfile={userProfile}
        onEmergency={handleEmergencyClick}
      />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        <main className="h-screen overflow-hidden">
          {currentView === "home" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <Home />
            </div>
          )}

          {currentView === "chat" && (
            <ChatInterface
              userProfile={userProfile}
              onEmergency={handleEmergencyClick}
            />
          )}

          {currentView === "mood" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <MoodTracker />
            </div>
          )}

          {currentView === "resources" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <ResourcesPage />
            </div>
          )}

          {currentView === "journal" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <JournalPage userProfile={userProfile} />
            </div>
          )}

          {currentView === "community" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <CommunityPage userProfile={userProfile} />
            </div>
          )}

          {currentView === "progress" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <GamificationPanel userProfile={userProfile} />
            </div>
          )}

          {currentView === "settings" && (
            <div className="h-full overflow-y-auto p-4 md:p-6">
              <SettingsPage
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          )}
        </main>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
};

export default Index;
