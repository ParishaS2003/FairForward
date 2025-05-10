import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Phone, Clock, Info, Search, Map, AlertTriangle, Heart, Navigation, List, Star, Filter, ChevronDown, Shield, Users, Home } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

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
  const geocoder = useRef(null);

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

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDHvDKki_ZB-gu31FmPoSdf8ubxJK0va88",
    libraries: ['places']
  });

  const geocodeAddress = async (address) => {
    if (!geocoder.current) {
      geocoder.current = new window.google.maps.Geocoder();
    }

    return new Promise((resolve, reject) => {
      geocoder.current.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
          reject(new Error('Geocoding failed'));
        }
      });
    });
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
            
            currentShelter = {
              id: `${columns[0]}-${columns[1]}`,
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
        
        // Geocode addresses
        const geocodedShelters = await Promise.all(
          validShelters.map(async (shelter) => {
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

  const onMapLoad = useCallback((map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
  }, []);

  const onMapError = useCallback((error) => {
    console.error('Error loading map:', error);
    setError('Failed to load map. Please try again later.');
  }, []);

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
    console.log('Rendering MapView with shelters:', shelters);
    
    const markers = getSortedShelters()
      .filter(shelter => shelter.lat && shelter.lng)
      .map(shelter => ({
        position: { lat: shelter.lat, lng: shelter.lng },
        shelter
      }));

    console.log('Filtered markers:', markers);

    if (loadError) {
      return (
        <div className="h-[600px] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg">Failed to load Google Maps</p>
            <p className="text-gray-500 text-sm mt-2">Please check your internet connection and try again</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="h-[600px] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={12}
        options={mapOptions}
        onLoad={onMapLoad}
        onError={onMapError}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            onClick={() => setSelectedShelter(marker.shelter)}
            icon={{
              url: marker.shelter.category.includes('24 Hour') 
                ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : marker.shelter.category.includes('Youth')
                ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}

        {selectedShelter && (
          <InfoWindow
            position={{ lat: selectedShelter.lat, lng: selectedShelter.lng }}
            onCloseClick={() => setSelectedShelter(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900">{selectedShelter.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedShelter.address}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedShelter.category)}`}>
                  {selectedShelter.gender}
                </span>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {selectedShelter.ageRange}
                </span>
              </div>
              {selectedShelter.phone && (
                <a
                  href={`tel:${selectedShelter.phone}`}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  {selectedShelter.phone}
                </a>
              )}
            </div>
          </InfoWindow>
        )}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        )}
      </GoogleMap>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Safe Spaces Near You</h1>
          <p className="text-xl text-center text-blue-100 mb-8">Find shelter, support, and resources in your area</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shelters by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 transform hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <span className="text-red-700 font-semibold block">Emergency Resources Available 24/7</span>
                <span className="text-red-600 text-sm">Immediate assistance is just a call away</span>
              </div>
            </div>
            <a
              href="tel:911"
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call 911
            </a>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  viewMode === 'map' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="distance">Sort by Distance</option>
                <option value="beds">Sort by Available Beds</option>
              </select>

              <button
                onClick={requestLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Use My Location
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {[
                  { type: 'all', label: 'All Shelters', color: 'blue', icon: Home },
                  { type: 'emergency', label: '24-Hour Shelters', color: 'red', icon: Shield },
                  { type: 'youth', label: 'Youth Shelters', color: 'blue', icon: Users },
                  { type: 'family', label: 'Family Shelters', color: 'green', icon: Heart }
                ].map(({ type, label, color, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                      selectedType === type 
                        ? `bg-${color}-600 text-white shadow-lg` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'list' ? (
          <div className="grid gap-6">
            {getSortedShelters().length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No shelters found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              getSortedShelters().map((shelter) => (
                <div
                  key={shelter.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">{shelter.name}</h3>
                        <button
                          onClick={() => toggleFavorite(shelter.id)}
                          className={`p-1 rounded-full transition-colors ${
                            favorites.includes(shelter.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className="w-5 h-5" fill={favorites.includes(shelter.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(shelter.category)}`}>
                          {shelter.gender}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {shelter.ageRange}
                        </span>
                        {shelter.beds && shelter.beds !== '-' && (
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {shelter.beds}
                          </span>
                        )}
                        {getDistance(shelter) && (
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {getDistance(shelter).toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {shelter.phone && (
                        <a
                          href={`tel:${shelter.phone}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-4 py-2 rounded-full transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {shelter.phone}
                        </a>
                      )}
                      {getDistance(shelter) && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-800 text-sm bg-green-50 px-4 py-2 rounded-full transition-colors"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>

                  {shelter.address && (
                    <div className="mt-4 flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm">{shelter.address}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {error ? (
              <div className="h-[600px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 text-lg">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="h-[600px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading shelters data...</p>
                </div>
              </div>
            ) : (
              <MapView />
            )}
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Heart className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Need Support?</h3>
            <p className="text-gray-600 mb-4">Connect with local support services and counselors available 24/7.</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2">
              Find Support
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </a>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Info className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resources & Information</h3>
            <p className="text-gray-600 mb-4">Access guides, FAQs, and important information about shelter services.</p>
            <a href="#" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-2">
              Learn More
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </a>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Helpline Directory</h3>
            <p className="text-gray-600 mb-4">Find contact information for various emergency and support helplines.</p>
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-2">
              View Directory
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSpaces;