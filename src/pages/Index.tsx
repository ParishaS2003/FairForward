import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Gavel, MapPin, FileText, MessageCircle,
  ArrowRight, Shield, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with improved readability */}
      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="pt-16 pb-12 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900">
              Legal Support Made Simple
              </h1>
            <motion.img 
              src="/mr-hootsworth.png" 
              alt="Mr. Hootsworth the Owl" 
              className="w-16 h-16 md:w-20 md:h-20"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Get immediate legal assistance, find safe spaces, and connect with support services - all in one place.
          </motion.p>

          {/* Emergency Button */}
          <motion.div
            variants={fadeInUp}
            className="mb-12"
          >
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/emergency')}
            >
              <PhoneCall className="mr-2 h-6 w-6" />
              24/7 Emergency Help
                </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Services */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <MessageCircle className="h-8 w-8" />,
                title: "Legal Assistant",
                description: "Get instant answers to your legal questions from our AI-powered assistant.",
                color: "purple",
                link: "/chat",
                cta: "Chat Now"
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Safe Spaces",
                description: "Find verified shelters and support centers near you.",
                color: "blue",
                link: "/map",
                cta: "Find Spaces"
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Report Incident",
                description: "File a secure report and get connected with legal support.",
                color: "indigo",
                link: "/report",
                cta: "File Report"
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
                    <CardContent className="p-8">
                      <div className={`h-16 w-16 rounded-full bg-${service.color}-100 flex items-center justify-center text-${service.color}-600 mb-6`}>
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <Button 
                        className={`w-full bg-${service.color}-600 hover:bg-${service.color}-700 text-white`}
                      >
                        {service.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-purple-200">Legal Assistant Available</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-purple-200">Safe Spaces</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">100%</h3>
              <p className="text-purple-200">Free Legal Consultation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;