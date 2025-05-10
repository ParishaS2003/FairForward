import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Info, Search, Map, AlertTriangle, Heart, Navigation, List, Star, Filter, ChevronDown, Shield, Users, Home } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SafeSpaces.css';
import { motion } from 'framer-motion';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
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
  const mapRef = useRef(null);

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
        const response = await fetch('/data/shelters1.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        
        const rows = text.split('\n')
          .filter(row => row.trim())
          .slice(2);
        
        const processedShelters = [];
        let currentShelter = null;
        let currentAddress = [];
        let currentPhone = '';
        let shelterCounter = 0; // Add counter for unique IDs

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
            shelterCounter++; // Increment counter for each new shelter
            
            currentShelter = {
              id: `${columns[0]}-${columns[1]}-${shelterCounter}`, // Add counter to make ID unique
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
        
        // Process shelters in smaller batches to avoid overwhelming the geocoding service
        const batchSize = 5;
        const geocodedShelters = [];
        
        for (let i = 0; i < validShelters.length; i += batchSize) {
          const batch = validShelters.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (shelter) => {
              try {
                const fullAddress = `${shelter.address}, ${shelter.city}`;
                const coordinates = await geocodeAddress(fullAddress);
                return { ...shelter, ...coordinates };
              } catch (error) {
                console.error(`Failed to geocode address for ${shelter.name}:`, error);
                return { ...shelter, lat: null, lng: null };
              }
            })
          );
          geocodedShelters.push(...batchResults);
        }

        console.log('Loaded shelters:', geocodedShelters);
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

    return (
      <div style={{ height: '600px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              eventHandlers={{
                click: () => setSelectedShelter(marker.shelter),
              }}
              icon={createCustomIcon(
                marker.shelter.category.includes('24 Hour')
                  ? '#ef4444'
                  : marker.shelter.category.includes('Youth')
                  ? '#3b82f6'
                  : '#22c55e'
              )}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-gray-900">{marker.shelter.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{marker.shelter.address}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(marker.shelter.category)}`}>
                      {marker.shelter.gender}
                    </span>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {marker.shelter.ageRange}
                    </span>
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
                </div>
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#3b82f6')}
            />
          )}

          <MapUpdater center={[mapCenter.lat, mapCenter.lng]} />
        </MapContainer>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Safe Spaces Near You
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Find shelter, support, and resources in your area. Your safety is our priority.
            </p>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search shelters by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/95 backdrop-blur-sm transition-all duration-300 text-base"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Emergency Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 mb-12 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-100 p-4 rounded-full mr-6">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <span className="text-red-700 font-semibold text-xl block">Emergency Resources Available 24/7</span>
                <span className="text-red-600 text-lg">Immediate assistance is just a call away</span>
              </div>
            </div>
            <a
              href="tel:911"
              className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium"
            >
              <Phone className="w-6 h-6" />
              Call 911
            </a>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('list')}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 text-base font-medium ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md transform -translate-y-0.5' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 text-base font-medium ${
                  viewMode === 'map' 
                    ? 'bg-blue-600 text-white shadow-md transform -translate-y-0.5' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Map className="w-5 h-5" />
                Map View
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-all duration-300 text-base font-medium"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base font-medium appearance-none bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="distance">Sort by Distance</option>
                <option value="beds">Sort by Available Beds</option>
              </select>

              <button
                onClick={requestLocation}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base font-medium"
              >
                <Navigation className="w-5 h-5" />
                Use My Location
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-3">
                {[
                  { type: 'all', label: 'All Shelters', color: 'blue', icon: Home },
                  { type: 'emergency', label: '24-Hour Shelters', color: 'red', icon: Shield },
                  { type: 'youth', label: 'Youth Shelters', color: 'blue', icon: Users },
                  { type: 'family', label: 'Family Shelters', color: 'green', icon: Heart }
                ].map(({ type, label, color, icon: Icon }) => (
                  <motion.button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedType === type 
                        ? `bg-${color}-600 text-white shadow-md` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        {viewMode === 'list' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid gap-8"
          >
            {getSortedShelters().length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-xl border border-gray-100">
                <Search className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl font-medium mb-3">No shelters found matching your criteria.</p>
                <p className="text-gray-400 text-lg">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              getSortedShelters().map((shelter, index) => (
                <motion.div
                  key={shelter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{shelter.name}</h3>
                        <button
                          onClick={() => toggleFavorite(shelter.id)}
                          className={`p-2 rounded-full transition-all duration-300 ${
                            favorites.includes(shelter.id)
                              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50'
                          }`}
                        >
                          <Star className="w-6 h-6" fill={favorites.includes(shelter.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
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
                    </div>
                    <div className="flex gap-3">
                      {shelter.phone && (
                        <a
                          href={`tel:${shelter.phone}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-base bg-blue-50 px-6 py-3 rounded-full transition-all duration-300 hover:bg-blue-100 font-medium"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          {shelter.phone}
                        </a>
                      )}
                      {getDistance(shelter) && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-800 text-base bg-green-50 px-6 py-3 rounded-full transition-all duration-300 hover:bg-green-100 font-medium"
                        >
                          <Navigation className="w-5 h-5 mr-2" />
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>

                  {shelter.address && (
                    <div className="mt-6 flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                      <MapPin className="w-6 h-6 mr-4 text-gray-400" />
                      <span className="text-base">{shelter.address}</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <MapView />
          </motion.div>
        )}

        {/* Additional Resources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
            <Heart className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Need Support?</h3>
            <p className="text-gray-600 mb-4 leading-relaxed text-base">Connect with local support services and counselors available 24/7.</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 text-base group">
              Find Support
              <ChevronDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
            <Info className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Resources & Information</h3>
            <p className="text-gray-600 mb-4 leading-relaxed text-base">Access guides, FAQs, and important information about shelter services.</p>
            <a href="#" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-2 text-base group">
              Learn More
              <ChevronDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
            <Phone className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Helpline Directory</h3>
            <p className="text-gray-600 mb-4 leading-relaxed text-base">Find contact information for various emergency and support helplines.</p>
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-2 text-base group">
              View Directory
              <ChevronDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SafeSpaces;