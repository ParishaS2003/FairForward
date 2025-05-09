import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Gavel, MapPin, FileText, MessageCircle, PhoneCall,
  ArrowRight, Shield, Scale, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="pt-16 pb-12 bg-gradient-to-r from-purple-900 to-purple-700 text-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-white/20 text-white mb-4">24/7 Legal Support</Badge>
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Your Path to Legal Support & Safety
              </h1>
              <motion.img 
                src="/mr-hootsworth.png" 
                alt="Mr. Hootsworth the Owl" 
                className="w-12 h-12 md:w-16 md:h-16"
                animate={{ 
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <p className="text-lg text-purple-100 mb-8">
              Free legal assistance, safe spaces, and support services - all in one place
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/chat')}
                className="bg-white text-purple-900 hover:bg-purple-50"
              >
                <MessageCircle className="mr-2" /> Talk to Legal Assistant
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate('/map')}
                className="bg-white text-purple-900 hover:bg-purple-50"
              >
                <MapPin className="mr-2" /> Find Safe Spaces
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Key Services */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Gavel className="h-8 w-8 text-purple-600" />,
                title: "24/7 Legal Assistant",
                desc: "Get instant legal advice and guidance from our AI-powered assistant",
                link: "/chat",
                badge: "Available Now"
              },
              {
                icon: <MapPin className="h-8 w-8 text-blue-600" />,
                title: "Safe Spaces Network",
                desc: "Find verified shelters, support centers, and legal aid offices near you",
                link: "/map",
                badge: "50+ Locations"
              },
              {
                icon: <PhoneCall className="h-8 w-8 text-green-600" />,
                title: "Emergency Support",
                desc: "Immediate assistance and connection to legal professionals",
                link: "/help",
                badge: "24/7 Helpline"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Badge className="mb-4 bg-purple-50 text-purple-700">{service.badge}</Badge>
                      <div className="mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.desc}</p>
                      <Button variant="ghost" className="text-purple-700 hover:text-purple-800">
                        Access Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-8 bg-red-50">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="border-red-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700">Need Immediate Help?</h3>
                  <p className="text-gray-600">Call our 24/7 Emergency Helpline or connect with a legal professional now</p>
                </div>
                <Button 
                  size="lg" 
                  className="ml-auto bg-red-600 hover:bg-red-700"
                  onClick={() => navigate('/emergency')}
                >
                  Get Emergency Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
