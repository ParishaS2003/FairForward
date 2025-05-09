import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Info } from 'lucide-react';

const SafeSpaces = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const loadSheltersData = async () => {
      try {
        console.log('Attempting to fetch shelters data...');
        const response = await fetch('/data/shelters1.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Received CSV data:', text.slice(0, 200) + '...');
        
        // Split by newlines and remove empty lines
        const rows = text.split('\n')
          .filter(row => row.trim())
          .slice(2); // Skip header rows
        
        const processedShelters = [];
        let currentShelter = null;
        let currentAddress = [];
        let currentPhone = '';
        let currentNote = '';
        let currentIntakeInfo = '';

        rows.forEach(row => {
          const columns = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
          
          // Check if this is a new shelter entry (has name and city)
          if (columns[0] && columns[1]) {
            if (currentShelter) {
              // Add accumulated info to the previous shelter
              if (currentAddress.length > 0) {
                currentShelter.address = currentAddress.join(', ').trim();
              }
              if (currentPhone) {
                currentShelter.phone = currentPhone.trim();
              }
              if (currentNote) {
                currentShelter.note = currentNote.trim();
              }
              if (currentIntakeInfo) {
                currentShelter.intakeInfo = currentIntakeInfo.trim();
              }
              processedShelters.push(currentShelter);
            }
            
            // Reset accumulated info for new shelter
            currentAddress = [];
            currentPhone = '';
            currentNote = columns[5] || '';
            currentIntakeInfo = columns[6] || '';
            
            currentShelter = {
              id: `${columns[0]}-${columns[1]}`,
              name: columns[0],
              city: columns[1],
              gender: columns[2],
              ageRange: columns[3],
              beds: columns[4],
              note: '',
              intakeInfo: '',
              address: '',
              phone: '',
              services: columns[7] || '',
              category: columns[8] || ''
            };
          } else if (currentShelter) {
            // Handle additional lines for the current shelter
            const firstCol = columns[0] || '';
            
            // Check if this line contains an address (any non-empty line that's not a phone number)
            if (firstCol.trim() && !firstCol.match(/^\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
              // If it's not a phone number and not empty, treat it as address
              currentAddress.push(firstCol.trim());
            }
            // Check if this is a phone line
            else if (firstCol.match(/^\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
              currentPhone = firstCol;
            }
            // Accumulate notes and intake info
            if (columns[5]) {
              currentNote += ' ' + columns[5];
            }
            if (columns[6]) {
              currentIntakeInfo += ' ' + columns[6];
            }
          }
        });

        // Add the last shelter
        if (currentShelter) {
          if (currentAddress.length > 0) {
            currentShelter.address = currentAddress.join(', ').trim();
          }
          if (currentPhone) {
            currentShelter.phone = currentPhone.trim();
          }
          if (currentNote) {
            currentShelter.note = currentNote.trim();
          }
          if (currentIntakeInfo) {
            currentShelter.intakeInfo = currentIntakeInfo.trim();
          }
          processedShelters.push(currentShelter);
        }

        // Remove any shelters with empty names
        const validShelters = processedShelters.filter(shelter => shelter.name && shelter.name.trim() !== '');
        
        setShelters(validShelters);
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
    if (type.includes('Lineup')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredShelters = selectedType === 'all' 
    ? shelters 
    : shelters.filter(shelter => {
        if (selectedType === 'emergency') return shelter.category.includes('24 Hour');
        if (selectedType === 'youth') return shelter.ageRange.includes('Youth') || shelter.ageRange.includes('16-18') || shelter.ageRange.includes('13-24');
        if (selectedType === 'family') return shelter.gender.includes('Families') || shelter.name.toLowerCase().includes('family');
        return true;
      });

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Safe Spaces Near You</h1>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('emergency')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'emergency' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            24-Hour Shelters
          </button>
          <button
            onClick={() => setSelectedType('youth')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'youth' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Youth Shelters
          </button>
          <button
            onClick={() => setSelectedType('family')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'family' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Family Shelters
          </button>
        </div>

        <div className="grid gap-4">
          {filteredShelters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No shelters found for the selected type.
            </div>
          ) : (
            filteredShelters.map((shelter, index) => (
              <div
                key={`${shelter.name}-${shelter.city}-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{shelter.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(shelter.category)}`}>
                        {shelter.gender}
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {shelter.ageRange}
                      </span>
                      {shelter.beds && shelter.beds !== '-' && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {shelter.beds}
                        </span>
                      )}
                    </div>
                  </div>
                  {shelter.phone && (
                    <a
                      href={`tel:${shelter.phone}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {shelter.phone}
                    </a>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {shelter.address && (
                    <div className="flex items-start text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{shelter.address}</span>
                    </div>
                  )}

                  {shelter.intakeInfo && (
                    <div className="flex items-start text-gray-600">
                      <Clock className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{shelter.intakeInfo}</span>
                    </div>
                  )}

                  {shelter.note && (
                    <div className="flex items-start text-gray-600">
                      <Info className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{shelter.note}</span>
                    </div>
                  )}

                  {shelter.services && shelter.services !== 'none' && (
                    <div className="flex items-start text-gray-600">
                      <Info className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">Services: {shelter.services}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeSpaces;