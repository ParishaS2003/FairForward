import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/accessibility.css';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  BookmarkCheck, 
  Clock, 
  Phone,
  LogOut,
  Edit2,
  Save,
  Plus,
  CheckCircle,
  MapPin,
  Mail,
  ArrowRight,
  LogIn,
  AlertTriangle,
  Monitor,
  Info,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  preferredLanguage: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      screenReader: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts';
      locationSharing: boolean;
      activityVisibility: boolean;
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    emergencyAlerts: boolean;
    communityUpdates: boolean;
    resourceAlerts: boolean;
    securityAlerts: boolean;
  };
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  savedResources: {
    title: string;
    type: string;
    date: string;
  }[];
  recentActivity: {
    action: string;
    date: string;
    details: string;
  }[];
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  priority: number;
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    app: boolean;
  };
}

interface SafetySettings {
  emergencyContacts: EmergencyContact[];
  safetyChecks: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    lastCheck: string;
  };
  trustedLocations: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
  panicButton: {
    enabled: boolean;
    autoNotify: boolean;
    customMessage: string;
  };
}

interface Resource {
  id: string;
  title: string;
  type: 'legal' | 'safety' | 'education' | 'health' | 'community';
  description: string;
  url?: string;
  dateAdded: string;
  tags: string[];
  isBookmarked: boolean;
}

interface Activity {
  id: string;
  type: 'login' | 'resource_access' | 'emergency' | 'safety_check' | 'profile_update' | 'contact_update';
  description: string;
  timestamp: string;
  details?: {
    location?: string;
    device?: string;
    status?: string;
  };
  severity: 'low' | 'medium' | 'high';
}

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
}

interface LocationSharingState {
  isEnabled: boolean;
  lastLocation: LocationData | null;
  sharingWith: string[];
  updateInterval: number; // in minutes
}

