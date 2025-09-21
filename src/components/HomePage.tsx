import { MessageCircle, Shield, Users, Heart, ArrowRight, Sparkles, BookOpen, PenTool, Activity, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-wellness.png";

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Safe Conversations",
      description: "Chat anonymously with our AI companion trained in evidence-based wellness techniques.",
    },
    {
      icon: Shield,
      title: "Crisis Detection",
      description: "Advanced safety features detect when you need immediate help and connect you to resources.",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Always available when you need someone to talk to, with complete privacy and understanding.",
    },
    {
      icon: Heart,
      title: "Evidence-Based Care",
      description: "Techniques rooted in CBT, mindfulness, and proven therapeutic approaches for youth.",
    },
    {
      icon: Activity,
      title: "Mood Tracking",
      description: "Track your emotional patterns and gain insights to better understand your wellbeing.",
    },
    {
      icon: PenTool,
      title: "Guided Journaling",
      description: "Daily reflective prompts to help you process thoughts and build emotional resilience.",
    },
    {
      icon: BookOpen,
      title: "Mindfulness Library",
      description: "Access meditations, exercises, and bite-sized lessons to reduce stress and anxiety.",
    },
    {
      icon: Handshake,
      title: "Peer Support",
      description: "Connect with safe communities and shared stories to know you’re not alone.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br primary-light via-wellness-calm to-wellness-hope">
        <div className="container px-6 py-12 mx-auto lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>Confidential • Safe • Empathetic</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight">
                  Your Safe Space for
                  <span className="bg-gradient-to-r text-primary bg-clip-text">
                    {" "}Mental Wellness
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Connect with our AI wellness companion for confidential support, evidence-based coping strategies,
                  and 24/7 emotional guidance designed specifically for youth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  <Link to="/chat-interface">
                    Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-border hover:bg-accent hover:text-foreground">
                  <Link to="/resources-page">
                    View Resources
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Anonymous & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Always Available</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Youth mental wellness support illustration"
                className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-lg animate-float"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full animate-breathe" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-wellness-warm/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              Built for Your <span className="text-primary">Mental Wellbeing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines AI technology with evidence-based therapeutic approaches
              to provide safe, confidential, and effective mental wellness support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center shadow-md hover:shadow-lg transition-all border-border"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container px-6 mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Start Chat</h3>
              <p className="text-muted-foreground">Open a safe, private chat with our AI wellness companion anytime you need.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Get Guidance</h3>
              <p className="text-muted-foreground">Receive personalized coping strategies and mental health resources.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Grow Stronger</h3>
              <p className="text-muted-foreground">Build resilience and track your progress with ongoing support tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container px-6 mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12">What Young People Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md">
              <p className="text-muted-foreground italic">“This platform feels like a safe friend who actually listens and cares.”</p>
              <span className="block mt-4 font-semibold">— Aditi, 19</span>
            </Card>
            <Card className="p-6 shadow-md">
              <p className="text-muted-foreground italic">“The journaling prompts helped me organize my thoughts and reduce anxiety.”</p>
              <span className="block mt-4 font-semibold">— Rohan, 21</span>
            </Card>
            <Card className="p-6 shadow-md">
              <p className="text-muted-foreground italic">“Having 24/7 support gave me confidence that I’m not alone anymore.”</p>
              <span className="block mt-4 font-semibold">— Sneha, 20</span>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container px-6 mx-auto text-center grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-4xl font-extrabold text-primary">5K+</h3>
            <p className="text-muted-foreground mt-2">Conversations Started</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-primary">1K+</h3>
            <p className="text-muted-foreground mt-2">Lives Positively Impacted</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-primary">24/7</h3>
            <p className="text-muted-foreground mt-2">Continuous Availability</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary-glow relative overflow-hidden">
        <div className="container px-6 mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of young people who have found support, coping strategies,
              and a safe space to express their feelings.
            </p>
            <Button asChild size="lg" variant="secondary" className="shadow-lg hover:shadow-xl">
              <Link to="/chat-interface">
                Start Your First Conversation <MessageCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-breathe" />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-background">
        <div className="container px-6 mx-auto text-center max-w-xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">Subscribe to our newsletter for wellness tips, resources, and updates.</p>
          <div className="flex gap-2 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="default">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
