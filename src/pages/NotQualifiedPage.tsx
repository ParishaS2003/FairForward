import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Scale, Phone, MessageSquare, FileText } from 'lucide-react';

const NotQualifiedPage = () => {
  const navigate = useNavigate();

  const alternativeResources = [
    {
      title: "Legal Aid Organizations",
      description: "Many organizations offer sliding-scale fees based on your income.",
      icon: Scale,
      link: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
      linkText: "Find Legal Aid Organizations"
    },
    {
      title: "Free Legal Consultations",
      description: "Some law firms offer free initial consultations to discuss your case.",
      icon: MessageSquare,
      link: "https://www.americanbar.org/groups/legal_services/flh-home/",
      linkText: "Find Participating Law Firms"
    },
    {
      title: "Self-Help Resources",
      description: "Access guides, forms, and information to handle legal matters on your own.",
      icon: FileText,
      link: "https://www.lawhelp.org/",
      linkText: "Access Self-Help Resources"
    },
    {
      title: "Legal Hotlines",
      description: "Free legal advice hotlines for basic questions and guidance.",
      icon: Phone,
      link: "https://www.americanbar.org/groups/legal_services/flh-home/",
      linkText: "Find Legal Hotlines"
    }
  ];

  return (
    <div className="sgc-container py-16">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate('/pro-bono-qualification')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Qualification
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Alternative Legal Resources</h1>
          <p className="text-sgc-neutral max-w-2xl mx-auto">
            While you may not qualify for pro bono services at this time, there are many other resources 
            available to help with your legal needs. Here are some alternatives to explore:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {alternativeResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sgc-neutral-light">
                    <resource.icon className="h-6 w-6 text-sgc-purple" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">
                  {resource.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(resource.link, '_blank')}
                >
                  {resource.linkText}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-sgc-neutral-light/10">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
              <p className="text-sgc-neutral mb-4">
                Our LegalBot can help you understand your options and find the right resources for your situation.
              </p>
              <Button onClick={() => navigate('/chat')}>
                Chat with LegalBot
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotQualifiedPage; 