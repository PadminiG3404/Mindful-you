import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Users, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export interface UserProfile {
  name?: string;
  dob?: string;
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
  tonePreference: "gentle" | "direct" | "coaching";
  interactionMode: "text" | "voice" | "both";
  accessibilityNeeds?: string[];
  emergencyContactPermission: "none" | "local_clinician" | "parent";
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
    tonePreference: "gentle",
    interactionMode: "text",
    emergencyContactPermission: "none",
  });

  const steps = [
    { title: "Welcome to Mindful You", subtitle: "Your safe space for mental wellness", icon: Heart },
    { title: "Tell us about yourself", subtitle: "This helps us personalize your experience", icon: Users },
    { title: "Personalization", subtitle: "Choose preferences that fit your needs", icon: Users },
    { title: "Privacy & Preferences", subtitle: "Your privacy is our priority", icon: Shield },
    { title: "You're all set!", subtitle: "Let's begin your wellness journey", icon: Sparkles },
  ];

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleCheckboxArray = (field: keyof UserProfile, value: string) => {
    setProfile(prev => {
      const arr = prev[field] as string[] | undefined;
      return {
        ...prev,
        [field]: arr?.includes(value)
          ? arr.filter(v => v !== value)
          : [...(arr || []), value],
      };
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  const handleComplete = () => onComplete(profile);

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-soft border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <StepIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-primary font-medium">{steps[step].title}</CardTitle>
          <CardDescription className="text-muted-foreground">{steps[step].subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 0: Intro */}
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

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={profile.name || ""}
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.dob || ""}
                  onChange={e => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                />
              </div>

              <div>
                <Label>Age Group</Label>
                <RadioGroup
                  value={profile.ageGroup}
                  onValueChange={value => setProfile(prev => ({ ...prev, ageGroup: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10-13" id="age-10-13" />
                    <Label htmlFor="age-10-13">10–13</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="14-17" id="age-14-17" />
                    <Label htmlFor="age-14-17">14–17</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18-24" id="age-18-24" />
                    <Label htmlFor="age-18-24">18–24</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="pronouns">Pronouns (Optional)</Label>
                <Input
                  id="pronouns"
                  placeholder="e.g., they/them"
                  value={profile.pronouns}
                  onChange={e => setProfile(prev => ({ ...prev, pronouns: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 2: Personalization */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Gender Identity</Label>
                <Select
                  onValueChange={value => setProfile(prev => ({ ...prev, genderIdentity: value }))}
                  value={profile.genderIdentity}
                >
                  <SelectTrigger><SelectValue placeholder="Select identity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cis-male">Cisgender Male</SelectItem>
                    <SelectItem value="cis-female">Cisgender Female</SelectItem>
                    <SelectItem value="transgender">Transgender</SelectItem>
                    <SelectItem value="non-binary">Non-Binary</SelectItem>
                    <SelectItem value="gender-fluid">Gender Fluid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sexual Orientation</Label>
                <Select
                  onValueChange={value => setProfile(prev => ({ ...prev, sexualOrientation: value }))}
                  value={profile.sexualOrientation}
                >
                  <SelectTrigger><SelectValue placeholder="Select orientation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="lesbian">Lesbian</SelectItem>
                    <SelectItem value="bisexual">Bisexual</SelectItem>
                    <SelectItem value="queer">Queer</SelectItem>
                    <SelectItem value="asexual">Asexual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Neurodivergent Needs</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["ASD", "ADHD", "Dyslexia", "Other"].map(val => (
                    <div key={val} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.neurodivergent?.includes(val)}
                        onCheckedChange={() => handleCheckboxArray("neurodivergent", val)}
                      />
                      <Label>{val}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Input
                  id="language"
                  placeholder="e.g., English, Spanish"
                  value={profile.languagePreference || ""}
                  onChange={e => setProfile(prev => ({ ...prev, languagePreference: e.target.value }))}
                />
              </div>

              <div>
                <Label>Tone Preference</Label>
                <RadioGroup
                  value={profile.tonePreference}
                  onValueChange={val => setProfile(prev => ({ ...prev, tonePreference: val as any }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gentle" id="tone-gentle" />
                    <Label htmlFor="tone-gentle">Gentle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="tone-direct" />
                    <Label htmlFor="tone-direct">Direct</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coaching" id="tone-coaching" />
                    <Label htmlFor="tone-coaching">Coaching</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Interaction Mode</Label>
                <RadioGroup
                  value={profile.interactionMode}
                  onValueChange={val => setProfile(prev => ({ ...prev, interactionMode: val as any }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="mode-text" />
                    <Label htmlFor="mode-text">Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="voice" id="mode-voice" />
                    <Label htmlFor="mode-voice">Voice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="mode-both" />
                    <Label htmlFor="mode-both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Your Privacy Matters</h4>
                <p className="text-xs text-muted-foreground">
                  Your conversations are private and secure. We don’t share personal information without your consent, except in emergencies.
                </p>
              </div>

              <div>
                <Label>Emergency Contact Permission</Label>
                <RadioGroup
                  value={profile.emergencyContactPermission}
                  onValueChange={val => setProfile(prev => ({ ...prev, emergencyContactPermission: val as any }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="perm-none" />
                    <Label htmlFor="perm-none">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local_clinician" id="perm-clinician" />
                    <Label htmlFor="perm-clinician">Local Clinician</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parent" id="perm-parent" />
                    <Label htmlFor="perm-parent">Parent / Guardian</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={profile.notifications}
                  onCheckedChange={checked => setProfile(prev => ({ ...prev, notifications: !!checked }))}
                />
                <Label htmlFor="notifications">Send me gentle reminders to check in</Label>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-calm rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-foreground/80">
                You're ready to start your wellness journey. Remember, it's okay to take things one step at a time.
              </p>
              <div className="text-xs text-muted-foreground">
                You can update your preferences anytime in settings.
              </div>
            </div>
          )}

          {/* Step controls */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep} disabled={step === 0}>Back</Button>
            {step < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !profile.ageGroup}
                className="bg-gradient-primary border-0"
              >
                Continue
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-gradient-primary border-0">
                Start Journey
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2 pt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