interface ActivityHistoryState {
  isEnabled: boolean;
  visibleTo: 'none' | 'trusted' | 'all';
  retentionPeriod: number; // in days
  categories: {
    logins: boolean;
    safety: boolean;
    resources: boolean;
    location: boolean;
  };
}

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState({
    theme: 'system',
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false
    },
    privacy: {
      profileVisibility: 'private',
      locationSharing: false,
      activityVisibility: true
    }
  });
  const [safetySettings, setSafetySettings] = useState<SafetySettings>({
    emergencyContacts: [],
    safetyChecks: {
      enabled: false,
      frequency: 'weekly',
      lastCheck: new Date().toISOString(),
    },
    trustedLocations: [],
    panicButton: {
      enabled: true,
      autoNotify: true,
      customMessage: "I need immediate assistance. Please help.",
    }
  });
  const [locationSharing, setLocationSharing] = useState<LocationSharingState>({
    isEnabled: false,
    lastLocation: null,
    sharingWith: [],
    updateInterval: 15 // default 15 minutes
  });
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryState>({
    isEnabled: false,
    visibleTo: 'none',
    retentionPeriod: 30,
    categories: {
      logins: true,
      safety: true,
      resources: true,
      location: true
    }
  });
  const [hootsworthMessage, setHootsworthMessage] = useState("");

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

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Legal Aid Directory',
      type: 'legal',
      description: 'Comprehensive list of pro-bono legal services in your area',
      dateAdded: '2024-03-15',
      tags: ['legal', 'directory', 'free'],
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Safety Planning Guide',
      type: 'safety',
      description: 'Step-by-step guide for creating a personal safety plan',
      dateAdded: '2024-03-14',
      tags: ['safety', 'guide', 'planning'],
      isBookmarked: true
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'login',
      description: 'New login from MacBook Pro',
      timestamp: new Date().toISOString(),
      details: {
        location: 'Toronto, ON',
        device: 'MacBook Pro',
        status: 'successful'
      },
      severity: 'low'
    },
    {
      id: '2',
      type: 'emergency',
      description: 'Emergency button activated',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: {
        location: 'Mobile App',
        status: 'resolved'
      },
      severity: 'high'
    }
  ]);

  useEffect(() => {
    // In a real app, this would be an API call
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        // Merge with dummy data for demonstration
        setUser({
          ...parsedUser,
          preferredLanguage: 'English',
          notifications: {
            email: true,
            sms: true,
            emergencyAlerts: true
          },
          emergencyContacts: [
            {
              name: 'Jane Doe',
              relationship: 'Sister',
              phone: '(555) 123-4567'
            }
          ],
          savedResources: [
            {
              title: 'Legal Aid Ontario',
              type: 'Legal Resource',
              date: '2024-03-15'
            },
            {
              title: 'Women\'s Shelter Toronto',
              type: 'Safe Space',
              date: '2024-03-10'
            }
          ],
          recentActivity: [
            {
              action: 'Updated Safety Plan',
              date: '2024-03-15',
              details: 'Modified emergency contacts'
            },
            {
              action: 'Accessed Legal Resources',
              date: '2024-03-10',
              details: 'Viewed legal aid information'
            }
          ]
        });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSaveProfile = () => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleAddEmergencyContact = () => {
    if (user) {
      const newContact = {
        name: '',
        relationship: '',
        phone: ''
      };
      setUser({
        ...user,
        emergencyContacts: [...user.emergencyContacts, newContact]
      });
    }
  };

  const handleAddContact = () => {
    if (user) {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: '',
        relationship: '',
        phone: '',
        isVerified: false,
        priority: 1,
        notificationPreferences: {
          sms: false,
          email: false,
          app: false
        }
      };
      setSafetySettings(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newContact]
      }));
    }
  };

  const handleEditContact = (id: string) => {
    // Implement the logic to edit a contact
  };

  const handleUpdateContactPreferences = (id: string, type: 'sms' | 'email' | 'app', checked: boolean) => {
    // Implement the logic to update contact preferences
  };

  // Add handlers for accessibility options
  const handleAccessibilityChange = (option: keyof typeof preferences.accessibility, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [option]: checked
      }
    }));

    // Apply accessibility changes immediately
    if (option === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast-mode', checked);
    } else if (option === 'largeText') {
      document.documentElement.classList.toggle('large-text-mode', checked);
    } else if (option === 'screenReader') {
      // Update ARIA attributes for screen reader support
      document.documentElement.setAttribute('aria-live', checked ? 'polite' : 'off');
    }

    // Save preferences to localStorage
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    localStorage.setItem('userPreferences', JSON.stringify({
      ...savedPreferences,
      accessibility: {
        ...savedPreferences.accessibility,
        [option]: checked
      }
    }));

    // Show feedback toast
    toast({
      title: `${option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')} ${checked ? 'Enabled' : 'Disabled'}`,
      description: `Accessibility setting has been updated.`,
    });
  };

  // Add handlers for privacy settings
  const handlePrivacyChange = (
    option: keyof typeof preferences.privacy,
    value: typeof preferences.privacy[keyof typeof preferences.privacy]
  ) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [option]: value
      }
    }));

    // Save privacy settings to localStorage
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    localStorage.setItem('userPreferences', JSON.stringify({
      ...savedPreferences,
      privacy: {
        ...savedPreferences.privacy,
        [option]: value
      }
    }));

    // Show feedback toast
    const optionName = option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1');
    const status = typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : value;
    toast({
      title: `${optionName} Updated`,
      description: `Privacy setting has been set to ${status}.`,
    });
  };

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    if (savedPreferences.accessibility) {
      setPreferences(prev => ({
        ...prev,
        accessibility: {
          ...prev.accessibility,
          ...savedPreferences.accessibility
        }
      }));

      // Apply saved accessibility settings
      document.documentElement.classList.toggle('high-contrast-mode', savedPreferences.accessibility.highContrast);
      document.documentElement.classList.toggle('large-text-mode', savedPreferences.accessibility.largeText);
      document.documentElement.setAttribute('aria-live', savedPreferences.accessibility.screenReader ? 'polite' : 'off');
    }
  }, []);

  // Add location sharing functions
  const handleLocationSharing = async (enabled: boolean) => {
    if (enabled) {
      try {
        // Request location permission
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access in your browser settings.",
            variant: "destructive"
          });
          return;
        }

        // Get initial location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
              accuracy: position.coords.accuracy
            };

            setLocationSharing(prev => ({
              ...prev,
              isEnabled: true,
              lastLocation: locationData
            }));

            // Start location tracking
            const watchId = navigator.geolocation.watchPosition(
              (newPosition) => {
                const newLocationData: LocationData = {
                  latitude: newPosition.coords.latitude,
                  longitude: newPosition.coords.longitude,
                  timestamp: new Date().toISOString(),
                  accuracy: newPosition.coords.accuracy
                };

                setLocationSharing(prev => ({
                  ...prev,
                  lastLocation: newLocationData
                }));

                // In a real app, send this to your backend
                console.log('Location updated:', newLocationData);
              },
              (error) => {
                console.error('Location tracking error:', error);
                toast({
                  title: "Location Error",
                  description: "Failed to update location. Please check your settings.",
                  variant: "destructive"
                });
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );

            // Store the watch ID for cleanup
            localStorage.setItem('locationWatchId', watchId.toString());
          },
          (error) => {
            console.error('Initial location error:', error);
            toast({
              title: "Location Error",
              description: "Failed to get your location. Please check your settings.",
              variant: "destructive"
            });
          }
        );
      } catch (error) {
        console.error('Location sharing error:', error);
        toast({
          title: "Error",
          description: "Failed to enable location sharing.",
          variant: "destructive"
        });
      }
    } else {
      // Disable location tracking
      const watchId = localStorage.getItem('locationWatchId');
      if (watchId) {
        navigator.geolocation.clearWatch(parseInt(watchId));
        localStorage.removeItem('locationWatchId');
      }

      setLocationSharing(prev => ({
        ...prev,
        isEnabled: false,
        lastLocation: null
      }));
    }

    // Update privacy preferences
    handlePrivacyChange('locationSharing', enabled);
  };

  // Add activity history functions
  const handleActivityHistoryChange = (enabled: boolean) => {
    setActivityHistory(prev => ({
      ...prev,
      isEnabled: enabled
    }));

    if (!enabled) {
      // Reset visibility settings when disabled
      setActivityHistory(prev => ({
        ...prev,
        visibleTo: 'none'
      }));
    }

    // Update privacy preferences
    handlePrivacyChange('activityVisibility', enabled);

    toast({
      title: `Activity History ${enabled ? 'Enabled' : 'Disabled'}`,
      description: enabled 
        ? "Your activity will now be recorded and shared according to your settings." 
        : "Activity history has been disabled.",
    });
  };

  const handleActivityCategoryToggle = (category: keyof ActivityHistoryState['categories']) => {
    setActivityHistory(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));

    toast({
      title: "Category Updated",
      description: `${category.charAt(0).toUpperCase() + category.slice(1)} tracking has been ${activityHistory.categories[category] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleHootsworthClick = () => {
    const messages = [
      "Hoot! Need help with your account settings? I'm here to guide you!",
      "Want to update your profile? Let me show you how!",
      "Need to manage your privacy settings? I can help with that!",
      "Hoot hoot! Let's make your account more secure!",
      "Need to add emergency contacts? I'll walk you through it!"
    ];
    setHootsworthMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>{translate('app.not_signed_in')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              {translate('button.sign_in')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sgc-purple-light/10 to-white">
      <div className="container max-w-6xl py-6 space-y-6">
        <BackButton />
        
        <div className="flex items-center justify-between relative">
          <h1 className="text-3xl font-bold text-sgc-purple">{translate('account.settings')}</h1>
          <div className="flex items-center gap-4">
            <motion.div
              className="cursor-pointer"
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
                className="h-16 w-16 md:h-20 md:w-20"
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
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </motion.div>
            <Button variant="outline" onClick={handleSignOut} className="border-sgc-purple/20 hover:bg-sgc-purple/10">
              <LogOut className="w-4 h-4 mr-2 text-sgc-purple" />
              {translate('account.logout')}
            </Button>
          </div>
          <AnimatePresence>
            {hootsworthMessage && (
              <motion.div
                className="absolute right-0 top-24 bg-white p-4 rounded-lg shadow-lg max-w-xs z-50"
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-sm text-sgc-neutral-dark">{hootsworthMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-sgc-purple/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-sgc-purple/10 data-[state=active]:text-sgc-purple">
              <User className="w-4 h-4 mr-2" />
              {translate('nav.profile')}
            </TabsTrigger>
            <TabsTrigger value="safety" className="data-[state=active]:bg-sgc-purple/10 data-[state=active]:text-sgc-purple">
              <Shield className="w-4 h-4 mr-2" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-sgc-purple/10 data-[state=active]:text-sgc-purple">
              <BookmarkCheck className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-sgc-purple/10 data-[state=active]:text-sgc-purple">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <div>
                    <CardTitle className="text-sgc-purple">{translate('account.personal_info')}</CardTitle>
                    <CardDescription>{translate('account.personal_info_desc')}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="border-sgc-purple/20 hover:bg-sgc-purple/10"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2 text-sgc-purple" />
                        {translate('button.save')}
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2 text-sgc-purple" />
                        {translate('button.edit')}
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{translate('account.full_name')}</Label>
                      <Input 
                        id="name" 
                        placeholder={translate('form.placeholder.name')}
                        value={user?.name || ''} 
                        disabled={!isEditing}
                        onChange={(e) => setUser(prev => ({ ...prev!, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{translate('account.email_address')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={translate('form.placeholder.email')}
                        value={user?.email || ''} 
                        disabled={!isEditing}
                        onChange={(e) => setUser(prev => ({ ...prev!, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{translate('account.phone_number')}</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder={translate('form.placeholder.phone')}
                        value={user?.phone || ''} 
                        disabled={!isEditing}
                        onChange={(e) => setUser(prev => ({ ...prev!, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">{translate('account.language')}</Label>
                      <LanguageSelector className="w-full" />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">{translate('account.address')}</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="street">{translate('account.street')}</Label>
                        <Input 
                          id="street" 
                          value={user?.address?.street || ''} 
                          disabled={!isEditing}
                          onChange={(e) => setUser(prev => ({
                            ...prev!,
                            address: { ...prev!.address, street: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{translate('account.city')}</Label>
                        <Input 
                          id="city" 
                          value={user?.address?.city || ''} 
                          disabled={!isEditing}
                          onChange={(e) => setUser(prev => ({
                            ...prev!,
                            address: { ...prev!.address, city: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">{translate('account.state')}</Label>
                        <Input 
                          id="state" 
                          value={user?.address?.state || ''} 
                          disabled={!isEditing}
                          onChange={(e) => setUser(prev => ({
                            ...prev!,
                            address: { ...prev!.address, state: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{translate('account.zip')}</Label>
                        <Input 
                          id="zipCode" 
                          value={user?.address?.zipCode || ''} 
                          disabled={!isEditing}
                          onChange={(e) => setUser(prev => ({
                            ...prev!,
                            address: { ...prev!.address, zipCode: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{translate('account.language')}</CardTitle>
                      <CardDescription>Choose your preferred language for the interface</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Interface Language</Label>
                            <p className="text-sm text-gray-500">Select the language you want to use</p>
                          </div>
                          <LanguageSelector className="w-[200px]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Accessibility & Privacy</CardTitle>
                  <CardDescription>Customize your experience and privacy settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Accessibility Options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="highContrast">High Contrast Mode</Label>
                            <p className="text-sm text-gray-500">Enhance visual contrast for better readability</p>
                          </div>
                          <Switch 
                            id="highContrast"
                            checked={preferences.accessibility.highContrast}
                            onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
                            aria-label="Toggle high contrast mode"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="largeText">Large Text</Label>
                            <p className="text-sm text-gray-500">Increase text size for better visibility</p>
                          </div>
                          <Switch 
                            id="largeText"
                            checked={preferences.accessibility.largeText}
                            onCheckedChange={(checked) => handleAccessibilityChange('largeText', checked)}
                            aria-label="Toggle large text mode"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="screenReader">Screen Reader Support</Label>
                            <p className="text-sm text-gray-500">Enable enhanced screen reader compatibility</p>
                          </div>
                          <Switch 
                            id="screenReader"
                            checked={preferences.accessibility.screenReader}
                            onCheckedChange={(checked) => handleAccessibilityChange('screenReader', checked)}
                            aria-label="Toggle screen reader support"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="profileVisibility">Profile Visibility</Label>
                            <p className="text-sm text-gray-500">Control who can see your profile information</p>
                          </div>
                          <select
                            id="profileVisibility"
                            className="form-select rounded-md border-gray-300"
                            value={preferences.privacy.profileVisibility}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as 'public' | 'private' | 'contacts')}
                            aria-label="Select profile visibility"
                          >
                            <option value="private">Private</option>
                            <option value="contacts">Contacts Only</option>
                            <option value="public">Public</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="locationSharing">Location Sharing</Label>
                            <p className="text-sm text-gray-500">Allow trusted contacts to see your location during emergencies</p>
                            {locationSharing.lastLocation && (
                              <div className="mt-2 text-sm text-gray-500">
                                <p>Last updated: {new Date(locationSharing.lastLocation.timestamp).toLocaleString()}</p>
                                <p>Accuracy: {Math.round(locationSharing.lastLocation.accuracy)}m</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <select
                              className="form-select text-sm"
                              value={locationSharing.updateInterval}
                              onChange={(e) => setLocationSharing(prev => ({
                                ...prev,
                                updateInterval: parseInt(e.target.value)
                              }))}
                            >
                              <option value="5">Update every 5 min</option>
                              <option value="15">Update every 15 min</option>
                              <option value="30">Update every 30 min</option>
                              <option value="60">Update every hour</option>
                            </select>
                            <Switch 
                              id="locationSharing"
                              checked={locationSharing.isEnabled}
                              onCheckedChange={handleLocationSharing}
                              aria-label="Toggle location sharing"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="activityHistory">Activity History</Label>
                              <p className="text-sm text-gray-500">Control how your activity is tracked and shared</p>
                            </div>
                            <Switch 
                              id="activityHistory"
                              checked={activityHistory.isEnabled}
                              onCheckedChange={handleActivityHistoryChange}
                              aria-label="Toggle activity history"
                            />
                          </div>

                          {activityHistory.isEnabled && (
                            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="activityVisibility">Visibility</Label>
                                <select
                                  id="activityVisibility"
                                  className="form-select text-sm rounded-md border-gray-300"
                                  value={activityHistory.visibleTo}
                                  onChange={(e) => setActivityHistory(prev => ({
                                    ...prev,
                                    visibleTo: e.target.value as ActivityHistoryState['visibleTo']
                                  }))}
                                >
                                  <option value="none">Only Me</option>
                                  <option value="trusted">Trusted Contacts</option>
                                  <option value="all">All Contacts</option>
                                </select>
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor="retentionPeriod">Data Retention</Label>
                                <select
                                  id="retentionPeriod"
                                  className="form-select text-sm rounded-md border-gray-300"
                                  value={activityHistory.retentionPeriod}
                                  onChange={(e) => setActivityHistory(prev => ({
                                    ...prev,
                                    retentionPeriod: parseInt(e.target.value)
                                  }))}
                                >
                                  <option value="7">7 days</option>
                                  <option value="30">30 days</option>
                                  <option value="90">90 days</option>
                                  <option value="180">180 days</option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <Label>Track Activity Categories</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(activityHistory.categories).map(([category, isEnabled]) => (
                                    <div key={category} className="flex items-center space-x-2">
                                      <Switch 
                                        id={`category-${category}`}
                                        checked={isEnabled}
                                        onCheckedChange={() => handleActivityCategoryToggle(category as keyof ActivityHistoryState['categories'])}
                                        aria-label={`Toggle ${category} tracking`}
                                      />
                                      <Label htmlFor={`category-${category}`} className="capitalize">
                                        {category}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h5 className="text-sm font-medium mb-2">Activity Tracking Notice</h5>
                                <p className="text-sm text-gray-600">
                                  Your activity is being recorded and will be retained for {activityHistory.retentionPeriod} days. 
                                  This data is visible to {activityHistory.visibleTo === 'none' ? 'only you' : 
                                    activityHistory.visibleTo === 'trusted' ? 'your trusted contacts' : 'all your contacts'}.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety">
            <div className="space-y-6">
              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Emergency Contacts</CardTitle>
                  <CardDescription>Manage your trusted emergency contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {safetySettings.emergencyContacts.map((contact, index) => (
                      <div key={contact.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{contact.name}</h4>
                              <p className="text-sm text-gray-500">{contact.relationship}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {contact.isVerified && (
                              <Badge variant="secondary" className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact.id)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Phone Number</Label>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                          {contact.email && (
                            <div>
                              <Label>Email</Label>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{contact.email}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <Label className="mb-2 block">Notification Preferences</Label>
                          <div className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id={`sms-${contact.id}`}
                                checked={contact.notificationPreferences.sms}
                                onCheckedChange={(checked) => handleUpdateContactPreferences(contact.id, 'sms', checked)}
                              />
                              <Label htmlFor={`sms-${contact.id}`}>SMS</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id={`email-${contact.id}`}
                                checked={contact.notificationPreferences.email}
                                onCheckedChange={(checked) => handleUpdateContactPreferences(contact.id, 'email', checked)}
                              />
                              <Label htmlFor={`email-${contact.id}`}>Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id={`app-${contact.id}`}
                                checked={contact.notificationPreferences.app}
                                onCheckedChange={(checked) => handleUpdateContactPreferences(contact.id, 'app', checked)}
                              />
                              <Label htmlFor={`app-${contact.id}`}>App</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleAddContact}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Emergency Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Safety Check-ins</CardTitle>
                  <CardDescription>Set up regular safety check-ins and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Safety Check-ins</Label>
                        <p className="text-sm text-gray-500">Receive regular reminders to confirm your safety</p>
                      </div>
                      <Switch 
                        checked={safetySettings.safetyChecks.enabled}
                        onCheckedChange={(checked) => 
                          setSafetySettings(prev => ({
                            ...prev,
                            safetyChecks: { ...prev.safetyChecks, enabled: checked }
                          }))
                        }
                      />
                    </div>

                    {safetySettings.safetyChecks.enabled && (
                      <div className="space-y-4">
                        <div>
                          <Label>Check-in Frequency</Label>
                          <select
                            className="form-select mt-1 block w-full"
                            value={safetySettings.safetyChecks.frequency}
                            onChange={(e) => 
                              setSafetySettings(prev => ({
                                ...prev,
                                safetyChecks: { 
                                  ...prev.safetyChecks, 
                                  frequency: e.target.value as 'daily' | 'weekly' | 'monthly' 
                                }
                              }))
                            }
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <Label>Last Check-in</Label>
                          <p className="text-sm text-gray-500">
                            {new Date(safetySettings.safetyChecks.lastCheck).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Trusted Locations</CardTitle>
                  <CardDescription>Manage your safe locations and zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safetySettings.trustedLocations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{location.name}</h4>
                          <p className="text-sm text-gray-500">{location.address}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Trusted Location
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Emergency Button Settings</CardTitle>
                  <CardDescription>Configure your emergency button preferences</CardDescription>
        </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Emergency Button</Label>
                        <p className="text-sm text-gray-500">Quick access to emergency help</p>
                      </div>
                      <Switch 
                        checked={safetySettings.panicButton.enabled}
                        onCheckedChange={(checked) => 
                          setSafetySettings(prev => ({
                            ...prev,
                            panicButton: { ...prev.panicButton, enabled: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-notify Contacts</Label>
                        <p className="text-sm text-gray-500">Automatically notify emergency contacts</p>
                      </div>
                      <Switch 
                        checked={safetySettings.panicButton.autoNotify}
                        onCheckedChange={(checked) => 
                          setSafetySettings(prev => ({
                            ...prev,
                            panicButton: { ...prev.panicButton, autoNotify: checked }
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Custom Emergency Message</Label>
                      <Textarea 
                        value={safetySettings.panicButton.customMessage}
                        onChange={(e) => 
                          setSafetySettings(prev => ({
                            ...prev,
                            panicButton: { ...prev.panicButton, customMessage: e.target.value }
                          }))
                        }
                        className="mt-2"
                        placeholder="Enter your custom emergency message"
                      />
                    </div>
          </div>
        </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Saved Resources</CardTitle>
                  <CardDescription>Access your bookmarked resources and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Input 
                        placeholder="Search resources..." 
                        className="flex-1"
                      />
                      <select className="form-select">
                        <option value="all">All Types</option>
                        <option value="legal">Legal</option>
                        <option value="safety">Safety</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="community">Community</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div 
                          key={resource.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge>{resource.type}</Badge>
                                {resource.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setResources(prev => 
                                  prev.map(r => 
                                    r.id === resource.id 
                                      ? { ...r, isBookmarked: !r.isBookmarked }
                                      : r
                                  )
                                );
                              }}
                            >
                              <BookmarkCheck 
                                className={`w-4 h-4 ${
                                  resource.isBookmarked ? 'text-purple-600' : 'text-gray-400'
                                }`} 
                              />
          </Button>
                          </div>
                          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                            <span>Added {new Date(resource.dateAdded).toLocaleDateString()}</span>
                            {resource.url && (
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline flex items-center"
                              >
                                View Resource
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="space-y-6">
              <Card className="border-sgc-purple/20 hover:border-sgc-purple/40 transition-colors">
                <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
                  <CardTitle className="text-sgc-purple">Recent Activity</CardTitle>
                  <CardDescription>Track your account activity and security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Input 
                        placeholder="Search activity..." 
                        className="flex-1"
                      />
                      <select className="form-select">
                        <option value="all">All Activities</option>
                        <option value="login">Logins</option>
                        <option value="emergency">Emergency Events</option>
                        <option value="safety_check">Safety Checks</option>
                        <option value="profile_update">Profile Updates</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div 
                          key={activity.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`
                              h-8 w-8 rounded-full flex items-center justify-center
                              ${activity.severity === 'high' ? 'bg-red-100' : 
                                activity.severity === 'medium' ? 'bg-yellow-100' : 
                                'bg-green-100'}
                            `}>
                              {activity.type === 'login' && <LogIn className="w-4 h-4 text-gray-600" />}
                              {activity.type === 'emergency' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                              {activity.type === 'safety_check' && <Shield className="w-4 h-4 text-green-600" />}
                              {activity.type === 'profile_update' && <User className="w-4 h-4 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{activity.description}</h4>
                                  <p className="text-sm text-gray-500">
                                    {new Date(activity.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <Badge 
                                  variant={
                                    activity.severity === 'high' ? 'destructive' : 
                                    activity.severity === 'medium' ? 'secondary' : 
                                    'default'
                                  }
                                >
                                  {activity.severity}
                                </Badge>
                              </div>
                              {activity.details && (
                                <div className="mt-2 text-sm text-gray-500">
                                  {activity.details.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{activity.details.location}</span>
                                    </div>
                                  )}
                                  {activity.details.device && (
                                    <div className="flex items-center space-x-1">
                                      <Monitor className="w-4 h-4" />
                                      <span>{activity.details.device}</span>
                                    </div>
                                  )}
                                  {activity.details.status && (
                                    <div className="flex items-center space-x-1">
                                      <Info className="w-4 h-4" />
                                      <span>{activity.details.status}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
      </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account; 