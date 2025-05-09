import React, { useState } from 'react';
import { FaExclamationTriangle, FaPhone, FaShieldAlt, FaUserShield, FaBalanceScale, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmergencyButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('domestic-violence');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);

  // Enhanced emergency resource categories with more detailed information
  const categories = {
    'domestic-violence': {
      title: 'Domestic Violence',
      icon: <FaShieldAlt />,
      resources: [
        {
          name: 'National Domestic Violence Hotline',
          description: '24/7 support for domestic violence victims',
          phone: '1-800-799-7233',
          type: 'hotline',
          available24_7: true,
          services: ['Crisis counseling', 'Safety planning', 'Legal referrals'],
        },
        {
          name: 'Local Women\'s Shelter',
          description: 'Safe housing and support services',
          phone: '1-800-555-1234',
          type: 'shelter',
          available24_7: true,
          services: ['Emergency shelter', 'Counseling', 'Support groups'],
        },
        {
          name: 'Legal Aid for Domestic Violence',
          description: 'Free legal assistance for protection orders',
          phone: '1-800-555-5678',
          type: 'legal',
          available24_7: false,
          services: ['Protection orders', 'Legal representation', 'Court advocacy'],
        },
      ],
    },
    'sexual-assault': {
      title: 'Sexual Assault',
      icon: <FaUserShield />,
      resources: [
        {
          name: 'RAINN National Sexual Assault Hotline',
          description: '24/7 support for sexual assault survivors',
          phone: '1-800-656-4673',
          type: 'hotline',
          available24_7: true,
          services: ['Crisis support', 'Medical advocacy', 'Legal information'],
        },
        {
          name: 'Local Rape Crisis Center',
          description: 'Medical and emotional support services',
          phone: '1-800-555-9012',
          type: 'crisis-center',
          available24_7: true,
          services: ['Medical accompaniment', 'Counseling', 'Support groups'],
        },
        {
          name: 'Sexual Assault Legal Services',
          description: 'Legal representation and advocacy',
          phone: '1-800-555-3456',
          type: 'legal',
          available24_7: false,
          services: ['Legal representation', 'Court accompaniment', 'Victim advocacy'],
        },
      ],
    },
    'legal-threats': {
      title: 'Legal Threats',
      icon: <FaBalanceScale />,
      resources: [
        {
          name: 'Legal Aid Society',
          description: 'Free legal assistance for those in need',
          phone: '1-800-555-1234',
          type: 'legal',
          available24_7: false,
          services: ['Legal consultation', 'Document preparation', 'Court representation'],
        },
        {
          name: 'Human Rights Organization',
          description: 'Advocacy and legal support',
          phone: '1-800-555-7890',
          type: 'advocacy',
          available24_7: false,
          services: ['Rights advocacy', 'Policy support', 'Community education'],
        },
        {
          name: 'Emergency Legal Hotline',
          description: '24/7 legal emergency support',
          phone: '1-800-555-2345',
          type: 'hotline',
          available24_7: true,
          services: ['Emergency legal advice', 'Crisis intervention', 'Resource referral'],
        },
      ],
    },
  };

  // Safety tips for different situations
  const safetyTips = {
    'domestic-violence': [
      'Keep your phone charged and accessible',
      'Memorize emergency numbers',
      'Have a safe place to go',
      'Keep important documents ready',
      'Trust your instincts',
    ],
    'sexual-assault': [
      'You are not alone',
      'It\'s not your fault',
      'Seek medical attention if needed',
      'Consider reporting to authorities',
      'Get support from professionals',
    ],
    'legal-threats': [
      'Document everything',
      'Keep records of communications',
      'Know your rights',
      'Seek legal counsel',
      'Stay informed about your case',
    ],
  };

  const handleEmergencyCall = (phoneNumber) => {
    setShowConfirmation(true);
  };

  const sendSOSMessage = () => {
    const message = `I need emergency assistance. Please contact me immediately.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const handleBackToDashboard = () => {
    setShowModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg flex items-center space-x-2 animate-pulse"
      >
        <FaExclamationTriangle className="text-xl" />
        <span>Emergency</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 pb-4 border-b bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Emergency Resources</h2>
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaArrowLeft />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setShowSafetyTips(true)}
                    className="bg-purple-100 text-purple-700 p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-purple-200"
                  >
                    <FaShieldAlt className="text-xl" />
                    <span>Safety Tips</span>
                  </button>
                  <button
                    onClick={() => window.location.href = 'tel:911'}
                    className="bg-red-100 text-red-700 p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-red-200"
                  >
                    <FaPhone className="text-xl" />
                    <span>Call 911</span>
                  </button>
                  <button
                    onClick={sendSOSMessage}
                    className="bg-green-100 text-green-700 p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-green-200"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Send SOS</span>
                  </button>
                </div>

                <div className="mb-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories[selectedCategory].resources.map((resource, index) => (
                    <div key={index} className="border rounded p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{resource.name}</h3>
                        {resource.available24_7 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            24/7 Available
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                      <div className="mt-2">
                        <div className="mt-2">
                          <p className="text-sm font-medium">Services:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {resource.services.map((service, i) => (
                              <li key={i}>{service}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 space-x-2">
                        <button
                          onClick={() => handleEmergencyCall(resource.phone)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaPhone size={12} />
                          Call Now
                        </button>
                        <button
                          onClick={sendSOSMessage}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaWhatsapp size={12} />
                          Send SOS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Safety Tips Section */}
                {showSafetyTips && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-bold mb-3">Safety Tips</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {safetyTips[selectedCategory].map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 pt-4 border-t bg-white">
              <div className="flex gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  Back to Dashboard
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Emergency Call</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to make an emergency call? This will connect you directly to the emergency service.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  // Add actual call functionality here
                }}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton; 