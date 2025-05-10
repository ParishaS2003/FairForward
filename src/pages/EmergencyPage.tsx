import React from 'react';
import { Phone, Heart, Shield, AlertCircle, Headphones } from 'lucide-react';
import { Card } from '../components/ui/card';
import BackButton from '../components/BackButton';

const EmergencyPage = () => {
  const emergencyNumbers = [
    { name: '911', description: 'Emergency Services (Police, Fire, Ambulance)' },
    { name: '1-833-456-4566', description: 'Canada Suicide Prevention Service' },
    { name: '1-888-668-6868', description: 'Kids Help Phone' },
    { name: '1-866-925-4419', description: 'Indian Residential School Crisis Line' },
    { name: '1-800-668-6868', description: 'Crisis Services Canada' },
  ];

  const safetyTips = [
    'Stay on the line and remain calm when calling emergency services',
    'If possible, share your exact location with emergency responders',
    'Keep emergency contacts saved in your phone',
    'Have a personal safety plan and share it with trusted people',
    'Know the locations of nearby emergency services',
  ];

  const mentalHealthResources = [
    { name: 'Wellness Together Canada', link: 'https://wellnesstogether.ca' },
    { name: 'Canadian Mental Health Association', link: 'https://cmha.ca' },
    { name: 'Crisis Services Canada', link: 'https://crisisservicescanada.ca' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <BackButton to="/app" />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Emergency Resources</h1>
          <p className="text-gray-600">Get immediate help and support</p>
        </div>

        {/* Emergency Numbers Section */}
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Emergency Numbers</h2>
          </div>
          <div className="grid gap-4">
            {emergencyNumbers.map((number, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-xl font-bold text-red-600 mr-4">{number.name}</span>
                <span className="text-gray-700">{number.description}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Safety Tips Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Safety Tips</h2>
          </div>
          <ul className="grid gap-3">
            {safetyTips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Mental Health Resources */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Mental Health Resources</h2>
          </div>
          <div className="grid gap-4">
            {mentalHealthResources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-purple-100 transition-colors"
              >
                <Headphones className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-700">{resource.name}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyPage; 