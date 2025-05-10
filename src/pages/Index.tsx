import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Gavel, MapPin, FileText, MessageCircle,
  ArrowRight, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });

  // Animation variants with gentler transitions
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section with improved readability */}
      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="pt-20 pb-16 px-6 md:px-8 bg-gradient-to-b from-purple-50 to-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Legal Support Made Simple
            </h1>
            <motion.img 
              src="/mr-hootsworth.png" 
              alt="Mr. Hootsworth the Owl" 
              className="w-16 h-16 md:w-20 md:h-20"
              animate={{ 
                rotate: [0, 5, 0],
                y: [0, -3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Get immediate legal assistance, find safe spaces, and connect with support services - all in one place.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Services with enhanced readability */}
      <section className="py-16 px-6 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 lg:gap-10"
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
                color: "indigo",
                link: "/map",
                cta: "Find Spaces"
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Report Incident",
                description: "File a secure report and get connected with legal support.",
                color: "purple",
                link: "/report",
                cta: "File Report"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="relative"
              >
                <Link to={service.link}>
                  <Card className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-8">
                      <div className={`h-14 w-14 rounded-full bg-${service.color}-100 flex items-center justify-center text-${service.color}-600 mb-6`}>
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-8 leading-relaxed min-h-[3rem]">
                        {service.description}
                      </p>
                      <Button 
                        className={`w-full bg-${service.color}-600 hover:bg-${service.color}-700 text-white font-medium`}
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

      {/* Stats Section with improved contrast */}
      <section className="py-16 px-6 md:px-8 bg-purple-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-10 text-center"
          >
            {[
              { value: "24/7", label: "Legal Assistant Available" },
              { value: "50+", label: "Safe Spaces" },
              { value: "100%", label: "Free Legal Consultation" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="bg-purple-800/50 rounded-xl p-8"
              >
                <motion.h3 
                  className="text-4xl font-bold mb-3 text-white"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-lg text-purple-100 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
