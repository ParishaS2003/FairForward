import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Clock, MapPin, BookOpen, Users, Shield } from 'lucide-react';

const Homepage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });
  const [newsRef, newsInView] = useInView({ triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true });

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Simplified statistics data
  const stats = [
    { number: "24/7", label: "Support Available", icon: <Clock className="text-sgc-purple" /> },
    { number: "500+", label: "Safe Spaces", icon: <MapPin className="text-sgc-purple" /> }
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sgc-neutral-light p-4">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden bg-gradient-to-b from-white to-sgc-neutral-light">
        {/* ... existing hero section code ... */}
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
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
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
        {/* ... existing features section code ... */}
      </section>
      
      {/* Testimonials Section */}
      <motion.section 
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-sgc-neutral-light"
      >
        {/* ... existing testimonials section code ... */}
      </motion.section>

      {/* News & Updates Section */}
      <motion.section 
        ref={newsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        {/* ... existing news section code ... */}
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        {/* ... existing FAQ section code ... */}
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-sgc-neutral-light"
      >
        {/* ... existing contact section code ... */}
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        initial={{ opacity: 0, y: 20 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-r from-sgc-purple to-sgc-purple-dark text-white"
      >
        {/* ... existing CTA section code ... */}
      </motion.section>
    </div>
  );
};

export default Homepage; 