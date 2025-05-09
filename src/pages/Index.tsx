import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, MapPin, FileText, BookOpen, Users, ArrowRight, CheckCircle, User, 
  ChevronRight, Star, Heart, Clock, Bell, Calendar, Scale, Globe, Target, Award, TrendingUp, 
  BarChart, Bookmark, Share2, ThumbsUp, MessageSquare, AlertCircle, GraduationCap, Briefcase, 
  Home, Building2, Gavel, BriefcaseIcon, PhoneCall, Mail, CheckCircle2, XCircle,
  Sparkles, Lightbulb, Megaphone, Handshake, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import EmergencyButton from '@/components/EmergencyButton';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = 'http://localhost:5001';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      author: "Sarah K.",
      avatar: "SK",
      role: "Community Member",
      content: "As a woman in tech, I've faced many challenges. But through this community, I found strength and support. Let's keep lifting each other up!",
      likes: 124,
      comments: 23,
      tags: ["Women in Tech", "Career Growth"],
      timestamp: "2h ago"
    },
    {
      id: 2,
      author: "Maria L.",
      avatar: "ML",
      role: "Community Organizer",
      content: "The safe spaces network helped me find support during a difficult time. Now I'm giving back by organizing community events.",
      likes: 89,
      comments: 15,
      tags: ["Safe Spaces", "Community Support"],
      timestamp: "5h ago"
    },
    {
      id: 3,
      author: "Alex T.",
      avatar: "AT",
      role: "Student",
      content: "Navigating college as a first-generation student has its challenges, but this community has been my rock. Grateful for all the advice and support!",
      likes: 67,
      comments: 12,
      tags: ["Education", "First Gen"],
      timestamp: "1d ago"
    }
  ]);

  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });

  const { toast } = useToast();
  const [joinedInitiatives, setJoinedInitiatives] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFindHelpClick = () => {
    navigate('/signup');
  };

  const handleJoinInitiative = (initiativeTitle: string) => {
    if (!joinedInitiatives.includes(initiativeTitle)) {
      setJoinedInitiatives(prev => [...prev, initiativeTitle]);
      toast({
        title: 'Joined Initiative!',
        description: `You have joined the "${initiativeTitle}" initiative. Welcome aboard!`,
      });
    }
  };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <Navbar />
      
      {/* Welcome Section with Impact Stats */}
      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="pt-8 pb-6 bg-gradient-to-r from-sgc-neutral-light to-white text-sgc-neutral-dark"
      >
        <div className="sgc-container">
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Empowering Communities Through Safety & Knowledge
                </h1>
                <motion.img 
                  src="/mr-hootsworth.png" 
                  alt="Mr. Hootsworth the Owl" 
                  className="w-10 h-10 md:w-14 md:h-14 ml-1"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.p 
                variants={fadeInUp}
                className="text-sgc-neutral mt-1"
              >
                Your journey towards gender equality and reduced inequalities
              </motion.p>
            </div>
            <motion.div 
              variants={fadeInUp}
              className="flex gap-4"
            >
              <Button variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Bell size={16} />
                Alerts
                </Button>
              <Button variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Clock size={16} />
                Timeline
                </Button>
            </div>
          </motion.div>
          
          {/* Impact Stats Grid */}
          <motion.div 
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
          >
            {[
              { title: 'Gender Equality Score', value: '85%', icon: <Scale />, color: 'from-purple-500 to-purple-600' },
              { title: 'Safe Spaces', value: '24', icon: <MapPin />, color: 'from-blue-500 to-blue-600' },
              { title: 'Community Impact', value: '1.2K', icon: <Globe />, color: 'from-green-500 to-green-600' },
              { title: 'Equality Goals', value: '12/15', icon: <Target />, color: 'from-orange-500 to-orange-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className={`bg-gradient-to-r ${stat.color} text-white border-0`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.icon}
                      </motion.div>
                    </div>
                    <Progress value={parseInt(stat.value)} className="mt-4 bg-white/20" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="sgc-container">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg shadow-sm">
              <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
              <TabsTrigger value="equality" className="rounded-md">Equality Hub</TabsTrigger>
              <TabsTrigger value="community" className="rounded-md">Community</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-md">Your Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <motion.div 
                ref={featuresRef}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { icon: <Scale />, title: 'Legal Rights', desc: 'Know your rights', color: 'purple', link: '/legal-help' },
                  { icon: <MapPin />, title: 'Safe Spaces', desc: 'Find support nearby', color: 'blue', link: '/map' },
                  { icon: <FileText />, title: 'Report', desc: 'File a report', color: 'red', link: '/report' },
                  { icon: <BookOpen />, title: 'Learn', desc: 'Educational resources', color: 'green', link: '/learn' },
                  { icon: <MessageCircle />, title: 'LegalBot', desc: 'Get legal advice', color: 'orange', link: '/chat' },
                  { icon: <Users />, title: 'Community', desc: 'Connect with others', color: 'indigo', link: '/community' },
                  { icon: <Award />, title: 'Empowerment', desc: 'Build your skills', color: 'teal', link: '/app' },
                  { icon: <TrendingUp />, title: 'Advocacy', desc: 'Make your voice heard', color: 'pink', link: '/app' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative"
                  >
                    <Link to={feature.link}>
                      <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer group border-${feature.color}-200`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className={`h-12 w-12 rounded-full bg-${feature.color}-100 flex items-center justify-center text-${feature.color}-600 group-hover:scale-110 transition-transform`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {feature.icon}
                            </motion.div>
                            <div>
                              <h3 className="font-semibold">{feature.title}</h3>
                              <p className="text-sm text-sgc-neutral">{feature.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Featured Initiatives */}
              <motion.div 
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold mb-6">Featured Initiatives</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: 'Women in Tech',
                      desc: 'Empowering women through technology education and career opportunities.',
                      badge: 'SDG 5',
                      gradient: 'from-sgc-purple to-sgc-purple-dark',
                      members: '1.2K'
                    },
                    {
                      title: 'Equal Pay Campaign',
                      desc: 'Advocating for fair compensation and workplace equality.',
                      badge: 'SDG 10',
                      gradient: 'from-blue-500 to-blue-600',
                      members: '850'
                    },
                    {
                      title: 'Safe Spaces Network',
                      desc: 'Creating inclusive spaces for marginalized communities.',
                      badge: 'SDG 5 & 10',
                      gradient: 'from-green-500 to-green-600',
                      members: '2.5K'
                    }
                  ].map((initiative, index) => (
                    <motion.div
                      key={initiative.title}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="overflow-hidden group">
                        <div className={`h-48 bg-gradient-to-r ${initiative.gradient} relative`}>
                          <motion.div 
                            className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          />
                          <div className="absolute bottom-4 left-4 text-white">
                            <Badge className="bg-white/20 text-white mb-2">{initiative.badge}</Badge>
                            <h3 className="text-xl font-bold">{initiative.title}</h3>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-sgc-neutral mb-4">{initiative.desc}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{initiative.title.split(' ').map(w => w[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{initiative.members} Members</span>
                            </div>
                            {joinedInitiatives.includes(initiative.title) ? (
                              <Button variant="secondary" size="sm" disabled className="text-green-700 bg-green-100 hover:bg-green-100 cursor-default gap-2">
                                <CheckCircle size={16} /> Joined
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-sgc-purple gap-2"
                                onClick={() => handleJoinInitiative(initiative.title)}
                              >
                                Join Initiative
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity & Upcoming Events */}
              <motion.div 
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-6"
              >
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Equality Updates</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Gender Pay Gap Report", desc: "New insights on workplace equality", time: "2h ago", icon: <BarChart /> },
                          { title: "Policy Change", desc: "New anti-discrimination laws passed", time: "5h ago", icon: <FileText /> },
                          { title: "Community Win", desc: "Local initiative success story", time: "1d ago", icon: <Award /> }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ x: 10 }}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-sgc-neutral-light/50 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{item.title}</h4>
                                  <p className="text-sm text-sgc-neutral">{item.desc}</p>
                                </div>
                                <span className="text-xs text-sgc-neutral">{item.time}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Women in Leadership", desc: "Panel discussion on breaking barriers", time: "Tomorrow", icon: <Users /> },
                          { title: "Equality Workshop", desc: "Understanding intersectional feminism", time: "Next Week", icon: <GraduationCap /> },
                          { title: "Community Meetup", desc: "Building inclusive spaces", time: "In 2 weeks", icon: <Handshake /> }
                        ].map((event, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ x: 10 }}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-sgc-neutral-light/50 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {event.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <p className="text-sm text-sgc-neutral">{event.desc}</p>
                                </div>
                                <Badge variant="secondary">{event.time}</Badge>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="equality" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Equality Resources */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Equality Resources</CardTitle>
                    <CardDescription>Access tools and information to promote gender equality and reduce inequalities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { icon: <GraduationCap className="text-sgc-purple" />, title: "Educational Resources", desc: "Access courses on gender equality and social justice" },
                        { icon: <Briefcase className="text-blue-600" />, title: "Career Development", desc: "Tools and guides for professional growth" },
                        { icon: <Home className="text-green-600" />, title: "Housing Support", desc: "Resources for safe and affordable housing" },
                        { icon: <Building2 className="text-orange-600" />, title: "Community Centers", desc: "Find local support and community spaces" }
                      ].map((resource, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-sgc-neutral-light/50 transition-colors">
                          <div className="h-10 w-10 rounded-full bg-sgc-neutral-light flex items-center justify-center">
                            {resource.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-sgc-neutral">{resource.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Equality Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Equality Metrics</CardTitle>
                    <CardDescription>Track progress towards gender equality and reduced inequalities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Gender Pay Gap</span>
                          <span className="text-sm text-sgc-neutral">23%</span>
                        </div>
                        <Progress value={77} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Women in Leadership</span>
                          <span className="text-sm text-sgc-neutral">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Equal Opportunities</span>
                          <span className="text-sm text-sgc-neutral">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Community Stories */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Community Support Hub</CardTitle>
                    <CardDescription>Share your experiences and connect with others who understand</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* New Post Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="mb-6"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-sgc-purple to-sgc-purple-dark text-white hover:from-sgc-purple-dark hover:to-sgc-purple"
                          onClick={() => navigate('/new-post')}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Share Your Story
                        </Button>
                      </motion.div>

                      {/* Community Posts */}
                      {communityPosts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                          className="p-6 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{post.author}</h4>
                                <Badge variant="secondary">{post.role}</Badge>
                                <span className="text-sm text-sgc-neutral ml-auto">{post.timestamp}</span>
                              </div>
                              <p className="text-sgc-neutral-dark mb-4">{post.content}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="bg-sgc-purple-light/20 text-sgc-purple">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <ThumbsUp size={16} />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageSquare size={16} />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <Share2 size={16} />
                                  Share
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <Heart size={16} />
                                  Support
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Support Resources</CardTitle>
                    <CardDescription>Find help and connect with support groups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Mental Health Support",
                          desc: "24/7 counseling and peer support",
                          icon: <Heart className="text-pink-500" />,
                          link: "/mental-health"
                        },
                        {
                          title: "Career Development",
                          desc: "Mentorship and career guidance",
                          icon: <Briefcase className="text-blue-500" />,
                          link: "/career"
                        },
                        {
                          title: "Education Support",
                          desc: "Scholarships and academic resources",
                          icon: <GraduationCap className="text-green-500" />,
                          link: "/education"
                        },
                        {
                          title: "Legal Assistance",
                          desc: "Free legal consultation and support",
                          icon: <Scale className="text-purple-500" />,
                          link: "/legal-help"
                        }
                      ].map((resource, i) => (
                        <motion.div
                          key={resource.title}
                          whileHover={{ x: 10 }}
                          className="p-4 rounded-lg border hover:bg-sgc-neutral-light/50 transition-colors cursor-pointer"
                          onClick={() => navigate(resource.link)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-sgc-neutral-light flex items-center justify-center">
                              {resource.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-sm text-sgc-neutral">{resource.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Personal Impact */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                    <CardDescription>Track your contributions to gender equality and social justice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="text-2xl font-bold text-sgc-purple">24</h4>
                              <p className="text-sm text-sgc-neutral">Hours Volunteered</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="text-2xl font-bold text-blue-600">12</h4>
                              <p className="text-sm text-sgc-neutral">Events Attended</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="text-2xl font-bold text-green-600">8</h4>
                              <p className="text-sm text-sgc-neutral">Resources Shared</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="text-2xl font-bold text-orange-600">5</h4>
                              <p className="text-sm text-sgc-neutral">Initiatives Joined</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your milestones in promoting equality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "Equality Advocate", desc: "Completed 10 workshops", icon: <Award className="text-sgc-purple" /> },
                        { title: "Community Leader", desc: "Organized 3 events", icon: <Users className="text-blue-600" /> },
                        { title: "Knowledge Sharer", desc: "Shared 8 resources", icon: <BookOpen className="text-green-600" /> }
                      ].map((achievement, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-sgc-neutral-light/30">
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-sgc-neutral">{achievement.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
