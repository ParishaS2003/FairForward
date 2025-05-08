import React, { useState } from 'react';
import { BookOpen, Code, CreditCard, FileText, CheckCircle, User, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Mock data for courses
const courses = [
  {
    id: 1,
    title: "Digital Basics",
    category: "tech",
    level: "Beginner",
    duration: "2 hours",
    lessons: 5,
    language: "English",
    description: "Learn the fundamentals of using smartphones, computers and internet safely.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    progress: 0,
    popular: true
  },
  {
    id: 2,
    title: "Personal Finance 101",
    category: "finance",
    level: "Beginner",
    duration: "3 hours",
    lessons: 7,
    language: "English",
    description: "Essential financial skills for budgeting, saving and understanding credit.",
    image: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9",
    progress: 60,
    popular: true
  },
  {
    id: 3,
    title: "Introduction to Coding",
    category: "tech",
    level: "Beginner",
    duration: "4 hours",
    lessons: 10,
    language: "English",
    description: "Get started with basic programming concepts and simple web development.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    progress: 25,
    popular: false
  },
  {
    id: 4,
    title: "Resume Building",
    category: "career",
    level: "Intermediate",
    duration: "1.5 hours",
    lessons: 4,
    language: "English",
    description: "Create a professional resume and learn job application strategies.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    progress: 0,
    popular: true
  },
  {
    id: 5,
    title: "Know Your Rights",
    category: "legal",
    level: "Beginner",
    duration: "2.5 hours",
    lessons: 6,
    language: "English",
    description: "Understanding basic legal rights in employment, housing, and public services.",
    image: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c",
    progress: 0,
    popular: true
  },
  {
    id: 6,
    title: "Mobile Banking Safety",
    category: "finance",
    level: "Beginner",
    duration: "1 hour",
    lessons: 3,
    language: "English",
    description: "Learn to use mobile banking services securely and avoid common scams.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    progress: 85,
    popular: false
  }
];

// Course category icons
const getCategoryIcon = (category: string, size = 20) => {
  switch(category) {
    case 'tech': return <Code size={size} />;
    case 'finance': return <CreditCard size={size} />;
    case 'career': return <FileText size={size} />;
    case 'legal': return <BookOpen size={size} />;
    default: return <BookOpen size={size} />;
  }
};

const LiteracyHub = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter courses based on tab and search
  const filteredCourses = courses.filter(course => {
    const matchesTab = selectedTab === "all" || course.category === selectedTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  
  // Group for "My Learning" section
  const inProgressCourses = courses.filter(course => course.progress > 0);
  
  return (
    <div className="sgc-container py-8">
      <div className="text-center mb-8">
        <h1 className="sgc-heading-2 mb-2">Learning Hub</h1>
        <p className="text-sgc-neutral max-w-2xl mx-auto">
          Free educational resources to build your skills in technology, finance, career advancement, and legal knowledge.
        </p>
      </div>
      
      {/* Featured Courses Banner */}
      <div className="mb-10 relative overflow-hidden rounded-xl bg-sgc-purple text-white p-8">
        <div className="relative z-10 max-w-xl">
          <Badge className="bg-white/20 mb-4 hover:bg-white/30">Featured</Badge>
          <h2 className="text-3xl font-bold mb-2">Empowering Education</h2>
          <p className="mb-6 text-white/80">
            All courses are free, accessible in multiple languages, and designed for all skill levels. Get started today!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-sgc-purple hover:bg-white/90">Browse All Courses</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20">How It Works</Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 opacity-10">
          <BookOpen size={180} />
        </div>
      </div>
      
      {/* My Learning Section */}
      {inProgressCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="sgc-heading-3 mb-4">My Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map(course => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-sgc-purple/10 flex items-center justify-center mr-2">
                        {getCategoryIcon(course.category)}
                      </div>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardTitle className="mt-3">{course.title}</CardTitle>
                  <div className="flex items-center mt-2">
                    <Progress value={course.progress} className="h-2" />
                    <span className="ml-2 text-sm text-sgc-neutral">{course.progress}%</span>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Continue Learning</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Browse Courses Section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          defaultValue="all" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>
      
      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${course.image})` }}
              >
                {course.popular && (
                  <Badge className="m-3 bg-sgc-purple">Popular</Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(course.category, 14)}
                    <span>{course.category}</span>
                  </Badge>
                  <div className="flex items-center text-sm text-sgc-neutral">
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-sgc-neutral gap-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>1,243 learners</span>
                  </div>
                </div>
                
                {course.progress > 0 && (
                  <div className="flex items-center mt-3">
                    <Progress value={course.progress} className="h-1.5 flex-1" />
                    <span className="ml-2 text-xs text-sgc-neutral">{course.progress}%</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${course.progress > 0 ? 'bg-sgc-blue' : ''}`}>
                  {course.progress > 0 ? 'Continue' : 'Start Learning'}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={48} className="text-sgc-neutral mb-4" />
            <h3 className="text-xl font-medium text-sgc-neutral-dark mb-2">No courses found</h3>
            <p className="text-sgc-neutral">
              We couldn't find any courses matching your search. Try different keywords or browse all courses.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedTab("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-sgc-neutral-light rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
          <p className="text-sgc-neutral mb-6">
            We're always looking for volunteers to help create content, translate courses, or mentor learners. Join our community of educators!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="sgc-button-primary">Become a Volunteer</Button>
            <Button variant="outline">Suggest a Course</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiteracyHub;
