import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, ThumbsUp, 
  ArrowLeft, Plus, Search, Filter, Tag, CheckCircle,
  Briefcase, GraduationCap, Scale, Loader2, Eye, EyeOff,
  Sparkles, Shield, Crown, Star, Award, TrendingUp,
  Send, Flag, Bookmark, MoreVertical, Smile, Image
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/ui/use-toast';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isAnonymous?: boolean;
  isVerified?: boolean;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  role: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  timestamp: string;
  isAnonymous?: boolean;
  isVerified?: boolean;
  isTrending?: boolean;
  isHighlighted?: boolean;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostTags, setSelectedPostTags] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'trending' | 'popular'>('recent');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isCommentAnonymous, setIsCommentAnonymous] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);

  const communityPosts: Post[] = [
    {
      id: 1,
      author: "Sarah K.",
      avatar: "SK",
      role: "Community Member",
      content: "As a woman in tech, I've faced many challenges. But through this community, I found strength and support. Let's keep lifting each other up!",
      likes: 124,
      comments: [
        {
          id: 1,
          author: "Maria L.",
          avatar: "ML",
          content: "Thank you for sharing your experience. It's inspiring to see how you've overcome these challenges!",
          timestamp: "1h ago",
          likes: 12,
          isVerified: true
        },
        {
          id: 2,
          author: "Anonymous",
          avatar: "AN",
          content: "I can relate to this so much. The tech industry can be tough, but communities like this make it better.",
          timestamp: "30m ago",
          likes: 8,
          isAnonymous: true
        }
      ],
      tags: ["Women in Tech", "Career Growth"],
      timestamp: "2h ago",
      isVerified: true,
      isTrending: true,
      isLiked: false
    },
    {
      id: 2,
      author: "Anonymous",
      avatar: "AN",
      role: "Community Member",
      content: "The safe spaces network helped me find support during a difficult time. Now I'm giving back by organizing community events.",
      likes: 89,
      comments: [
        {
          id: 1,
          author: "Alex T.",
          avatar: "AT",
          content: "Your work with the community is truly appreciated. Keep up the great work!",
          timestamp: "2h ago",
          likes: 5,
          isVerified: true
        }
      ],
      tags: ["Safe Spaces", "Community Support"],
      timestamp: "5h ago",
      isAnonymous: true,
      isHighlighted: true,
      isLiked: false
    },
    {
      id: 3,
      author: "Alex T.",
      avatar: "AT",
      role: "Student",
      content: "Navigating college as a first-generation student has its challenges, but this community has been my rock. Grateful for all the advice and support!",
      likes: 67,
      comments: [],
      tags: ["Education", "First Gen"],
      timestamp: "1d ago",
      isVerified: true,
      isLiked: false
    }
  ];

  const availableTags = [
    "Women in Tech",
    "Career Growth",
    "Safe Spaces",
    "Community Support",
    "Education",
    "First Gen",
    "Mental Health",
    "Legal Support",
    "Career Development",
    "Student Life"
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort posts
    let filtered = communityPosts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => post.tags.includes(tag));

      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'trending' && post.isTrending) ||
                        (activeTab === 'highlighted' && post.isHighlighted);
      
      return matchesSearch && matchesTags && matchesTab;
    });

    // Sort posts
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        case 'popular':
          return b.likes - a.likes;
        default:
          return 0; // Keep original order for 'recent'
      }
    });

    setFilteredPosts(filtered);
  }, [searchQuery, selectedTags, activeTab, sortBy]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePostTagClick = (tag: string) => {
    setSelectedPostTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedPostTags.includes(customTag.trim())) {
      setSelectedPostTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
      toast({
        title: "Tag Added",
        description: `Added "${customTag.trim()}" to your post`,
      });
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPostTags.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one tag for your post.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would be an API call
    const newPost: Post = {
      id: communityPosts.length + 1,
      author: isAnonymous ? "Anonymous" : "You",
      avatar: isAnonymous ? "AN" : "YO",
      role: "Community Member",
      content: newPostContent,
      likes: 0,
      comments: [],
      tags: selectedPostTags,
      timestamp: "Just now",
      isAnonymous,
      isLiked: false
    };

    setFilteredPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedPostTags([]);
    setIsNewPostDialogOpen(false);
    setIsAnonymous(false);

    toast({
      title: "Success",
      description: "Your post has been published!",
    });
  };

  const handleLike = (postId: number) => {
    setFilteredPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );

    toast({
      title: "Like Updated",
      description: "Your appreciation has been recorded.",
    });
  };

  const handleShare = async (post: Post) => {
    try {
      await navigator.share({
        title: `Post by ${post.author}`,
        text: post.content,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddComment = (postId: number) => {
    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive"
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      author: isCommentAnonymous ? "Anonymous" : "You",
      avatar: isCommentAnonymous ? "AN" : "YO",
      content: commentContent,
      timestamp: "Just now",
      likes: 0,
      isAnonymous: isCommentAnonymous
    };

    setFilteredPosts(prev => 
      prev.map(post => 
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    setCommentContent('');
    setIsCommentAnonymous(false);
    toast({
      title: "Success",
      description: "Your comment has been added!",
    });
  };

  const handleBookmark = (postId: number) => {
    setFilteredPosts(prev => 
      prev.map(post => 
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );

    toast({
      title: "Bookmark Updated",
      description: "Post has been bookmarked for later reference.",
    });
  };

  const handleReport = (postId: number) => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping maintain a safe community. Our team will review this post.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <div className="sgc-container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img src="/mr-hootsworth.png" alt="Mascot" className="h-14 w-14 rounded-full border-2 border-sgc-purple bg-white shadow" />
              <div>
                <h1 className="text-2xl font-bold text-sgc-purple">Community Support Hub</h1>
                <p className="text-sgc-neutral">Share your experiences and connect with others who understand.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                >
                  Recent
                </Button>
                <Button
                  variant={sortBy === 'trending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('trending')}
                >
                  <TrendingUp size={16} className="mr-1" />
                  Trending
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('popular')}
                >
                  <Star size={16} className="mr-1" />
                  Popular
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sgc-neutral" size={18} />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-sgc-purple text-white'
                      : 'bg-sgc-purple-light/20 text-sgc-purple hover:bg-sgc-purple-light/30'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-sgc-purple" />
                </div>
              ) : (
                <AnimatePresence>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-6 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow ${
                        post.isHighlighted ? 'border-sgc-purple/50 bg-sgc-purple-light/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium flex items-center gap-1">
                              {post.author}
                              {post.isVerified && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  <Shield size={12} className="mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {post.isAnonymous && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                  <EyeOff size={12} className="mr-1" />
                                  Anonymous
                                </Badge>
                              )}
                            </h4>
                            <Badge variant="secondary">{post.role}</Badge>
                            <span className="text-sm text-sgc-neutral ml-auto">{post.timestamp}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBookmark(post.id)}>
                                  <Bookmark size={16} className="mr-2" />
                                  {post.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReport(post.id)}>
                                  <Flag size={16} className="mr-2" />
                                  Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                            <Button 
                              variant={post.isLiked ? "default" : "ghost"}
                              size="sm" 
                              className={`gap-2 ${post.isLiked ? 'bg-sgc-purple text-white hover:bg-sgc-purple-dark' : ''}`}
                              onClick={() => handleLike(post.id)}
                            >
                              <ThumbsUp size={16} className={post.isLiked ? 'fill-current' : ''} />
                              {post.likes}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                            >
                              <MessageSquare size={16} />
                              {post.comments.length}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleShare(post)}
                            >
                              <Share2 size={16} />
                              Share
                            </Button>
                          </div>

                          {/* Comments Section */}
                          {showComments === post.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 border-t pt-4"
                            >
                              <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                  {post.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>{comment.avatar}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm">{comment.author}</span>
                                          {comment.isVerified && (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                              <Shield size={10} className="mr-1" />
                                              Verified
                                            </Badge>
                                          )}
                                          {comment.isAnonymous && (
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                              <EyeOff size={10} className="mr-1" />
                                              Anonymous
                                            </Badge>
                                          )}
                                          <span className="text-xs text-sgc-neutral">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-sgc-neutral-dark">{comment.content}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <ThumbsUp size={12} className="mr-1" />
                                            {comment.likes}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                              <div className="mt-4 flex gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Switch
                                      id={`comment-anonymous-${post.id}`}
                                      checked={isCommentAnonymous}
                                      onCheckedChange={setIsCommentAnonymous}
                                    />
                                    <Label htmlFor={`comment-anonymous-${post.id}`} className="text-sm">
                                      Comment Anonymously
                                    </Label>
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Write a comment..."
                                      value={commentContent}
                                      onChange={(e) => setCommentContent(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleAddComment(post.id)}
                                      disabled={!commentContent.trim()}
                                    >
                                      <Send size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Resources */}
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
                  ].map((resource) => (
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

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
                <CardDescription>Help us maintain a safe and supportive environment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Be respectful and supportive of others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Share experiences constructively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Maintain confidentiality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Report inappropriate content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 