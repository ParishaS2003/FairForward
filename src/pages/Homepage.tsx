import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, MapPin, MessageCircle, FileText, BookOpen, Users, 
  ArrowRight, ChevronRight, Star, TrendingUp, Award, Heart,
  Calendar, Clock, CheckCircle2, ArrowUpRight, ChevronDown,
  ChevronUp, CalendarDays, Users2, Megaphone, GraduationCap,
  Building2, Globe, Phone, Mail, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Homepage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });
  const [newsRef, newsInView] = useInView({ triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true });

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Statistics data
  const stats = [
    { number: "10K+", label: "Users Helped", icon: <Users className="text-sgc-purple" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="text-sgc-purple" /> },
    { number: "500+", label: "Safe Spaces", icon: <MapPin className="text-sgc-purple" /> },
    { number: "98%", label: "Success Rate", icon: <TrendingUp className="text-sgc-purple" /> }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "FairForward helped me understand my rights and find the support I needed during a difficult time.",
      author: "Sarah M.",
      role: "Community Member",
      rating: 5
    },
    {
      quote: "The legal guidance and resources provided were invaluable. I'm grateful for this platform.",
      author: "James K.",
      role: "Student",
      rating: 5
    },
    {
      quote: "A safe space that truly understands and supports. Thank you for being there.",
      author: "Maria L.",
      role: "Professional",
      rating: 5
    }
  ];

  // News/Updates data
  const news = [
    {
      title: "New Legal Rights Course Available",
      date: "March 15, 2024",
      category: "Education",
      icon: <BookOpen className="text-sgc-purple" />
    },
    {
      title: "Expanded Support Network",
      date: "March 10, 2024",
      category: "Community",
      icon: <Users className="text-sgc-purple" />
    },
    {
      title: "Updated Safety Guidelines",
      date: "March 5, 2024",
      category: "Resources",
      icon: <Shield className="text-sgc-purple" />
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How does FairForward protect my privacy?",
      answer: "We use end-to-end encryption and strict privacy protocols to ensure your data remains secure. All information is stored according to legal requirements and best practices."
    },
    {
      question: "Is the legal guidance provided by AI reliable?",
      answer: "Our AI LegalBot is trained on verified legal information and regularly updated. However, it's designed to provide general guidance and should not replace professional legal advice."
    },
    {
      question: "How can I report an incident safely?",
      answer: "You can report incidents through our secure platform. We offer options for anonymous reporting and provide guidance throughout the process."
    },
    {
      question: "Are the resources available in multiple languages?",
      answer: "Yes, we provide resources in multiple languages and are continuously expanding our language support to serve more communities."
    }
  ];

  // Events Data
  const events = {
    upcoming: [
      {
        title: "Legal Rights Workshop",
        date: "March 20, 2024",
        time: "2:00 PM EST",
        type: "Workshop",
        icon: <GraduationCap className="text-sgc-purple" />
      },
      {
        title: "Community Support Meetup",
        date: "March 25, 2024",
        time: "6:00 PM EST",
        type: "Networking",
        icon: <Users2 className="text-sgc-purple" />
      },
      {
        title: "Digital Safety Training",
        date: "April 1, 2024",
        time: "3:00 PM EST",
        type: "Training",
        icon: <Shield className="text-sgc-purple" />
      }
    ],
    past: [
      {
        title: "Legal Rights Workshop",
        date: "March 15, 2024",
        time: "2:00 PM EST",
        type: "Workshop",
        icon: <GraduationCap className="text-sgc-purple" />
      },
      {
        title: "Community Support Meetup",
        date: "March 10, 2024",
        time: "6:00 PM EST",
        type: "Networking",
        icon: <Users2 className="text-sgc-purple" />
      }
    ]
  };

  // Community Highlights
  const communityHighlights = [
    {
      title: "Success Story",
      content: "How FairForward helped Sarah navigate a workplace discrimination case",
      image: "https://placehold.co/400x300",
      category: "Success Story"
    },
    {
      title: "Community Impact",
      content: "Our platform has helped over 10,000 people access legal support",
      image: "https://placehold.co/400x300",
      category: "Impact"
    },
    {
      title: "Volunteer Spotlight",
      content: "Meet our dedicated volunteers making a difference",
      image: "https://placehold.co/400x300",
      category: "Volunteers"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden bg-gradient-to-b from-white to-sgc-neutral-light">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="sgc-container relative z-10">
          <motion.div 
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="max-w-lg">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-sgc-neutral-dark"
              >
                Welcome to FairForward
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-sgc-neutral mb-8"
              >
                Your trusted platform for legal support, safety resources, and education. 
                Join our community to access comprehensive tools and support.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/signup">
                  <Button className="bg-sgc-purple hover:bg-sgc-purple-dark text-white px-8 py-3 rounded-full text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white transform transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 md:ml-12 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-center">What We Offer</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FeatureIcon 
                    icon={<MessageCircle className="mb-2 text-sgc-purple" size={24} />}
                    title="LegalBot"
                    description="AI-powered legal guidance"
                  />
                  <FeatureIcon 
                    icon={<MapPin className="mb-2 text-sgc-purple" size={24} />}
                    title="Safe Spaces"
                    description="Find nearby help"
                  />
                  <FeatureIcon 
                    icon={<FileText className="mb-2 text-sgc-purple" size={24} />}
                    title="Report"
                    description="Document incidents"
                  />
                  <FeatureIcon 
                    icon={<BookOpen className="mb-2 text-sgc-purple" size={24} />}
                    title="Learn"
                    description="Free courses"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-b from-sgc-neutral-light to-white"
      >
        <div className="sgc-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-sgc-purple mb-2">{stat.number}</h3>
                <p className="text-sgc-neutral">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="sgc-section bg-white">
        <div className="sgc-container">
          <motion.div 
            ref={featuresRef}
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose FairForward?</h2>
            <p className="text-sgc-neutral">
              We provide comprehensive support and resources to help you navigate challenges 
              and build a stronger future.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedFeatureCard 
              icon={<Shield size={24} />}
              title="Safe & Secure"
              description="Your privacy and security are our top priorities. All data is encrypted and protected."
              delay={0.2}
            />
            <AnimatedFeatureCard 
              icon={<Users size={24} />}
              title="Community Support"
              description="Connect with a network of allies, volunteers, and peer support groups."
              delay={0.3}
            />
            <AnimatedFeatureCard 
              icon={<MessageCircle size={24} />}
              title="24/7 Assistance"
              description="Access our AI LegalBot anytime for immediate guidance and support."
              delay={0.4}
            />
            <AnimatedFeatureCard 
              icon={<MapPin size={24} />}
              title="Local Resources"
              description="Find verified safe spaces and support services in your area."
              delay={0.5}
            />
            <AnimatedFeatureCard 
              icon={<BookOpen size={24} />}
              title="Free Education"
              description="Access courses on legal rights, digital literacy, and career skills."
              delay={0.6}
            />
            <AnimatedFeatureCard 
              icon={<FileText size={24} />}
              title="Documentation"
              description="Safely document incidents with options for anonymity and official reporting."
              delay={0.7}
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <motion.section 
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-sgc-neutral-light"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-sgc-neutral">
              Hear from people who have found support and guidance through FairForward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                      ))}
                    </div>
                    <p className="text-sgc-neutral mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple mr-3">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-sgc-neutral">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* News & Updates Section */}
      <motion.section 
        ref={newsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
            <p className="text-sgc-neutral">
              Stay informed about new resources, features, and community news.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={newsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center mr-3 group-hover:bg-sgc-purple group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <span className="text-sm text-sgc-neutral">{item.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-sgc-purple transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-sgc-neutral mb-4">{item.date}</p>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center text-sgc-purple group-hover:text-sgc-purple-dark"
                    >
                      <span className="text-sm font-medium">Read more</span>
                      <ArrowUpRight size={16} className="ml-1" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sgc-neutral">
              Find answers to common questions about our platform and services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={newsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFAQ === index ? 'shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{faq.question}</h3>
                      {activeFAQ === index ? (
                        <ChevronUp className="text-sgc-purple" />
                      ) : (
                        <ChevronDown className="text-sgc-purple" />
                      )}
                    </div>
                    <AnimatePresence>
                      {activeFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 text-sgc-neutral"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events Calendar Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-sgc-neutral-light"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-sgc-neutral">
              Join our community events, workshops, and training sessions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8 space-x-4">
              <Button
                variant={activeTab === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upcoming')}
                className="rounded-full"
              >
                Upcoming Events
              </Button>
              <Button
                variant={activeTab === 'past' ? 'default' : 'outline'}
                onClick={() => setActiveTab('past')}
                className="rounded-full"
              >
                Past Events
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {events[activeTab as keyof typeof events].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={newsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center flex-shrink-0">
                          {event.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <div className="space-y-1">
                            <p className="text-sgc-neutral flex items-center">
                              <CalendarDays size={16} className="mr-2" />
                              {event.date}
                            </p>
                            <p className="text-sgc-neutral flex items-center">
                              <Clock size={16} className="mr-2" />
                              {event.time}
                            </p>
                            <p className="text-sgc-neutral flex items-center">
                              <Megaphone size={16} className="mr-2" />
                              {event.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Community Highlights Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Highlights</h2>
            <p className="text-sgc-neutral">
              Stories of impact and success from our community members.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {communityHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={newsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48">
                    <img 
                      src={highlight.image} 
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-sgc-purple text-white px-3 py-1 rounded-full text-sm">
                      {highlight.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                    <p className="text-sgc-neutral mb-4">{highlight.content}</p>
                    <Button 
                      variant="ghost" 
                      className="text-sgc-purple hover:text-sgc-purple-dark p-0"
                    >
                      Read More <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-sgc-neutral-light"
      >
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-sgc-neutral">
              Have questions? We're here to help. Choose your preferred way to reach us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ContactCard 
              icon={<MessageSquare className="text-sgc-purple" />}
              title="Live Chat"
              description="Chat with our support team"
              action="Start Chat"
            />
            <ContactCard 
              icon={<Phone className="text-sgc-purple" />}
              title="Phone Support"
              description="Call us at 1-800-HELP"
              action="Call Now"
            />
            <ContactCard 
              icon={<Mail className="text-sgc-purple" />}
              title="Email Us"
              description="support@fairforward.org"
              action="Send Email"
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        initial={{ opacity: 0, y: 20 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-r from-sgc-purple to-sgc-purple-dark text-white"
      >
        <div className="sgc-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join our community today and access the resources you need to move forward with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-sgc-purple hover:bg-white/90 px-8 py-3 rounded-full text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 px-8 py-3 rounded-full text-lg transform transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const FeatureIcon = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="sgc-feature-card hover:shadow-md transition-all p-4 rounded-lg cursor-pointer"
    >
      {icon}
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-sgc-neutral">{description}</p>
    </motion.div>
  );
};

const AnimatedFeatureCard = ({ 
  icon, 
  title, 
  description,
  delay
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="sgc-card hover:-translate-y-1 transition-all duration-300 group">
        <CardContent className="p-6">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple mb-4 group-hover:bg-sgc-purple group-hover:text-white transition-colors duration-300"
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-sgc-purple transition-colors duration-300">{title}</h3>
          <p className="text-sgc-neutral">{description}</p>
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="mt-4 flex items-center text-sgc-purple group-hover:text-sgc-purple-dark"
          >
            <span className="text-sm font-medium">Learn more</span>
            <ChevronRight size={16} className="ml-1" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ContactCard = ({ 
  icon, 
  title, 
  description,
  action
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  action: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
    >
      <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sgc-neutral mb-4">{description}</p>
      <Button 
        variant="outline" 
        className="text-sgc-purple hover:text-sgc-purple-dark"
      >
        {action}
      </Button>
    </motion.div>
  );
};

export default Homepage; 