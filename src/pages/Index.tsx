import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, MapPin, MessageCircle, FileText, BookOpen, Users, ArrowRight, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  const handleFindHelpClick = () => {
    navigate('/signup');
  };

  const handleLearnMoreClick = () => {
    navigate('/learn');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden bg-gradient-to-b from-white to-sgc-neutral-light">
        <div className="sgc-container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h1 className="sgc-heading-1 mb-6">
                Empowering Communities Through Safety & Knowledge
              </h1>
              <p className="text-lg text-sgc-neutral mb-8">
                SafeGround Connect provides legal support, safety resources, and education to marginalized communities—powered by AI, local networks, and open data.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleFindHelpClick}
                  className="bg-sgc-purple hover:bg-sgc-purple-dark text-white px-8 py-3 rounded-full text-lg"
                >
                  Find Help Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white"
                  onClick={handleLearnMoreClick}
                >
                  Learn More
                </Button>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-sgc-purple-light flex items-center justify-center">
                      <User size={16} className="text-sgc-purple" />
                    </div>
                  ))}
                </div>
                <p className="ml-4 text-sm text-sgc-neutral">
                  <strong>2,400+</strong> community members helped this month
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 md:ml-12">
                <h2 className="text-xl font-bold mb-4 text-center">How can we help you today?</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/chat" className="sgc-feature-card hover:shadow-md transition-all">
                    <MessageCircle className="mb-2 text-sgc-purple" />
                    <h3 className="font-medium">LegalBot</h3>
                    <p className="text-sm text-sgc-neutral">Get legal guidance</p>
                  </Link>
                  <Link to="/map" className="sgc-feature-card hover:shadow-md transition-all">
                    <MapPin className="mb-2 text-sgc-purple" />
                    <h3 className="font-medium">Safe Spaces</h3>
                    <p className="text-sm text-sgc-neutral">Find nearby help</p>
                  </Link>
                  <Link to="/report" className="sgc-feature-card hover:shadow-md transition-all">
                    <FileText className="mb-2 text-sgc-purple" />
                    <h3 className="font-medium">Report</h3>
                    <p className="text-sm text-sgc-neutral">Document an incident</p>
                  </Link>
                  <Link to="/learn" className="sgc-feature-card hover:shadow-md transition-all">
                    <BookOpen className="mb-2 text-sgc-purple" />
                    <h3 className="font-medium">Learn</h3>
                    <p className="text-sm text-sgc-neutral">Free courses</p>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white">
                    Emergency Support
                  </Button>
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
            <h2 className="sgc-heading-2 mb-4">Our Core Features</h2>
            <p className="text-sgc-neutral">
              SafeGround Connect offers a comprehensive set of tools to help you navigate legal challenges, 
              find safety, and build valuable skills for personal and professional growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<MessageCircle size={24} />}
              title="AI Legal Assistant"
              description="Get instant answers to legal questions through our AI-powered LegalBot, trained on regional laws and resources."
              linkTo="/chat"
            />
            <FeatureCard 
              icon={<MapPin size={24} />}
              title="Safe Space Mapping"
              description="Find nearby shelters, legal clinics, and community safe spaces verified by trusted partners."
              linkTo="/map"
            />
            <FeatureCard 
              icon={<FileText size={24} />}
              title="Incident Reporting"
              description="Document harassment or discrimination incidents with options for anonymity and official reporting."
              linkTo="/report"
            />
            <FeatureCard 
              icon={<BookOpen size={24} />}
              title="Free Education Hub"
              description="Access courses on digital literacy, finance, career skills, and legal knowledge in multiple languages."
              linkTo="/learn"
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="Community Network"
              description="Connect with allies, volunteers, and peer support groups to build your safety network."
              linkTo="/"
            />
            <FeatureCard 
              icon={<Shield size={24} />}
              title="Emergency Resources"
              description="Quick access to emergency contacts and step-by-step guidance during crisis situations."
              linkTo="/"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="sgc-section bg-sgc-neutral-light">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="sgc-heading-2 mb-4">How It Works</h2>
            <p className="text-sgc-neutral">
              SafeGround Connect is designed to be intuitive and accessible for all users, 
              with multiple pathways to get the support you need.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute left-1/2 top-12 bottom-0 w-0.5 bg-sgc-purple/20 -translate-x-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="md:text-right">
                <h3 className="text-xl font-bold text-sgc-purple mb-3">1. Identify Your Needs</h3>
                <p className="text-sgc-neutral mb-4">
                  Whether you're seeking legal guidance, a safe space, or want to report an incident, 
                  start by selecting the appropriate feature from our homepage.
                </p>
              </div>
              <div className="relative">
                <div className="md:absolute md:left-0 md:top-0 md:-translate-x-1/2 bg-white rounded-full p-4 shadow-md z-10 inline-flex">
                  <div className="h-12 w-12 rounded-full bg-sgc-purple flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="md:order-2">
                <h3 className="text-xl font-bold text-sgc-purple mb-3">2. Access Resources</h3>
                <p className="text-sgc-neutral mb-4">
                  Use our AI LegalBot for instant guidance, browse the map to find nearby safe spaces, 
                  or file a report through our secure form.
                </p>
              </div>
              <div className="relative md:order-1">
                <div className="md:absolute md:right-0 md:top-0 md:translate-x-1/2 bg-white rounded-full p-4 shadow-md z-10 inline-flex">
                  <div className="h-12 w-12 rounded-full bg-sgc-purple flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:text-right">
                <h3 className="text-xl font-bold text-sgc-purple mb-3">3. Get Support</h3>
                <p className="text-sgc-neutral mb-4">
                  Connect with verified organizations, legal aid providers, or community allies 
                  who can provide the specific support you need.
                </p>
              </div>
              <div className="relative">
                <div className="md:absolute md:left-0 md:top-0 md:-translate-x-1/2 bg-white rounded-full p-4 shadow-md z-10 inline-flex">
                  <div className="h-12 w-12 rounded-full bg-sgc-purple flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="md:order-2">
                <h3 className="text-xl font-bold text-sgc-purple mb-3">4. Learn & Empower</h3>
                <p className="text-sgc-neutral mb-4">
                  Build your knowledge and skills through our free educational courses
                  and become more confident in advocating for yourself and others.
                </p>
              </div>
              <div className="relative md:order-1">
                <div className="md:absolute md:right-0 md:top-0 md:translate-x-1/2 bg-white rounded-full p-4 shadow-md z-10 inline-flex">
                  <div className="h-12 w-12 rounded-full bg-sgc-purple flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="sgc-section bg-white">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="sgc-heading-2 mb-4">Community Impact</h2>
            <p className="text-sgc-neutral">
              Read stories from our community members who have found support, safety, and empowerment through SafeGround Connect.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="The legal advice I received through LegalBot helped me understand my rights in a workplace discrimination case. I'm now connected with a pro bono lawyer."
              name="Maria S."
              location="Chennai, India"
            />
            <TestimonialCard 
              quote="When I needed to escape a dangerous situation, the Safe Space map helped me find an emergency shelter just minutes away. It potentially saved my life."
              name="Layla T."
              location="Nairobi, Kenya"
              featured={true}
            />
            <TestimonialCard 
              quote="The digital literacy courses gave me the skills I needed to apply for online jobs. I'm now working remotely and financially independent."
              name="Carlos M."
              location="Bogotá, Colombia"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sgc-purple to-sgc-blue text-white">
        <div className="sgc-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            SafeGround Connect is free to use and accessible to everyone. Join our community today and access the resources you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-sgc-purple hover:bg-white/90">
              Find Help Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 pt-12 border-t border-white/20 grid md:grid-cols-4 gap-6 text-left">
            <div>
              <h3 className="font-bold text-lg mb-3">SafeGround Connect</h3>
              <p className="text-white/70 text-sm">
                A multilingual platform providing legal support, safety resources, and education to marginalized communities.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Legal AI Assistant</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Safe Space Map</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Incident Reporting</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Education Hub</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>About Us</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Partner Organizations</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Privacy Policy</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Terms of Service</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Help & Support</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Become a Partner</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Volunteer</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  <span>Report a Bug</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  linkTo 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  linkTo: string;
}) => {
  return (
    <Card className="sgc-card hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sgc-neutral mb-4">{description}</p>
        <Link 
          to={linkTo} 
          className="text-sgc-purple font-medium flex items-center hover:underline"
        >
          Learn more
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ 
  quote, 
  name, 
  location,
  featured = false
}: { 
  quote: string; 
  name: string; 
  location: string;
  featured?: boolean;
}) => {
  return (
    <Card className={`sgc-card ${featured ? 'border-sgc-purple ring-1 ring-sgc-purple/20' : ''}`}>
      <CardContent className="p-6">
        <div className="mb-4 text-sgc-purple">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className="inline-block mr-1">★</span>
          ))}
        </div>
        <p className="italic mb-6 text-sgc-neutral-dark">{quote}</p>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center mr-3">
            <User size={16} className="text-sgc-purple" />
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-xs text-sgc-neutral">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
