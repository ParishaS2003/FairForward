import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Gavel, MapPin, FileText, MessageCircle,
  ArrowRight, Shield, PhoneCall, BookOpen, Users, CheckCircle, User, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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

  const services = [
    {
      title: "Legal Assistant",
      description: "Get instant answers to your legal questions",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "/legal-assistant",
    },
    {
      title: "Safe Spaces",
      description: "Find and share safe locations in your area",
      icon: <MapPin className="h-6 w-6" />,
      link: "/safe-spaces",
    },
    {
      title: "Connect to Lawyers",
      description: "Find pro bono legal help",
      icon: <Users className="h-6 w-6" />,
      link: "/pro-bono-qualification",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="p-2 rounded-lg bg-sgc-purple/10 w-fit">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-sgc-purple hover:text-sgc-purple-dark"
                      onClick={() => navigate(service.link)}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
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