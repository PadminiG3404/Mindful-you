import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  Plus,
  Shield,
  Eye,
  Sparkles,
  Clock,
  ThumbsUp
} from "lucide-react";
import { UserProfile } from "./Onboarding";

interface CommunityPost {
  id: string;
  content: string;
  author: {
    id: string;
    pseudonym: string;
    ageGroup: string;
    avatar: string;
  };
  timestamp: Date;
  likes: number;
  replies: number;
  tags: string[];
  isAnonymous: boolean;
  supportType: 'question' | 'story' | 'tip' | 'celebration';
}

interface CommunityPageProps {
  userProfile: UserProfile;
}

const CommunityPage = ({ userProfile }: CommunityPageProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedSupportType, setSelectedSupportType] = useState<CommunityPost['supportType']>('story');
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState<'all' | 'questions' | 'stories' | 'tips' | 'celebrations'>('all');

  useEffect(() => {
    // Load mock community posts
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        content: "Started my first week of meditation and it's been really helpful for my anxiety. The 5-minute sessions don't feel overwhelming and I'm already noticing I can catch my worried thoughts before they spiral. Anyone else find short practices work better than long ones?",
        author: {
          id: 'user1',
          pseudonym: 'SunnyMind',
          ageGroup: '16-18',
          avatar: '🌻'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        replies: 5,
        tags: ['meditation', 'anxiety', 'tips'],
        isAnonymous: false,
        supportType: 'tip'
      },
      {
        id: '2',
        content: "Feeling really overwhelmed with college applications and everyone seems to have it figured out except me. Is it normal to feel this lost about the future?",
        author: {
          id: 'user2',
          pseudonym: 'Anonymous',
          ageGroup: '16-18',
          avatar: '🎭'
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 8,
        replies: 15,
        tags: ['college', 'future', 'stress'],
        isAnonymous: true,
        supportType: 'question'
      },
      {
        id: '3',
        content: "Three months ago I couldn't get out of bed most days. Today I went on a walk, called a friend, and did something creative. Recovery isn't linear but celebrating these moments feels important. 💚",
        author: {
          id: 'user3',
          pseudonym: 'GreenHeart',
          ageGroup: '19-24',
          avatar: '🌱'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 28,
        replies: 8,
        tags: ['recovery', 'progress', 'hope'],
        isAnonymous: false,
        supportType: 'celebration'
      }
    ];

    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      content: newPost,
      author: {
        id: 'current-user',
        pseudonym: `${userProfile.pronouns?.split('/')[0] || 'Kind'}Friend`,
        ageGroup: userProfile.ageGroup,
        avatar: '🌟'
      },
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      tags: [],
      isAnonymous: false,
      supportType: selectedSupportType
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
  };

  const getSupportTypeIcon = (type: CommunityPost['supportType']) => {
    switch (type) {
      case 'question': return <MessageCircle className="w-4 h-4" />;
      case 'story': return <Heart className="w-4 h-4" />;
      case 'tip': return <Sparkles className="w-4 h-4" />;
      case 'celebration': return <ThumbsUp className="w-4 h-4" />;
    }
  };

  const getSupportTypeColor = (type: CommunityPost['supportType']) => {
    switch (type) {
      case 'question': return 'bg-mood-anxious/20 text-mood-anxious border-mood-anxious/30';
      case 'story': return 'bg-mood-calm/20 text-mood-calm border-mood-calm/30';
      case 'tip': return 'bg-mood-happy/20 text-mood-happy border-mood-happy/30';
      case 'celebration': return 'bg-accent/20 text-accent-bright border-accent/30';
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'questions') return post.supportType === 'question';
    if (filter === 'stories') return post.supportType === 'story';
    if (filter === 'tips') return post.supportType === 'tip';
    if (filter === 'celebrations') return post.supportType === 'celebration';
    return true;
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Community Support</h1>
        <p className="text-muted-foreground">
          A safe, anonymous space to share and connect with others on similar journeys
        </p>
      </div>

      {/* Community Guidelines */}
      <Card className="shadow-gentle border-secondary/20 bg-gradient-calm/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-primary mb-2">Community Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be kind and supportive to everyone</li>
                <li>• Respect privacy and anonymity</li>
                <li>• Share experiences, not medical advice</li>
                <li>• Report content that makes you uncomfortable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Posts', icon: Users },
          { key: 'questions', label: 'Questions', icon: MessageCircle },
          { key: 'stories', label: 'Stories', icon: Heart },
          { key: 'tips', label: 'Tips', icon: Sparkles },
          { key: 'celebrations', label: 'Wins', icon: ThumbsUp },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className={filter === key ? "bg-gradient-primary border-0" : ""}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* New Post Button */}
      {!showNewPost && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowNewPost(true)}
            className="bg-gradient-primary border-0 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Share with Community
          </Button>
        </div>
      )}

      {/* New Post Form */}
      {showNewPost && (
        <Card className="shadow-gentle border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Users className="w-5 h-5 mr-2" />
              Share with Community
            </CardTitle>
            <CardDescription>
              Your post will be shared anonymously with supportive community members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">What kind of post is this?</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'question', label: 'Question', desc: 'Ask for advice or support' },
                  { key: 'story', label: 'Story', desc: 'Share your experience' },
                  { key: 'tip', label: 'Tip', desc: 'Share what helps you' },
                  { key: 'celebration', label: 'Win', desc: 'Celebrate progress' },
                ].map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSupportType(key as any)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedSupportType === key
                        ? 'bg-primary/10 border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {getSupportTypeIcon(key as any)}
                      <span className="ml-2 text-sm font-medium">{label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your thoughts, experiences, or questions. This community is here to support you..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="min-h-[120px]"
            />

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="w-4 h-4 mr-2" />
                Your post will be shared anonymously. Only your age group and a generated pseudonym will be visible.
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowNewPost(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="bg-gradient-primary border-0 hover:opacity-90"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Anonymously
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share something with the community!
            </p>
          </div>
        )}

        {filteredPosts.map((post) => (
          <Card key={post.id} className="shadow-gentle border-secondary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary/30 text-secondary-foreground text-sm">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {post.isAnonymous ? 'Anonymous' : post.author.pseudonym}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {post.author.ageGroup}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs border ${getSupportTypeColor(post.supportType)}`}>
                        {getSupportTypeIcon(post.supportType)}
                        <span className="ml-1 capitalize">{post.supportType}</span>
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(post.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-warning"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed mb-4">
                {post.content}
              </p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Moderated</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;