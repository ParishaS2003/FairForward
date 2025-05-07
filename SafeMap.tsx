
import React, { useState } from 'react';
import { MapPin, Home, Hospital, Building, Shield, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for demonstration
const safeSpaces = [
  {
    id: 1,
    name: "Women's Shelter",
    type: "shelter",
    address: "123 Safe Street, Downtown",
    distance: "0.8",
    phone: "+1-555-123-4567",
    services: ["Emergency housing", "Counseling", "Legal support"],
    openNow: true
  },
  {
    id: 2,
    name: "City Hospital - Safe Wing",
    type: "medical",
    address: "456 Health Avenue, Midtown",
    distance: "1.2",
    phone: "+1-555-987-6543",
    services: ["Medical care", "Crisis intervention", "Mental health"],
    openNow: true
  },
  {
    id: 3,
    name: "Legal Aid Center",
    type: "legal",
    address: "789 Justice Road, Uptown",
    distance: "2.5",
    phone: "+1-555-456-7890",
    services: ["Free legal consultation", "Document preparation", "Court representation"],
    openNow: false,
    openingTime: "9:00 AM Tomorrow"
  },
  {
    id: 4,
    name: "Community Support Center",
    type: "community",
    address: "101 Help Lane, Riverside",
    distance: "1.7",
    phone: "+1-555-321-0987",
    services: ["Support groups", "Job resources", "Education services"],
    openNow: true
  },
  {
    id: 5,
    name: "Emergency Police Station",
    type: "police",
    address: "202 Protection Blvd, Eastside",
    distance: "3.1",
    phone: "+1-555-911-0000",
    services: ["Emergency response", "Report filing", "Special victims unit"],
    openNow: true
  }
];

const getIconForType = (type: string) => {
  switch(type) {
    case 'shelter': return <Home className="text-sgc-purple" />;
    case 'medical': return <Hospital className="text-red-500" />;
    case 'legal': return <Building className="text-blue-500" />;
    case 'police': return <Shield className="text-blue-700" />;
    default: return <MapPin className="text-sgc-blue" />;
  }
};

const SafeMap = () => {
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredSpaces = activeFilter === "all" 
    ? safeSpaces 
    : safeSpaces.filter(space => space.type === activeFilter);

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Left sidebar with filters and listings */}
      <div className="md:col-span-1 overflow-y-auto border-r border-border">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Safe Spaces Near You</h2>
          
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="shelter">Shelter</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="police">Police</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-3">
            {filteredSpaces.map(space => (
              <Card 
                key={space.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedSpace === space.id ? 'ring-2 ring-sgc-purple' : ''}`}
                onClick={() => setSelectedSpace(space.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center mr-3 flex-shrink-0">
                      {getIconForType(space.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sgc-neutral-dark">{space.name}</h3>
                      <p className="text-sm text-sgc-neutral">{space.address}</p>
                      <div className="flex items-center mt-1 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${space.openNow ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {space.openNow ? 'Open Now' : space.openingTime}
                        </span>
                        <span className="ml-2 text-sgc-neutral">{space.distance} miles away</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Map placeholder and selected location details */}
      <div className="md:col-span-2 relative overflow-y-auto">
        {/* Map placeholder */}
        <div className="h-full bg-sgc-purple-light p-4 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="animate-pulse-soft mb-4">
              <MapPin size={60} className="text-sgc-purple mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-sgc-neutral-dark mb-2">Interactive Map</h3>
            <p className="text-sgc-neutral mb-4">
              This will display an interactive map with verified safe spaces in your area. Select a location from the list to see details.
            </p>
            <p className="text-xs text-sgc-neutral mb-8">
              In the full version, this will use real geolocation data and community-verified safe spaces.
            </p>
          </div>
        </div>
        
        {/* Selected location details overlay */}
        {selectedSpace && (
          <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl p-4 border-t border-border">
            {safeSpaces.filter(space => space.id === selectedSpace).map(space => (
              <div key={space.id}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-sgc-purple-light flex items-center justify-center mr-3">
                      {getIconForType(space.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{space.name}</h3>
                      <p className="text-sgc-neutral">{space.address}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSpace(null)}>
                    Close
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <h4 className="font-medium mb-2">Services</h4>
                    <ul className="space-y-1">
                      {space.services.map((service, idx) => (
                        <li key={idx} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-sgc-purple rounded-full mr-2"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact</h4>
                    <p className="text-sm flex items-center">
                      <Phone size={16} className="mr-2 text-sgc-purple" />
                      {space.phone}
                    </p>
                    <p className="text-sm mt-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${space.openNow ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {space.openNow ? 'Open Now' : space.openingTime}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button className="sgc-button-primary flex-1">Get Directions</Button>
                  <Button className="sgc-button-secondary flex-1">Call Now</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeMap;
