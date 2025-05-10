import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, MapPin, MessageCircle, FileText, BookOpen, Users, 
  ArrowRight, ChevronRight, Star, Clock, Award,
  ChevronDown, ChevronUp, MessageSquare, Phone, Mail, Quote, ThumbsUp,
  GraduationCap, Scale, BookText, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Homepage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });
  const [newsRef, newsInView] = useInView({ triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true });
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

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

  // Enhanced FAQ Data with categories
  const faqs = [
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "How does FairForward protect my privacy?",
          answer: "We use end-to-end encryption and strict privacy protocols to ensure your data remains secure. All information is stored according to legal requirements and best practices.",
          helpful: 245
        },
        {
          question: "Is my information shared with third parties?",
          answer: "No, your personal information is never shared with third parties without your explicit consent. We maintain strict data protection policies.",
          helpful: 189
        }
      ]
    },
    {
      category: "Legal Support",
      questions: [
        {
          question: "Is the legal guidance provided by AI reliable?",
          answer: "Our AI LegalBot is trained on verified legal information and regularly updated. However, it's designed to provide general guidance and should not replace professional legal advice.",
          helpful: 312
        },
        {
          question: "How quickly can I get legal assistance?",
          answer: "Our AI LegalBot provides immediate assistance 24/7. For professional legal consultation, response times typically range from 1-24 hours depending on the complexity of your case.",
          helpful: 278
        }
      ]
    },
    {
      category: "Accessibility",
      questions: [
        {
          question: "Are the resources available in multiple languages?",
          answer: "Yes, we provide resources in multiple languages including English, Spanish, Arabic, and more. We're continuously expanding our language support to serve more communities.",
          helpful: 156
        },
        {
          question: "Is the platform accessible for users with disabilities?",
          answer: "Yes, FairForward is designed with accessibility in mind, following WCAG guidelines. We support screen readers, keyboard navigation, and provide alternative text for images.",
          helpful: 134
        }
      ]
    }
  ];

  // Enhanced Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Sarah Martinez",
      role: "Small Business Owner",
      image: "/reviews/sarah.jpg",
      rating: 5,
      date: "March 2024",
      title: "Invaluable Legal Support",
      review: "FairForward's AI legal assistant helped me understand my rights as a small business owner. The guidance was clear, practical, and exactly what I needed.",
      tags: ["Business Law", "AI Support"],
      verified: true
    },
    {
      id: 2,
      name: "James Chen",
      role: "Student",
      image: "/reviews/james.jpg",
      rating: 5,
      date: "February 2024",
      title: "Accessible and Informative",
      review: "As a law student, I find the legal glossary and resources incredibly helpful. The platform makes complex legal concepts easy to understand.",
      tags: ["Education", "Legal Terms"],
      verified: true
    },
    {
      id: 3,
      name: "Aisha Rahman",
      role: "Community Advocate",
      image: "/reviews/aisha.jpg",
      rating: 5,
      date: "March 2024",
      title: "Empowering Communities",
      review: "The multi-language support and cultural sensitivity of FairForward has been crucial in helping our diverse community access legal resources.",
      tags: ["Accessibility", "Community Support"],
      verified: true
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("Privacy & Security");
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sgc-neutral-light p-4">
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
            <div className="max-w-lg flex items-center gap-6">
              <img 
                src="/mr-hootsworth.png" 
                alt="Mascot" 
                className="h-24 w-24 md:h-32 md:w-32 animate-sway"
                style={{ animation: 'sway 2.5s ease-in-out infinite' }}
              />
              <style>{`
                @keyframes sway {
                  0% { transform: translateX(0) rotate(-3deg); }
                  25% { transform: translateX(10px) rotate(3deg); }
                  50% { transform: translateX(0) rotate(-3deg); }
                  75% { transform: translateX(-10px) rotate(3deg); }
                  100% { transform: translateX(0) rotate(-3deg); }
                }
              `}</style>
              <div>
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
                    icon={<BookOpen className="mb-2 text-sgc-purple" size={24} />}
                    title="Learn"
                    description="Free courses"
                  />
                  <FeatureIcon 
                    icon={<Shield className="mb-2 text-sgc-purple" size={24} />}
                    title="Legal Terms"
                    description="Simple definitions"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="sgc-section bg-white py-16">
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
          </div>
        </div>
      </section>

      {/* Learning Hub Section */}
      <section className="py-16 bg-sgc-neutral-light">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Legal Resource Center</h2>
            <p className="text-sgc-neutral">
              Access the tools and information you need for immediate legal support and guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-sgc-purple-light/20 flex items-center justify-center mb-4">
                  <Scale className="text-sgc-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quick Legal Guides</h3>
                <p className="text-sgc-neutral mb-4">
                  Step-by-step guidance for common legal situations and immediate actions to take
                </p>
                <Button variant="link" className="text-sgc-purple hover:text-sgc-purple-dark">
                  View Guides <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-sgc-purple-light/20 flex items-center justify-center mb-4">
                  <BookText className="text-sgc-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Document Templates</h3>
                <p className="text-sgc-neutral mb-4">
                  Ready-to-use legal document templates with simple fill-in instructions
                </p>
                <Button variant="link" className="text-sgc-purple hover:text-sgc-purple-dark">
                  Get Templates <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-sgc-purple-light/20 flex items-center justify-center mb-4">
                  <MessageSquare className="text-sgc-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Legal Chat Support</h3>
                <p className="text-sgc-neutral mb-4">
                  Get instant answers to your legal questions from our AI assistant and community
                </p>
                <Button variant="link" className="text-sgc-purple hover:text-sgc-purple-dark">
                  Start Chat <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-sgc-purple-light/20 flex items-center justify-center mb-4">
                  <Users className="text-sgc-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Community Support</h3>
                <p className="text-sgc-neutral mb-4">
                  Connect with others who have faced similar situations and share experiences
                </p>
                <Button variant="link" className="text-sgc-purple hover:text-sgc-purple-dark">
                  Join Community <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/resources">
              <Button 
                size="lg"
                className="bg-sgc-purple text-white hover:bg-sgc-purple-dark px-8 py-3 rounded-full text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Access Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-16 bg-white">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sgc-neutral">
              Find answers to common questions about our platform and services
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
            {/* Category Navigation */}
            <div className="md:w-1/4">
              <div className="sticky top-4 space-y-2">
                {faqs.map((category) => (
                  <Button
                    key={category.category}
                    variant={selectedCategory === category.category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    {category.category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="md:w-3/4 space-y-4">
              {faqs
                .find((cat) => cat.category === selectedCategory)
                ?.questions.map((faq, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                        {activeQuestion === index ? (
                          <ChevronUp className="text-sgc-purple" />
                        ) : (
                          <ChevronDown className="text-sgc-purple" />
                        )}
                      </div>
                      <AnimatePresence>
                        {activeQuestion === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="mt-4 text-sgc-neutral">{faq.answer}</p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-sgc-neutral">
                              <ThumbsUp size={14} />
                              <span>{faq.helpful} people found this helpful</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-sgc-neutral-light">
        <div className="sgc-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-sgc-neutral">
              Real experiences from people who have found support through FairForward
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.image} alt={review.name} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{review.name}</h3>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified User
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-sgc-neutral">{review.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-sgc-neutral mb-4">{review.review}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-sgc-neutral">
                    <span>{review.date}</span>
                    <Button variant="ghost" size="sm" className="text-sgc-purple">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
                className="bg-white text-sgc-purple hover:bg-white/90 px-8 py-3 rounded-full text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

export default Homepage; 