import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, BriefcaseIcon, PhoneCall, Mail, CheckCircle2, XCircle,
  Star, Globe, Clock, ArrowLeft, AlertCircle, FileText, DollarSign,
  Calendar, MessageSquare, Upload, Send, Paperclip, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

const LegalHelp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'questionnaire' | 'review' | 'connected'>('initial');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [documents, setDocuments] = useState<File[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{sender: 'user' | 'lawyer', message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const legalQuestions = [
    {
      id: 'issue_type',
      question: 'What type of legal issue are you facing?',
      options: [
        'Employment',
        'Housing',
        'Family',
        'Discrimination',
        'Immigration',
        'Criminal',
        'Civil Rights',
        'Other'
      ]
    },
    {
      id: 'urgency',
      question: 'How urgent is your situation?',
      options: [
        'Emergency - Need immediate assistance',
        'Very Urgent - Within 24 hours',
        'Somewhat Urgent - Within a week',
        'Not Urgent - Planning ahead'
      ]
    },
    {
      id: 'location',
      question: 'Where are you located?',
      type: 'text',
      placeholder: 'Enter your city and state'
    },
    {
      id: 'budget',
      question: 'What is your budget for legal services?',
      options: [
        {
          value: 'pro_bono',
          label: 'Pro Bono',
          description: 'Free legal services for qualifying cases'
        },
        {
          value: 'low_cost',
          label: 'Low Cost',
          description: 'Sliding scale or reduced fee options'
        },
        {
          value: 'standard',
          label: 'Standard Rate',
          description: 'Regular market rates for legal services'
        },
        {
          value: 'premium',
          label: 'Premium',
          description: 'Top-tier legal representation'
        }
      ]
    },
    {
      id: 'preferred_language',
      question: 'What is your preferred language for communication?',
      options: [
        'English',
        'Spanish',
        'French',
        'Mandarin',
        'Arabic',
        'Russian',
        'Other'
      ]
    },
    {
      id: 'case_details',
      question: 'Please provide details about your case',
      type: 'text',
      placeholder: 'Describe your situation in detail, including relevant dates, people involved, and any previous legal actions taken.'
    },
    {
      id: 'previous_legal_help',
      question: 'Have you sought legal help before?',
      options: [
        'No, this is my first time',
        'Yes, but not for this specific issue',
        'Yes, for this same issue',
        'Currently working with another lawyer'
      ]
    },
    {
      id: 'preferred_communication',
      question: 'How would you prefer to communicate with your lawyer?',
      options: [
        'Video Call',
        'Phone Call',
        'Email',
        'In-person Meeting',
        'Text Message'
      ]
    },
    {
      id: 'availability',
      question: 'When are you typically available for consultations?',
      options: [
        'Weekday Mornings',
        'Weekday Afternoons',
        'Weekday Evenings',
        'Weekend Mornings',
        'Weekend Afternoons',
        'Weekend Evenings'
      ]
    }
  ];

  const availableLawyers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: 'Employment Law',
      experience: '15 years',
      languages: ['English', 'Spanish'],
      rating: 4.9,
      availability: 'Available within 24 hours',
      image: 'https://placehold.co/100x100',
      hourlyRate: '$250',
      consultationFee: 'Free',
      casesWon: 150,
      barAssociations: ['ABA', 'State Bar']
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialization: 'Housing Law',
      experience: '12 years',
      languages: ['English', 'Mandarin'],
      rating: 4.8,
      availability: 'Available within 48 hours',
      image: 'https://placehold.co/100x100',
      hourlyRate: '$200',
      consultationFee: '$100',
      casesWon: 120,
      barAssociations: ['ABA', 'Local Bar']
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      specialization: 'Family Law',
      experience: '10 years',
      languages: ['English', 'Spanish', 'Portuguese'],
      rating: 4.7,
      availability: 'Available within 24 hours',
      image: 'https://placehold.co/100x100',
      hourlyRate: '$225',
      consultationFee: 'Free',
      casesWon: 95,
      barAssociations: ['ABA', 'Family Law Association']
    }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    // Update progress
    const answeredQuestions = Object.keys({...answers, [questionId]: answer}).length;
    setProgress((answeredQuestions / legalQuestions.length) * 100);
  };

  const handleSubmit = () => {
    setStep('review');
  };

  const handleConnectLawyer = (lawyer: any) => {
    setSelectedLawyer(lawyer);
    setStep('connected');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setDocuments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        sender: 'user',
        message: newMessage,
        timestamp: new Date()
      }]);
      setNewMessage('');
      
      // Simulate lawyer response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: 'lawyer',
          message: 'Thank you for your message. I will review your case and get back to you shortly.',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const handleScheduleConsultation = () => {
    if (selectedDate && selectedTime) {
      // Handle scheduling logic here
      alert(`Consultation scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <Navbar />
      
      <div className="sgc-container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Gavel className="text-sgc-purple" />
              Legal Help Center
            </CardTitle>
            <CardDescription>
              Get connected with experienced lawyers who can help with your legal needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'initial' && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">Need Legal Assistance?</h3>
                <p className="text-sgc-neutral mb-6">
                  Our legal help center connects you with qualified lawyers who specialize in various areas of law.
                  Complete a quick questionnaire to get matched with the right legal professional.
                </p>
                <Button 
                  onClick={() => setStep('questionnaire')}
                  className="bg-sgc-purple hover:bg-sgc-purple-dark text-white"
                >
                  Start Legal Help Process
                </Button>
              </div>
            )}

            {step === 'questionnaire' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Legal Help Questionnaire</h3>
                  <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
                </div>
                <Progress value={progress} className="mb-6" />
                
                {legalQuestions.map((q, index) => (
                  <div key={q.id} className="space-y-2">
                    <label className="font-medium">{q.question}</label>
                    {q.id === 'budget' ? (
                      <ScrollArea className="h-[200px] border rounded-md p-4">
                        <div className="space-y-2">
                          {q.options.map(option => (
                            <Card 
                              key={option.value}
                              className={`cursor-pointer transition-all duration-300 ${
                                answers[q.id] === option.value ? 'border-sgc-purple' : ''
                              }`}
                              onClick={() => handleAnswer(q.id, option.value)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">
                                    {answers[q.id] === option.value ? (
                                      <CheckCircle2 className="text-sgc-purple" />
                                    ) : (
                                      <XCircle className="text-sgc-neutral" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{option.label}</h4>
                                    <p className="text-sm text-sgc-neutral">{option.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : q.type === 'text' ? (
                      <Textarea
                        placeholder={q.placeholder}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map(option => (
                          <Button
                            key={option}
                            variant={answers[q.id] === option ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => handleAnswer(q.id, option)}
                          >
                            {answers[q.id] === option ? (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            ) : (
                              <XCircle className="mr-2 h-4 w-4" />
                            )}
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6">
                  <label className="font-medium">Upload Relevant Documents (Optional)</label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Button>
                  </div>
                  
                  {documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-sgc-neutral-light/20 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-sgc-purple hover:bg-sgc-purple-dark text-white"
                    disabled={Object.keys(answers).length !== legalQuestions.length}
                  >
                    Submit Questionnaire
                  </Button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Available Lawyers</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {availableLawyers.map(lawyer => (
                    <Card key={lawyer.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img 
                            src={lawyer.image} 
                            alt={lawyer.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                            <p className="text-sgc-neutral">{lawyer.specialization}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="text-yellow-400 fill-yellow-400" size={16} />
                              <span>{lawyer.rating}</span>
                            </div>
                            <div className="mt-4 space-y-2">
                              <p className="text-sm">
                                <BriefcaseIcon className="inline mr-2" size={14} />
                                {lawyer.experience} experience
                              </p>
                              <p className="text-sm">
                                <Globe className="inline mr-2" size={14} />
                                {lawyer.languages.join(', ')}
                              </p>
                              <p className="text-sm">
                                <Clock className="inline mr-2" size={14} />
                                {lawyer.availability}
                              </p>
                              <p className="text-sm">
                                <DollarSign className="inline mr-2" size={14} />
                                {lawyer.hourlyRate}/hour
                              </p>
                              <p className="text-sm">
                                <FileText className="inline mr-2" size={14} />
                                {lawyer.casesWon} cases won
                              </p>
                            </div>
                            <Button 
                              onClick={() => handleConnectLawyer(lawyer)}
                              className="w-full mt-4"
                            >
                              Connect with {lawyer.name.split(' ')[0]}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 'connected' && selectedLawyer && (
              <div className="space-y-6">
                <div className="mb-6">
                  <img 
                    src={selectedLawyer.image} 
                    alt={selectedLawyer.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Connected with {selectedLawyer.name}</h3>
                  <p className="text-sgc-neutral">{selectedLawyer.specialization}</p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <Button className="w-full gap-2">
                    <PhoneCall size={16} />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare size={16} />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar size={16} />
                    Book Consultation
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => setStep('initial')}
                  >
                    Start New Request
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2">
                      <MessageSquare size={16} />
                      Chat with Lawyer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl h-[600px]">
                    <DialogHeader>
                      <DialogTitle>Chat with {selectedLawyer.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col h-full">
                      <ScrollArea className="flex-1 p-4 space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.sender === 'user'
                                  ? 'bg-sgc-purple text-white'
                                  : 'bg-sgc-neutral-light/20'
                              }`}
                            >
                              <p>{msg.message}</p>
                              <span className="text-xs opacity-70">
                                {format(msg.timestamp, 'HH:mm')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar size={16} />
                      Schedule Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Consultation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                      <div className="grid grid-cols-4 gap-2">
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleScheduleConsultation}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Confirm Schedule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalHelp; 