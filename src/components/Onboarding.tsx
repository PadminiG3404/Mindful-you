import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Shield, Users, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export interface UserProfile {
  ageGroup: string;
  pronouns: string;
  interests: string[];
  privacyLevel: string;
  notifications: boolean;
  // Enhanced personalization fields
  genderIdentity?: string;
  sexualOrientation?: string;
  neurodivergent?: string[];
  culturalBackground?: string;
  languagePreference?: string;
  tonePreference: 'gentle' | 'direct' | 'coaching';
  interactionMode: 'text' | 'voice' | 'both';
  accessibilityNeeds?: string[];
  emergencyContactPermission: 'none' | 'local_clinician' | 'parent';
  supportGroups?: string[];
  copingStrategies?: string[];
}

const OnboardingFlow = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    ageGroup: "",
    pronouns: "",
    interests: [],
    privacyLevel: "high",
    notifications: false,
    tonePreference: 'gentle',
    interactionMode: 'text',
    emergencyContactPermission: 'none',
  });

  const steps = [
    {
      title: "Welcome to Mindful You",
      subtitle: "Your safe space for mental wellness",
      icon: Heart,
    },
    {
      title: "Tell us about yourself",
      subtitle: "This helps us personalize your experience",
      icon: Users,
    },
    {
      title: "Privacy & Preferences",
      subtitle: "Your privacy is our priority",
      icon: Shield,
    },
    {
      title: "You're all set!",
      subtitle: "Let's begin your wellness journey",
      icon: Sparkles,
    },
  ];

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleComplete = () => {
    onComplete(profile);
  };

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <StepIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-primary font-medium">
            {steps[step].title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {steps[step].subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4 text-center">
              <p className="text-foreground/80 text-sm leading-relaxed">
                Mindful You is a safe, private space designed to support your mental wellness. 
                We're here to listen without judgment and help you feel your best.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>Always Supportive</span>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="age-group" className="text-sm font-medium text-foreground">
                  Age Group
                </Label>
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
                <Label htmlFor="pronouns" className="text-sm font-medium text-foreground">
                  Pronouns (Optional)
                </Label>
                <Input
                  id="pronouns"
                  placeholder="e.g., they/them, she/her, he/him"
                  value={profile.pronouns}
                  onChange={(e) => setProfile(prev => ({ ...prev, pronouns: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  What interests you? (Optional)
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Art & Creativity", "Music", "Sports", "Reading", "Gaming", "Nature"].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={profile.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="text-xs">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h4 className="font-medium text-sm text-foreground mb-2">Your Privacy Matters</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your conversations are private and secure. We don't share personal information 
                  without your consent, except in emergency situations for your safety.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={profile.notifications}
                  onCheckedChange={(checked) => 
                    setProfile(prev => ({ ...prev, notifications: !!checked }))
                  }
                />
                <Label htmlFor="notifications" className="text-sm">
                  Send me gentle reminders to check in
                </Label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-calm rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-foreground/80">
                You're ready to start your wellness journey. Remember, it's okay to take things 
                one step at a time.
              </p>
              <div className="text-xs text-muted-foreground">
                You can update your preferences anytime in settings.
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="px-6"
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !profile.ageGroup}
                className="px-6 bg-gradient-primary border-0 hover:opacity-90"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="px-6 bg-gradient-primary border-0 hover:opacity-90"
              >
                Start Journey
              </Button>
            )}
          </div>

          <div className="flex justify-center space-x-2 pt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;