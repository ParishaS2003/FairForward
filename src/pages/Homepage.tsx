import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, MessageCircle, FileText, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden bg-gradient-to-b from-white to-sgc-neutral-light">
        <div className="sgc-container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sgc-neutral-dark">
                Welcome to FairForward
              </h1>
              <p className="text-lg text-sgc-neutral mb-8">
                Your trusted platform for legal support, safety resources, and education. 
                Join our community to access comprehensive tools and support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button className="bg-sgc-purple hover:bg-sgc-purple-dark text-white px-8 py-3 rounded-full text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 md:ml-12">
                <h2 className="text-xl font-bold mb-4 text-center">What We Offer</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="sgc-feature-card hover:shadow-md transition-all">
                    <MessageCircle className="mb-2 text-sgc-purple" size={24} />
                    <h3 className="font-medium">LegalBot</h3>
                    <p className="text-sm text-sgc-neutral">AI-powered legal guidance</p>
                  </div>
                  <div className="sgc-feature-card hover:shadow-md transition-all">
                    <MapPin className="mb-2 text-sgc-purple" size={24} />
                    <h3 className="font-medium">Safe Spaces</h3>
                    <p className="text-sm text-sgc-neutral">Find nearby help</p>
                  </div>
                  <div className="sgc-feature-card hover:shadow-md transition-all">
                    <FileText className="mb-2 text-sgc-purple" size={24} />
                    <h3 className="font-medium">Report</h3>
                    <p className="text-sm text-sgc-neutral">Document incidents</p>
                  </div>
                  <div className="sgc-feature-card hover:shadow-md transition-all">
                    <BookOpen className="mb-2 text-sgc-purple" size={24} />
                    <h3 className="font-medium">Learn</h3>
                    <p className="text-sm text-sgc-neutral">Free courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="sgc-section bg-white">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FairForward?</h2>
            <p className="text-sgc-neutral">
              We provide comprehensive support and resources to help you navigate challenges 
              and build a stronger future.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Shield size={24} />}
              title="Safe & Secure"
              description="Your privacy and security are our top priorities. All data is encrypted and protected."
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="Community Support"
              description="Connect with a network of allies, volunteers, and peer support groups."
            />
            <FeatureCard 
              icon={<MessageCircle size={24} />}
              title="24/7 Assistance"
              description="Access our AI LegalBot anytime for immediate guidance and support."
            />
            <FeatureCard 
              icon={<MapPin size={24} />}
              title="Local Resources"
              description="Find verified safe spaces and support services in your area."
            />
            <FeatureCard 
              icon={<BookOpen size={24} />}
              title="Free Education"
              description="Access courses on legal rights, digital literacy, and career skills."
            />
            <FeatureCard 
              icon={<FileText size={24} />}
              title="Documentation"
              description="Safely document incidents with options for anonymity and official reporting."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-sgc-purple text-white">
        <div className="sgc-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join our community today and access the resources you need to move forward with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-sgc-purple hover:bg-white/90 px-8 py-3 rounded-full text-lg"
              >
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 px-8 py-3 rounded-full text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="sgc-card hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sgc-neutral">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Homepage; 