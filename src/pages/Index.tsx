import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, MapPin, MessageCircle, FileText, BookOpen, Users, ArrowRight, CheckCircle, User, ChevronRight, Star, Heart, Clock, Bell, Calendar, Scale, Globe, Target, Award, TrendingUp, BarChart, Bookmark, Share2, ThumbsUp, MessageSquare, AlertCircle, GraduationCap, Briefcase, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import EmergencyButton from '@/components/EmergencyButton.jsx';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFindHelpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <Navbar />
      
      {/* Welcome Section with Impact Stats */}
      <section className="pt-8 pb-6 bg-gradient-to-r from-sgc-purple to-sgc-purple-dark text-white">
        <div className="sgc-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Empowering Equality & Justice
              </h1>
              <p className="text-white/80">Your journey towards gender equality and reduced inequalities</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Bell size={16} />
                Alerts
                </Button>
              <Button variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Clock size={16} />
                Timeline
                </Button>
            </div>
              </div>
              
          {/* Impact Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Gender Equality Score</p>
                    <h3 className="text-2xl font-bold mt-1">85%</h3>
                    </div>
                  <Scale className="opacity-80" size={20} />
                </div>
                <Progress value={85} className="mt-4 bg-white/20" />
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Safe Spaces</p>
                    <h3 className="text-2xl font-bold mt-1">24</h3>
              </div>
                  <MapPin className="opacity-80" size={20} />
                </div>
                <Progress value={80} className="mt-4 bg-white/20" />
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Community Impact</p>
                    <h3 className="text-2xl font-bold mt-1">1.2K</h3>
                  </div>
                  <Globe className="opacity-80" size={20} />
                </div>
                <Progress value={70} className="mt-4 bg-white/20" />
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Equality Goals</p>
                    <h3 className="text-2xl font-bold mt-1">12/15</h3>
              </div>
                  <Target className="opacity-80" size={20} />
            </div>
                <Progress value={80} className="mt-4 bg-white/20" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-sgc-purple/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple group-hover:scale-110 transition-transform">
                        <Scale size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Legal Rights</h3>
                        <p className="text-sm text-sgc-neutral">Know your rights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Safe Spaces</h3>
                        <p className="text-sm text-sgc-neutral">Find support nearby</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Empowerment</h3>
                        <p className="text-sm text-sgc-neutral">Build your skills</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Advocacy</h3>
                        <p className="text-sm text-sgc-neutral">Make your voice heard</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>
          
              {/* Featured Initiatives */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Featured Initiatives</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="overflow-hidden group">
                    <div className="h-48 bg-gradient-to-r from-sgc-purple to-sgc-purple-dark relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <Badge className="bg-white/20 text-white mb-2">SDG 5</Badge>
                        <h3 className="text-xl font-bold">Women in Tech</h3>
          </div>
        </div>
                    <CardContent className="p-6">
                      <p className="text-sgc-neutral mb-4">Empowering women through technology education and career opportunities.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>WT</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">1.2K Members</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-sgc-purple">
                          Join Initiative
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden group">
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <Badge className="bg-white/20 text-white mb-2">SDG 10</Badge>
                        <h3 className="text-xl font-bold">Equal Pay Campaign</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sgc-neutral mb-4">Advocating for fair compensation and workplace equality.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>EP</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">850 Members</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Join Campaign
                        </Button>
          </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden group">
                    <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <Badge className="bg-white/20 text-white mb-2">SDG 5 & 10</Badge>
                        <h3 className="text-xl font-bold">Safe Spaces Network</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sgc-neutral mb-4">Creating inclusive spaces for marginalized communities.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>SS</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">2.5K Members</span>
              </div>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          Join Network
                        </Button>
                  </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Recent Activity & Upcoming Events */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Equality Updates</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Gender Pay Gap Report", desc: "New insights on workplace equality", time: "2h ago" },
                        { title: "Policy Change", desc: "New anti-discrimination laws passed", time: "5h ago" },
                        { title: "Community Win", desc: "Local initiative success story", time: "1d ago" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-sgc-neutral-light/50 transition-colors">
                          <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center text-sgc-purple">
                            <BarChart size={20} />
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
              </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Women in Leadership", desc: "Panel discussion on breaking barriers", time: "Tomorrow" },
                        { title: "Equality Workshop", desc: "Understanding intersectional feminism", time: "Next Week" },
                        { title: "Community Meetup", desc: "Building inclusive spaces", time: "In 2 weeks" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-sgc-neutral-light/50 transition-colors">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-sgc-neutral">{item.desc}</p>
              </div>
                              <Badge variant="secondary">{item.time}</Badge>
                  </div>
                </div>
              </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                    <CardTitle>Community Stories</CardTitle>
                    <CardDescription>Share and read experiences from our community members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          name: "Sarah K.",
                          role: "Tech Lead",
                          story: "Through FairForward's mentorship program, I was able to break through the glass ceiling and become a tech lead at my company.",
                          likes: 124,
                          comments: 23
                        },
                        {
                          name: "Maria L.",
                          role: "Community Organizer",
                          story: "The safe spaces network helped me find support during a difficult time. Now I'm giving back by organizing community events.",
                          likes: 89,
                          comments: 15
                        }
                      ].map((story, i) => (
                        <div key={i} className="p-4 rounded-lg border">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{story.name}</h4>
                                <Badge variant="secondary">{story.role}</Badge>
                              </div>
                              <p className="text-sgc-neutral mb-4">{story.story}</p>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <ThumbsUp size={16} />
                                  {story.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageSquare size={16} />
                                  {story.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <Share2 size={16} />
                                  Share
                                </Button>
              </div>
            </div>
          </div>
        </div>
                      ))}
          </div>
                  </CardContent>
                </Card>

                {/* Community Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Join our community events and workshops</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Women in Tech Meetup",
                          date: "Tomorrow, 6 PM",
                          attendees: 45
                        },
                        {
                          title: "Equality Workshop",
                          date: "Next Week",
                          attendees: 32
                        },
                        {
                          title: "Community Support Group",
                          date: "Every Thursday",
                          attendees: 28
                        }
                      ].map((event, i) => (
                        <div key={i} className="p-4 rounded-lg border">
                          <h4 className="font-medium mb-2">{event.title}</h4>
                          <div className="flex items-center justify-between text-sm text-sgc-neutral">
                            <span>{event.date}</span>
                            <span>{event.attendees} attending</span>
          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            Join Event
            </Button>
          </div>
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

      {/* Emergency Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <EmergencyButton variant="floating" />
      </div>
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
