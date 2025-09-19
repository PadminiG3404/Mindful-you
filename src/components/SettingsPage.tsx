import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Heart,
  Palette,
  Volume2
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface SettingsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const SettingsPage = ({ userProfile, onProfileUpdate }: SettingsPageProps) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const handleSave = () => {
    onProfileUpdate(profile);
    // Show success toast
    console.log("Settings saved!");
  };

  const handleDataExport = () => {
    // In production, this would generate and download user data
    const exportData = {
      profile: profile,
      moodHistory: JSON.parse(localStorage.getItem('mindful-you-moods') || '[]'),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindful-you-data.json';
    a.click();
  };

  const handleDataDeletion = () => {
    if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      localStorage.clear();
      // In production, this would also clear server-side data
      console.log("Data deletion requested");
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const availableInterests = [
    "Art & Creativity", "Music", "Sports", "Reading", "Gaming", "Nature", 
    "Technology", "Cooking", "Photography", "Writing", "Dance", "Movies"
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, privacy, and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Personalize your experience and help us provide better support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="age-group" className="text-sm font-medium">Age Group</Label>
            <RadioGroup 
              value={profile.ageGroup} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, ageGroup: value }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="13-15" id="age-13-15" />
                <Label htmlFor="age-13-15" className="text-sm">13-15 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="16-18" id="age-16-18" />
                <Label htmlFor="age-16-18" className="text-sm">16-18 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="19-24" id="age-19-24" />
                <Label htmlFor="age-19-24" className="text-sm">19-24 years</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="pronouns" className="text-sm font-medium">Pronouns</Label>
            <Input
              id="pronouns"
              placeholder="e.g., they/them, she/her, he/him"
              value={profile.pronouns}
              onChange={(e) => setProfile(prev => ({ ...prev, pronouns: e.target.value }))}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Interests</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {availableInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={interest}
                    checked={profile.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <Label htmlFor={interest} className="text-xs">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Control how your data is stored and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="privacy-level" className="text-sm font-medium">Privacy Level</Label>
            <RadioGroup 
              value={profile.privacyLevel} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, privacyLevel: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="privacy-high" />
                <Label htmlFor="privacy-high" className="text-sm">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="privacy-medium" />
                <Label htmlFor="privacy-medium" className="text-sm">Medium</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-4 bg-secondary/20 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
              className="p-0 h-auto font-medium text-foreground mb-2"
            >
              {showPrivacyDetails ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Privacy Details
            </Button>
            {showPrivacyDetails && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>High Privacy:</strong> Conversations deleted after 24 hours, minimal analytics, no personalization data stored.</p>
                <p><strong>Medium Privacy:</strong> Conversations stored for mood analysis, anonymized usage analytics, personalization preferences saved.</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Data Management</h4>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Export Your Data</div>
                <div className="text-xs text-muted-foreground">Download all your personal data</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDataExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-emergency/5 rounded-lg border border-emergency/20">
              <div>
                <div className="text-sm font-medium text-emergency">Delete All Data</div>
                <div className="text-xs text-muted-foreground">Permanently delete your account and data</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDataDeletion} className="border-emergency/30 text-emergency hover:bg-emergency/10">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Bell className="w-5 h-5 mr-2" />
            Notifications & Reminders
          </CardTitle>
          <CardDescription>
            Manage how and when we send you supportive messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Daily Check-in Reminders</Label>
              <div className="text-xs text-muted-foreground">Gentle reminders to track your mood</div>
            </div>
            <Switch
              checked={profile.notifications}
              onCheckedChange={(checked) => setProfile(prev => ({ ...prev, notifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Wellness Tips</Label>
              <div className="text-xs text-muted-foreground">Periodic mental health tips and resources</div>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Crisis Support Alerts</Label>
              <div className="text-xs text-muted-foreground">Important safety and support information</div>
            </div>
            <Switch defaultChecked={true} disabled />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Palette className="w-5 h-5 mr-2" />
            App Preferences
          </CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sound Effects</Label>
              <div className="text-xs text-muted-foreground">Gentle sounds for notifications and interactions</div>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Reduced Motion</Label>
              <div className="text-xs text-muted-foreground">Minimize animations for better accessibility</div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Voice Interaction</Label>
              <div className="text-xs text-muted-foreground">Enable voice input and responses</div>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card className="shadow-gentle border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Heart className="w-5 h-5 mr-2" />
            Support & About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Mindful You v1.0</strong></p>
            <p>An AI-powered mental wellness companion designed with privacy and empathy at its core.</p>
            <p>This app is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">Privacy-First</Badge>
            <Badge variant="outline">Youth-Focused</Badge>
            <Badge variant="outline">Crisis Support</Badge>
            <Badge variant="outline">24/7 Available</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleSave}
          className="px-8 bg-gradient-primary border-0 hover:opacity-90"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;