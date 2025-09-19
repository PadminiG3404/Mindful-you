import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, ExternalLink, Shield, Clock } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyResources = [
  {
    name: "National Suicide Prevention Lifeline",
    contact: "988",
    description: "Free, confidential support 24/7",
    type: "call",
    available247: true,
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "Free crisis support via text message",
    type: "text",
    available247: true,
  },
  {
    name: "Emergency Services",
    contact: "911",
    description: "For immediate medical emergencies",
    type: "call",
    available247: true,
  },
  {
    name: "Trans Lifeline",
    contact: "877-565-8860",
    description: "Support for transgender individuals",
    type: "call",
    available247: true,
  },
  {
    name: "LGBTQ National Hotline",
    contact: "1-888-843-4564",
    description: "Support for LGBTQ+ youth and adults",
    type: "call",
    available247: false,
  },
];

const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const handleContact = (contact: string, type: string) => {
    if (type === "call") {
      window.location.href = `tel:${contact.replace(/\D/g, '')}`;
    } else if (type === "text") {
      // For text, we'll show instructions since we can't directly text
      alert(`To text: ${contact}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-emergency">
            <Shield className="w-5 h-5 mr-2" />
            Emergency Support
          </DialogTitle>
          <DialogDescription>
            If you're in immediate danger or having thoughts of harming yourself, please reach out for help right away.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Immediate Safety Check */}
          <Card className="border-emergency/20 bg-emergency/5">
            <CardContent className="p-4">
              <h4 className="font-medium text-emergency mb-2">Are you safe right now?</h4>
              <p className="text-sm text-foreground/80 mb-3">
                If you're in immediate physical danger, please call 911 or your local emergency services.
              </p>
              <Button
                onClick={() => handleContact("911", "call")}
                className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call 911 - Emergency Services
              </Button>
            </CardContent>
          </Card>

          {/* Crisis Support Resources */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Crisis Support Resources</h4>
            {emergencyResources.slice(0, 3).map((resource, index) => (
              <Card key={index} className="shadow-gentle border-secondary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-foreground text-sm">{resource.name}</h5>
                    {resource.available247 && (
                      <div className="flex items-center text-xs text-mood-happy">
                        <Clock className="w-3 h-3 mr-1" />
                        24/7
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                  <Button
                    onClick={() => handleContact(resource.contact, resource.type)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {resource.type === "call" ? (
                      <Phone className="w-3 h-3 mr-2" />
                    ) : (
                      <MessageCircle className="w-3 h-3 mr-2" />
                    )}
                    {resource.contact}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Specialized Support */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Specialized Support</h4>
            {emergencyResources.slice(3).map((resource, index) => (
              <Card key={index} className="shadow-gentle border-secondary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-foreground text-sm">{resource.name}</h5>
                    {resource.available247 && (
                      <div className="flex items-center text-xs text-mood-happy">
                        <Clock className="w-3 h-3 mr-1" />
                        24/7
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                  <Button
                    onClick={() => handleContact(resource.contact, resource.type)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    {resource.contact}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety Planning */}
          <Card className="shadow-gentle border-secondary/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">Safety Planning</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Consider these steps to help keep yourself safe:
              </p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Remove any items that could be used for self-harm</li>
                <li>• Stay with trusted friends or family</li>
                <li>• Avoid alcohol and drugs</li>
                <li>• Make a list of people you can call for support</li>
                <li>• Create a safety plan with a mental health professional</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning text-sm mb-1">Privacy Notice</h4>
                  <p className="text-xs text-foreground/80">
                    When you contact emergency services or crisis lines, they may ask for your location 
                    and contact information to ensure your safety. This is standard procedure to help you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              I'm Safe - Close
            </Button>
            <Button
              onClick={() => handleContact("988", "call")}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;