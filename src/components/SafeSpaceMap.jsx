import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './SafeSpaceMap.css';
import sheltersData from '../data/shelters.csv';

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const SafeSpaceMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [shelters, setShelters] = useState([]);

  // Load and process shelters data
  useEffect(() => {
    const processSheltersData = async () => {
      try {
        const response = await fetch(sheltersData);
        const text = await response.text();
        const rows = text.split('\n').slice(1); // Skip header row
        
        const processedShelters = rows
          .filter(row => row.trim()) // Remove empty rows
          .map(row => {
            const [
              name,
              address,
              city,
              state,
              zip,
              phone,
              type,
              services,
              hours,
              notes,
              latitude,
              longitude
            ] = row.split(',').map(field => field.trim());

            return {
              id: `${name}-${address}`,
              name,
              type: type.toLowerCase(),
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
              description: services,
              contact: phone,
              address: `${address}, ${city}, ${state} ${zip}`,
              hours,
              notes
            };
          })
          .filter(shelter => 
            !isNaN(shelter.coordinates[0]) && 
            !isNaN(shelter.coordinates[1])
          );

        setShelters(processedShelters);
      } catch (error) {
        console.error('Error loading shelters data:', error);
        setError('Unable to load shelters data. Please try again later.');
      }
    };

    processSheltersData();
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setLocationPermission(result.state);
      
      if (result.state === 'denied') {
        setError('Location access was denied. Please enable location services in your browser settings.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to get your location. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access to find safe spaces near you.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  useEffect(() => {
    if (!userLocation || !mapContainer.current || !shelters.length) return;

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({
      color: '#4285F4',
      scale: 0.8
    })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">Your Location</h3>
          <p class="text-gray-600 text-sm">You are here</p>
        </div>
      `))
      .addTo(map.current);

    // Add shelter markers
    shelters.forEach(shelter => {
      const markerColor = shelter.type.includes('emergency') ? '#EF4444' : 
                         shelter.type.includes('transitional') ? '#3B82F6' : 
                         '#10B981';

      const marker = new mapboxgl.Marker({
        color: markerColor,
        scale: 0.8
      })
        .setLngLat(shelter.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${shelter.name}</h3>
            <p class="text-gray-600 text-sm">${shelter.address}</p>
            <p class="text-gray-600 text-sm mt-1">${shelter.description}</p>
            ${shelter.hours ? `<p class="text-gray-600 text-sm mt-1">Hours: ${shelter.hours}</p>` : ''}
            <a href="tel:${shelter.contact}" class="text-blue-600 hover:text-blue-800 text-sm mt-2 block">
              ${shelter.contact}
            </a>
            ${shelter.notes ? `<p class="text-gray-500 text-xs mt-2">${shelter.notes}</p>` : ''}
          </div>
        `))
        .addTo(map.current);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        setSelectedSpace(shelter);
      });
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation, shelters]);

  if (!userLocation && !loading && !error) {
    return (
      <div className="map-container flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Find Safe Spaces Near You</h3>
          <p className="text-gray-600 mb-6">
            Allow location access to see shelters and safe spaces in your area.
          </p>
          <button
            onClick={requestLocation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Share My Location
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="map-container flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 max-w-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={requestLocation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapContainer} className="h-full w-full" />
      {selectedSpace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-bold text-sm">{selectedSpace.name}</h3>
          <p className="text-gray-600 text-sm">{selectedSpace.address}</p>
          <p className="text-gray-600 text-sm mt-1">{selectedSpace.description}</p>
          {selectedSpace.hours && (
            <p className="text-gray-600 text-sm mt-1">Hours: {selectedSpace.hours}</p>
          )}
          <a
            href={`tel:${selectedSpace.contact}`}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 block"
          >
            {selectedSpace.contact}
          </a>
          {selectedSpace.notes && (
            <p className="text-gray-500 text-xs mt-2">{selectedSpace.notes}</p>
          )}
          <button
            onClick={() => setSelectedSpace(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default SafeSpaceMap; 