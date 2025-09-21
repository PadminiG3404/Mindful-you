import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Bell,
  Heart,
  Shield,
  Settings,
  Languages,
  Accessibility,
  Users,
  Headphones,
  LifeBuoy,
  LogOut,
  FileText,
  Download,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    ageGroup: "16-18",
    pronouns: "",
    genderIdentity: "",
    sexualOrientation: "",
    languagePreference: "English",
    interests: [] as string[],
    accessibilityNeeds: [] as string[],
    tonePreference: "gentle",
    interactionMode: "text",
    copingStrategies: [] as string[],
    supportGroups: [] as string[],
    emergencyContactPermission: "none",
    privacyLevel: "high",
    notifications: true,
    crisisAlerts: true,
  });

  const handleCheckboxToggle = (key: keyof typeof profile, value: string) => {
      // Ensure the property is of type string[]
      if (Array.isArray(profile[key])) {
        setProfile((prev) => ({
          ...prev,
          [key]: (prev[key] as string[]).includes(value)
            ? (prev[key] as string[]).filter((i) => i !== value)
            : [...(prev[key] as string[]), value],
        }));
      }
    };

  const handleSave = () => {
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
    console.log("Profile Settings:", profile);
  };

  const handleDataExport = () => {
    const exportData = {
      profile,
      moodHistory: JSON.parse(localStorage.getItem("mindful-you-moods") || "[]"),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindful-you-data.json";
    a.click();
  };

  const handleDataDeletion = () => {
    if (confirm("Are you sure you want to permanently delete all your data?")) {
      localStorage.clear();
      toast({
        title: "Data Deleted",
        description: "All your personal data has been removed.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-primary">Settings</h1>
      <p className="text-muted-foreground -mt-2">
        Manage your profile, privacy, preferences, and support options
      </p>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Profile Information
              </CardTitle>
              <CardDescription>
                Customize your personal details and accessibility needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Age Group</Label>
                <Select
                  value={profile.ageGroup}
                  onValueChange={(value) => setProfile((p) => ({ ...p, ageGroup: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-13">10–13 (Early Adolescents)</SelectItem>
                    <SelectItem value="14-17">14–17 (Mid Teens)</SelectItem>
                    <SelectItem value="18-24">18–24 (Young Adults)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Pronouns</Label>
                <Input
                  placeholder="e.g., they/them"
                  value={profile.pronouns}
                  onChange={(e) => setProfile((p) => ({ ...p, pronouns: e.target.value }))}
                />
              </div>

              <div>
                <Label>Gender Identity</Label>
                <Select
                  value={profile.genderIdentity}
                  onValueChange={(value) => setProfile((p) => ({ ...p, genderIdentity: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select identity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cis_male">Cisgender Male</SelectItem>
                    <SelectItem value="cis_female">Cisgender Female</SelectItem>
                    <SelectItem value="transgender">Transgender</SelectItem>
                    <SelectItem value="non_binary">Non-Binary</SelectItem>
                    <SelectItem value="fluid">Gender Fluid</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sexual Orientation</Label>
                <Select
                  value={profile.sexualOrientation}
                  onValueChange={(value) => setProfile((p) => ({ ...p, sexualOrientation: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select orientation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heterosexual">Heterosexual</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="lesbian">Lesbian</SelectItem>
                    <SelectItem value="bisexual">Bisexual</SelectItem>
                    <SelectItem value="queer">Queer</SelectItem>
                    <SelectItem value="asexual">Asexual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Language Preference</Label>
                <Input
                  placeholder="Preferred language"
                  value={profile.languagePreference}
                  onChange={(e) => setProfile((p) => ({ ...p, languagePreference: e.target.value }))}
                />
              </div>

              <div>
                <Label>Accessibility Needs</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Screen Reader", "High Contrast", "Reduced Motion"].map((need) => (
                    <div key={need} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.accessibilityNeeds.includes(need)}
                        onCheckedChange={() => handleCheckboxToggle("accessibilityNeeds", need)}
                      />
                      <span className="text-sm">{need}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Privacy & Safety
              </CardTitle>
              <CardDescription>
                Manage your privacy level, data export, and crisis alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Privacy Level</Label>
                <Select
                  value={profile.privacyLevel}
                  onValueChange={(value) => setProfile((p) => ({ ...p, privacyLevel: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (most private)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Emergency Contact Permission</Label>
                <Select
                  value={profile.emergencyContactPermission}
                  onValueChange={(value) => setProfile((p) => ({ ...p, emergencyContactPermission: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="local_clinician">Local Clinician</SelectItem>
                    <SelectItem value="parent">Parent / Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Crisis Alerts</Label>
                <Switch
                  checked={profile.crisisAlerts}
                  onCheckedChange={(checked) => setProfile((p) => ({ ...p, crisisAlerts: checked }))}
                />
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
                    <Download className="w-4 h-4 mr-1" /> Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-emergency/5 rounded-lg border border-emergency/20">
                  <div>
                    <div className="text-sm font-medium text-emergency">Delete All Data</div>
                    <div className="text-xs text-muted-foreground">Permanently delete your account and data</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDataDeletion}
                    className="border-emergency/30 text-emergency hover:bg-emergency/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> App & Wellness Preferences
              </CardTitle>
              <CardDescription>
                Adjust app behavior, tone, and wellness tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tone Preference</Label>
                <Select
                  value={profile.tonePreference}
                  onValueChange={(value) => setProfile((p) => ({ ...p, tonePreference: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="coaching">Coaching</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interaction Mode</Label>
                <Select
                  value={profile.interactionMode}
                  onValueChange={(value) => setProfile((p) => ({ ...p, interactionMode: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="both">Text & Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coping Strategies</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Journaling", "Meditation", "Music", "Exercise"].map((strategy) => (
                    <div key={strategy} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.copingStrategies.includes(strategy)}
                        onCheckedChange={() => handleCheckboxToggle("copingStrategies", strategy)}
                      />
                      <span className="text-sm">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Support Groups</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Peer Support", "Online Communities", "Local Groups"].map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.supportGroups.includes(group)}
                        onCheckedChange={() => handleCheckboxToggle("supportGroups", group)}
                      />
                      <span className="text-sm">{group}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Daily Notifications</Label>
                  <div className="text-xs text-muted-foreground">Reminders and wellness tips</div>
                </div>
                <Switch
                  checked={profile.notifications}
                  onCheckedChange={(checked) => setProfile((p) => ({ ...p, notifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" /> Support & About
              </CardTitle>
              <CardDescription>
                Learn more about Mindful You and get help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <Users className="w-4 h-4" /> Join Community
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <Headphones className="w-4 h-4" /> Crisis Hotlines
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <FileText className="w-4 h-4" /> Terms & Privacy Policy
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>

              <Separator />

              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Mindful You v1.0</strong></p>
                <p>An AI-powered wellness companion designed with empathy, accessibility, and privacy at its core.</p>
                <p>This app is <strong>not</strong> a replacement for professional mental health care. If you're experiencing a crisis, please contact local emergency services or a crisis hotline.</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Privacy-First</Badge>
                <Badge variant="outline">Youth-Focused</Badge>
                <Badge variant="outline">Crisis Support</Badge>
                <Badge variant="outline">Accessible</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

            <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
