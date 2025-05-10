import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Calendar,
  MessageSquare,
  Globe,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const ProBonoDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isHootsworthVisible, setIsHootsworthVisible] = useState(true);
  const [hootsworthMessage, setHootsworthMessage] = useState("");

  // Mock data for lawyers
  const lawyers = [
    {
      id: 1,
      name: "Sarah Martinez",
      image: "https://ui-avatars.com/api/?name=Sarah+Martinez&background=6366f1&color=fff",
      specialties: ["Family Law", "Domestic Violence"],
      location: "San Francisco, CA",
      languages: ["English", "Spanish"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      description: "Specializing in family law and domestic violence cases, dedicated to helping families in need.",
      certifications: ["California State Bar", "Family Law Specialist"],
      successRate: "92%",
      email: "sarah.m@fairforward.org",
      phone: "(415) 555-0123",
      nextAvailable: "2 days"
    },
    {
      id: 2,
      name: "James Chen",
      image: "https://ui-avatars.com/api/?name=James+Chen&background=6366f1&color=fff",
      specialties: ["Immigration", "Civil Rights"],
      location: "New York, NY",
      languages: ["English", "Mandarin", "Cantonese"],
      availability: "Mon-Thu, 10 AM - 6 PM",
      rating: 4.8,
      reviews: 93,
      experience: "12 years",
      description: "Experienced in immigration law and civil rights advocacy, committed to social justice.",
      certifications: ["New York State Bar", "Immigration Law Certification"],
      successRate: "89%",
      email: "james.c@fairforward.org",
      phone: "(212) 555-0456",
      nextAvailable: "3 days"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      image: "https://ui-avatars.com/api/?name=Maria+Rodriguez&background=6366f1&color=fff",
      specialties: ["Housing Law", "Tenant Rights"],
      location: "Los Angeles, CA",
      languages: ["English", "Spanish"],
      availability: "Tue-Sat, 9 AM - 5 PM",
      rating: 4.9,
      reviews: 156,
      experience: "10 years",
      description: "Focused on housing rights and tenant protection, helping ensure safe and fair housing.",
      certifications: ["California State Bar", "Housing Rights Advocate"],
      successRate: "94%",
      email: "maria.r@fairforward.org",
      phone: "(323) 555-0789",
      nextAvailable: "1 day"
    },
    {
      id: 4,
      name: "David Kim",
      image: "https://ui-avatars.com/api/?name=David+Kim&background=6366f1&color=fff",
      specialties: ["Employment Law", "Discrimination"],
      location: "Chicago, IL",
      languages: ["English", "Korean"],
      availability: "Mon-Fri, 8 AM - 4 PM",
      rating: 4.7,
      reviews: 88,
      experience: "15 years",
      description: "Expert in employment law and workplace discrimination cases.",
      certifications: ["Illinois State Bar", "Employment Law Specialist"],
      successRate: "91%",
      email: "david.k@fairforward.org",
      phone: "(312) 555-0321",
      nextAvailable: "4 days"
    },
    {
      id: 5,
      name: "Mr. Hootsworth",
      image: "https://ui-avatars.com/api/?name=Mr+Hootsworth&background=6366f1&color=fff",
      specialties: ["Wildlife Law", "Environmental Protection"],
      location: "Portland, OR",
      languages: ["English", "Hoot"],
      availability: "Mon-Sun, 24/7",
      rating: 5.0,
      reviews: 200,
      experience: "25 years",
      description: "A wise and experienced owl attorney specializing in wildlife and environmental law. Known for his nocturnal availability and exceptional wisdom in complex cases.",
      certifications: ["Oregon State Bar", "Wildlife Law Expert"],
      successRate: "98%",
      email: "hootsworth@fairforward.org",
      phone: "(503) 555-HOOT",
      nextAvailable: "Tonight"
    }
  ];

  useEffect(() => {
    console.log('ProBonoDirectory component mounted');
    console.log('Number of lawyers:', lawyers.length);
  }, []);

  // All unique specialties from lawyers
  const specialties = Array.from(
    new Set(lawyers.flatMap(lawyer => lawyer.specialties))
  ).sort();

  // All unique languages from lawyers
  const languages = Array.from(
    new Set(lawyers.flatMap(lawyer => lawyer.languages))
  ).sort();

  // Filter lawyers based on search and filters
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = 
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "all" || !selectedSpecialty || lawyer.specialties.includes(selectedSpecialty);
    const matchesLanguage = selectedLanguage === "all" || !selectedLanguage || lawyer.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const hootsworthVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.1
      }
    }
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleHootsworthClick = () => {
    const messages = [
      "Hoot! Need legal help? I'm here to guide you!",
      "Looking for a lawyer? Let me help you find the perfect match!",
      "Don't worry, I'll help you find the right legal support!",
      "Hoot hoot! Let's find you the best pro bono lawyer!",
      "Need legal assistance? I'm your wise owl guide!"
    ];
    setHootsworthMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <motion.div 
        className="sgc-container py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/pro-bono-qualification')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Qualification
          </Button>
          <div className="text-center mb-12 relative">
            <motion.div
              className="absolute right-0 top-0 cursor-pointer"
              variants={hootsworthVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={handleHootsworthClick}
            >
              <img 
                src="/mr-hootsworth.png" 
                alt="Mr. Hootsworth" 
                className="h-24 w-24 md:h-32 md:w-32"
              />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </motion.div>
            <AnimatePresence>
              {hootsworthMessage && (
                <motion.div
                  className="absolute right-0 top-36 bg-white p-4 rounded-lg shadow-lg max-w-xs"
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p className="text-sm text-sgc-neutral-dark">{hootsworthMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <h1 className="text-3xl font-bold mb-4">Pro Bono Legal Directory</h1>
            <p className="text-sgc-neutral max-w-2xl mx-auto">
              Connect with qualified pro bono lawyers who are ready to help. All listed attorneys have been verified 
              and are committed to providing free legal assistance to eligible clients.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map(language => (
                <SelectItem key={language} value={language}>{language}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {filteredLawyers.map(lawyer => (
            <motion.div
              key={lawyer.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={lawyer.image} alt={lawyer.name} />
                      <AvatarFallback>{lawyer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="mb-1">{lawyer.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-sgc-neutral mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{lawyer.rating}</span>
                        <span>•</span>
                        <span>{lawyer.reviews} reviews</span>
                        <span>•</span>
                        <span>{lawyer.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{lawyer.description}</CardDescription>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-sgc-neutral">
                      <MapPin className="h-4 w-4" />
                      <span>{lawyer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sgc-neutral">
                      <Clock className="h-4 w-4" />
                      <span>{lawyer.availability}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sgc-neutral">
                      <Globe className="h-4 w-4" />
                      <span>{lawyer.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sgc-neutral">
                      <Award className="h-4 w-4" />
                      <span>Success Rate: {lawyer.successRate}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-sgc-neutral">
                        <Calendar className="h-4 w-4" />
                        <span>Next Available: {lawyer.nextAvailable}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sgc-neutral">
                        <CheckCircle className="h-4 w-4" />
                        <span>{lawyer.certifications[0]}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredLawyers.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <p className="text-sgc-neutral text-lg">
              No lawyers found matching your criteria. Try adjusting your filters.
            </p>
          </motion.div>
        )}

        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center text-sm text-sgc-neutral"
        >
          <p>All consultations are free of charge for qualified individuals.</p>
          <p className="mt-2">
            Please note that availability may vary. We recommend scheduling a consultation as soon as possible.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProBonoDirectory;