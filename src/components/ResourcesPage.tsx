import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Phone, 
  Book, 
  Users, 
  Headphones, 
  Video, 
  Search, 
  ExternalLink,
  Clock,
  Shield,
  MessageCircle
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "hotline" | "article" | "video" | "audio" | "community" | "tool";
  category: string[];
  ageGroup: string[];
  contact?: string;
  url?: string;
  available247?: boolean;
  confidential?: boolean;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Crisis Text Line",
    description: "Free, 24/7 crisis support via text message. Text HOME to 741741.",
    type: "hotline",
    category: ["Crisis", "Immediate Support"],
    ageGroup: ["13-15", "16-18", "19-24"],
    contact: "Text HOME to 741741",
    available247: true,
    confidential: true,
  },
  {
    id: "2",
    title: "National Suicide Prevention Lifeline",
    description: "Free, confidential support for people in distress and prevention resources.",
    type: "hotline",
    category: ["Crisis", "Suicide Prevention"],
    ageGroup: ["16-18", "19-24"],
    contact: "988",
    available247: true,
    confidential: true,
  },
  {
    id: "3",
    title: "Understanding Anxiety",
    description: "Learn about anxiety symptoms, coping strategies, and when to seek help.",
    type: "article",
    category: ["Anxiety", "Education"],
    ageGroup: ["13-15", "16-18", "19-24"],
    url: "#",
  },
  {
    id: "4",
    title: "5-Minute Breathing Exercise",
    description: "Guided breathing exercise to help reduce stress and anxiety in the moment.",
    type: "audio",
    category: ["Coping Skills", "Mindfulness"],
    ageGroup: ["13-15", "16-18", "19-24"],
    url: "#",
  },
  {
    id: "5",  
    title: "Teen Mental Health First Aid",
    description: "Learn how to support friends who might be struggling with mental health.",
    type: "video",
    category: ["Education", "Peer Support"],
    ageGroup: ["16-18", "19-24"],
    url: "#",
  },
  {
    id: "6",
    title: "LGBTQ+ Youth Support",
    description: "Specialized support and resources for LGBTQ+ young people.",
    type: "community",
    category: ["LGBTQ+", "Identity", "Community"],
    ageGroup: ["13-15", "16-18", "19-24"],
    url: "#",
    confidential: true,
  },
  {
    id: "7",
    title: "Mood Tracking Journal",
    description: "Digital tool to help track your moods, triggers, and patterns over time.",
    type: "tool",
    category: ["Self-Care", "Tracking"],
    ageGroup: ["16-18", "19-24"],
    url: "#",
  },
  {
    id: "8",
    title: "Dealing with Academic Stress",
    description: "Strategies for managing school pressure, test anxiety, and academic overwhelm.",
    type: "article",
    category: ["Stress", "School", "Coping Skills"],
    ageGroup: ["13-15", "16-18"],
    url: "#",
  }
];

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  const categories = ["All", "Crisis", "Anxiety", "Stress", "LGBTQ+", "Education", "Self-Care", "Coping Skills"];
  const types = ["All", "hotline", "article", "video", "audio", "community", "tool"];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category.includes(selectedCategory);
    const matchesType = selectedType === "All" || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hotline": return <Phone className="w-4 h-4" />;
      case "article": return <Book className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "audio": return <Headphones className="w-4 h-4" />;
      case "community": return <Users className="w-4 h-4" />;
      case "tool": return <Heart className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hotline": return "bg-emergency/10 text-emergency";
      case "article": return "bg-primary/10 text-primary";
      case "video": return "bg-accent/20 text-accent-foreground";
      case "audio": return "bg-mood-calm/20 text-secondary-foreground";
      case "community": return "bg-mood-happy/20 text-foreground";
      case "tool": return "bg-secondary/30 text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Resources & Support</h1>
        <p className="text-muted-foreground">
          Curated resources to support your mental wellness journey
        </p>
      </div>

      {/* Emergency Banner */}
      <Card className="border-emergency/20 bg-emergency/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-emergency">
            <Phone className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium">Need immediate help?</div>
              <div className="text-sm">Call 988 or text HOME to 741741 for 24/7 crisis support</div>
            </div>
            <Button variant="outline" size="sm" className="border-emergency/30 text-emergency hover:bg-emergency/10">
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-gentle border-secondary/20">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-muted-foreground">Categories:</div>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:shadow-gentle"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-muted-foreground">Type:</div>
            {types.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className="cursor-pointer hover:shadow-gentle capitalize"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="shadow-gentle border-secondary/20 hover:shadow-soft transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground leading-tight">
                      {resource.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {resource.available247 && (
                        <div className="flex items-center text-xs text-mood-happy">
                          <Clock className="w-3 h-3 mr-1" />
                          24/7
                        </div>
                      )}
                      {resource.confidential && (
                        <div className="flex items-center text-xs text-primary">
                          <Shield className="w-3 h-3 mr-1" />
                          Confidential
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <CardDescription className="text-sm leading-relaxed">
                {resource.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1">
                {resource.category.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
              
              {resource.contact && (
                <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{resource.contact}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-primary border-0 hover:opacity-90"
                  onClick={() => {
                    if (resource.contact) {
                      // Handle contact action (call, text, etc.)
                      console.log(`Contacting: ${resource.contact}`);
                    } else if (resource.url) {
                      // Handle URL opening
                      console.log(`Opening: ${resource.url}`);
                    }
                  }}
                >
                  {resource.type === "hotline" ? "Contact" : "View"}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="shadow-gentle border-secondary/20">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No resources found matching your criteria. Try adjusting your search or filters.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourcesPage;