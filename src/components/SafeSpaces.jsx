import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Info, Search, Map, AlertTriangle, Heart, Navigation, List, Star, Filter, ChevronDown, Shield, Users, Home, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SafeSpaces.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color, name, city) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="relative">
        <div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>
        <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap" style="min-width: max-content;">
          ${name}, ${city}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Component to handle map center updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

// Add this utility function at the top level
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SafeSpaces = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [expandedShelterId, setExpandedShelterId] = useState(null);
  const mapRef = useRef(null);
  const [hootsworthMessage, setHootsworthMessage] = useState("");

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.75rem'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    scaleControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const geocodeAddress = async (address) => {
    try {
      // Add a delay between requests to respect rate limits
      await delay(1000); // 1 second delay between requests
      
      const response = await fetch(
        `http://localhost:3001/api/geocode?address=${encodeURIComponent(address)}`
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          // If we hit rate limit, wait longer and retry
          await delay(5000); // Wait 5 seconds
          return geocodeAddress(address);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadSheltersData = async () => {
      try {
        console.log('Starting to load shelters data...');
        const response = await fetch('/data/shelters1.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        
        console.log('CSV data loaded, processing...');
        const rows = text.split('\n')
          .filter(row => row.trim())
          .slice(2);
        
        const processedShelters = [];
        let currentShelter = null;
        let currentAddress = [];
        let currentPhone = '';
        let shelterCounter = 0;

        rows.forEach(row => {
          const columns = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
          
          if (columns[0] && columns[1]) {
            if (currentShelter) {
              currentShelter.address = currentAddress.join(', ').trim();
              currentShelter.phone = currentPhone.trim();
              processedShelters.push(currentShelter);
            }
            
            currentAddress = [];
            currentPhone = '';
            shelterCounter++;
            
            currentShelter = {
              id: `${columns[0]}-${columns[1]}-${shelterCounter}`,
              name: columns[0],
              city: columns[1],
              gender: columns[2],
              ageRange: columns[3],
              beds: columns[4],
              address: '',
              phone: '',
              category: columns[8] || ''
            };
          } else if (currentShelter) {
            const firstCol = columns[0] || '';
            
            if (firstCol.trim() && !firstCol.match(/^\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
              currentAddress.push(firstCol.trim());
            } else if (firstCol.match(/^\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
              currentPhone = firstCol;
            }
          }
        });

        if (currentShelter) {
          currentShelter.address = currentAddress.join(', ').trim();
          currentShelter.phone = currentPhone.trim();
          processedShelters.push(currentShelter);
        }

        const validShelters = processedShelters.filter(shelter => shelter.name && shelter.name.trim() !== '');
        console.log('Processed shelters:', validShelters);
        
        // Process shelters in smaller batches to avoid overwhelming the geocoding service
        const batchSize = 5;
        const geocodedShelters = [];
        
        for (let i = 0; i < validShelters.length; i += batchSize) {
          const batch = validShelters.slice(i, i + batchSize);
          console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(validShelters.length/batchSize)}`);
          
          const batchResults = await Promise.all(
            batch.map(async (shelter) => {
            try {
              const fullAddress = `${shelter.address}, ${shelter.city}`;
                console.log('Geocoding address:', fullAddress);
              const coordinates = await geocodeAddress(fullAddress);
                console.log('Geocoding result:', coordinates);
              return { ...shelter, ...coordinates };
            } catch (error) {
              console.error(`Failed to geocode address for ${shelter.name}:`, error);
              return { ...shelter, lat: null, lng: null };
            }
          })
        );
          geocodedShelters.push(...batchResults);
        }

        console.log('Final geocoded shelters:', geocodedShelters);
        const validGeocodedShelters = geocodedShelters.filter(shelter => shelter.lat && shelter.lng);
        console.log('Shelters with valid coordinates:', validGeocodedShelters);
        
        setShelters(geocodedShelters);
        setLoading(false);
      } catch (error) {
        console.error('Error loading shelters data:', error);
        setError('Unable to load shelters data. Please try again later.');
        setLoading(false);
      }
    };

    loadSheltersData();
  }, []);

  const getTypeColor = (type) => {
    if (type.includes('24 Hour')) return 'bg-red-100 text-red-800';
    if (type.includes('Youth')) return 'bg-blue-100 text-blue-800';
    if (type.includes('Seasonal')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredShelters = selectedType === 'all' 
    ? shelters 
    : shelters.filter(shelter => {
        if (selectedType === 'emergency') return shelter.category.includes('24 Hour');
        if (selectedType === 'youth') return shelter.ageRange.includes('Youth') || shelter.ageRange.includes('16-18');
        if (selectedType === 'family') return shelter.gender.includes('Families');
        return true;
      });

  const getSortedShelters = () => {
    let filtered = filteredShelters.filter(shelter => 
      shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shelter.address && shelter.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (sortBy) {
      case 'distance':
        return filtered.sort((a, b) => {
          const distA = getDistance(a);
          const distB = getDistance(b);
          if (!distA) return 1;
          if (!distB) return -1;
          return distA - distB;
        });
      case 'beds':
        return filtered.sort((a, b) => {
          const bedsA = parseInt(a.beds) || 0;
          const bedsB = parseInt(b.beds) || 0;
          return bedsB - bedsA;
        });
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getDistance = (shelter) => {
    if (!userLocation || !shelter.lat || !shelter.lng) return null;
    const R = 6371;
    const dLat = (shelter.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (shelter.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(shelter.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const toggleFavorite = (shelterId) => {
    setFavorites(prev => 
      prev.includes(shelterId) 
        ? prev.filter(id => id !== shelterId)
        : [...prev, shelterId]
    );
  };

  const MapView = () => {
    const markers = getSortedShelters()
      .filter(shelter => shelter.lat && shelter.lng)
      .map(shelter => ({
        position: [shelter.lat, shelter.lng],
        shelter
      }));

    // Add debug logging
    console.log('Filtered shelters with coordinates:', markers);
    console.log('Map center:', mapCenter);

    return (
      <div style={{ height: '600px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
          scrollWheelZoom={true}
          whenCreated={(map) => {
            console.log('Map created:', map);
            // Fit bounds to show all markers if there are any
            if (markers.length > 0) {
              const bounds = L.latLngBounds(markers.map(m => m.position));
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker, index) => {
            console.log('Rendering marker:', marker);
      return (
              <Marker
                key={index}
                position={marker.position}
                eventHandlers={{
                  click: () => {
                    setSelectedShelter(marker.shelter);
                    setShowShelterModal(true);
                  },
                }}
                icon={createCustomIcon(
                  marker.shelter.category.includes('24 Hour')
                    ? '#ef4444'
                    : marker.shelter.category.includes('Youth')
                    ? '#3b82f6'
                    : '#22c55e',
                  marker.shelter.name,
                  marker.shelter.city
                )}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-semibold text-gray-900">{marker.shelter.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{marker.shelter.city}</p>
                    <p className="text-sm text-gray-600 mt-1">{marker.shelter.address}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(marker.shelter.category)}`}>
                        {marker.shelter.gender}
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {marker.shelter.ageRange}
                      </span>
                      {marker.shelter.beds && marker.shelter.beds !== '-' && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {marker.shelter.beds} beds
                        </span>
                      )}
                    </div>
                    {marker.shelter.phone && (
                      <a
                        href={`tel:${marker.shelter.phone}`}
                        className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {marker.shelter.phone}
                      </a>
                    )}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedShelter(marker.shelter);
                          setShowShelterModal(true);
                        }}
                      >
                        View Details
                      </Button>
          </div>
        </div>
                </Popup>
              </Marker>
            );
          })}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#3b82f6', 'Your Location', '')}
            />
          )}

          <MapUpdater center={[mapCenter.lat, mapCenter.lng]} />
        </MapContainer>
        </div>
      );
  };

  // Add this new component for the shelter modal
  const ShelterModal = ({ shelter, onClose }) => {
    if (!shelter) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{shelter.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(shelter.category)}`}>
                  {shelter.gender}
                </span>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {shelter.ageRange}
                </span>
                {shelter.beds && shelter.beds !== '-' && (
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {shelter.beds}
                  </span>
                )}
                {getDistance(shelter) && (
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {getDistance(shelter).toFixed(1)} km away
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{shelter.address}</p>
                  </div>
                </div>

                {shelter.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-6 h-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
                      <a
                        href={`tel:${shelter.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {shelter.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
                    <p className="text-gray-600">
                      {shelter.category.includes('24 Hour') 
                        ? 'This is a 24-hour emergency shelter providing immediate assistance and support.'
                        : shelter.category.includes('Youth')
                        ? 'A safe space specifically designed for youth, offering support and resources.'
                        : 'A welcoming shelter providing essential services and support.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {shelter.phone && (
                  <a
                    href={`tel:${shelter.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}
                {getDistance(shelter) && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                </a>
              )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Add this new component for the embedded map
  const EmbeddedMap = ({ shelter }) => {
    if (!shelter.lat || !shelter.lng) return null;

    return (
      <div className="h-[300px] w-full rounded-xl overflow-hidden">
        <MapContainer
          center={[shelter.lat, shelter.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[shelter.lat, shelter.lng]}
            icon={createCustomIcon(
              shelter.category.includes('24 Hour')
                ? '#ef4444'
                : shelter.category.includes('Youth')
                ? '#3b82f6'
                : '#22c55e',
              shelter.name,
              shelter.city
            )}
          />
        </MapContainer>
      </div>
    );
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
      "Hoot! Need a safe place to stay? I'm here to help you find one!",
      "Looking for a shelter? Let me help you find the perfect match!",
      "Don't worry, I'll help you find a safe space nearby!",
      "Hoot hoot! Let's find you a comfortable shelter!",
      "Need immediate assistance? I'm your guide to safe spaces!"
    ];
    setHootsworthMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="sgc-container py-8">
      <div className="text-center mb-8 relative">
        <div className="flex items-center justify-center gap-6 mb-4">
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
          <div>
            <h1 className="sgc-heading-2 mb-2">Safe Spaces</h1>
            <p className="text-sgc-neutral max-w-2xl">
              Find shelter, support, and resources in your area. Your safety is our priority.
            </p>
          </div>
        </div>
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
        </div>

        {/* Controls Section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          defaultValue="all" 
          value={selectedType} 
          onValueChange={setSelectedType}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="emergency">24-Hour</TabsTrigger>
            <TabsTrigger value="youth">Youth</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-3">
          <Input
            placeholder="Search shelters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
                onClick={requestLocation}
            variant="outline"
            className="flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Use My Location
          </Button>
            </div>
          </div>

      {/* View Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            className="rounded-md"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            onClick={() => setViewMode('map')}
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            className="rounded-md"
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
        </div>

        {/* Main Content */}
        {viewMode === 'list' ? (
          <div className="grid gap-6">
            {getSortedShelters().length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <Search className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-medium mb-3">No shelters found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
            ) : (
              getSortedShelters().map((shelter) => (
              <Card key={shelter.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{shelter.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {shelter.gender}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {shelter.ageRange}
                        </Badge>
                        {shelter.beds && shelter.beds !== '-' && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {shelter.beds}
                          </Badge>
                        )}
                        {getDistance(shelter) && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {getDistance(shelter).toFixed(1)} km
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(shelter.id)}
                      className={favorites.includes(shelter.id) ? 'text-yellow-500' : ''}
                    >
                      <Star className="w-5 h-5" fill={favorites.includes(shelter.id) ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shelter.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <p className="text-gray-600">{shelter.address}</p>
                      </div>
                    )}
                      {shelter.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-1" />
                        <a href={`tel:${shelter.phone}`} className="text-blue-600 hover:text-blue-800">
                          {shelter.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  {shelter.phone && (
                    <Button className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                      )}
                      {getDistance(shelter) && (
                    <Button variant="outline" className="flex-1">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                    </Button>
                  )}
                </CardFooter>
              </Card>
              ))
            )}
          </div>
        ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
              <MapView />
          </CardContent>
        </Card>
        )}

        {/* Additional Resources */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Heart className="w-10 h-10 text-blue-500 mb-4" />
            <CardTitle>Need Support?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Connect with local support services and counselors available 24/7.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Find Support
              <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Info className="w-10 h-10 text-green-500 mb-4" />
            <CardTitle>Resources & Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Access guides, FAQs, and important information about shelter services.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Learn More
              <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Phone className="w-10 h-10 text-purple-500 mb-4" />
            <CardTitle>Helpline Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Find contact information for various emergency and support helplines.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Directory
              <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Shelter Modal */}
      {showShelterModal && selectedShelter && (
        <ShelterModal
          shelter={selectedShelter}
          onClose={() => {
            setShowShelterModal(false);
            setSelectedShelter(null);
          }}
        />
      )}
    </div>
  );
};

export default SafeSpaces;