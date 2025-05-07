
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [reportType, setReportType] = useState('harassment');
  const [anonymous, setAnonymous] = useState(false);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleResetForm = () => {
    setStep(1);
    setSubmitted(false);
  };
  
  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Report Submitted</CardTitle>
            <CardDescription>Thank you for your report</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Your report has been submitted successfully. If you provided contact information, a support coordinator will reach out to you soon.</p>
            <p className="text-sm text-muted-foreground">Report ID: #SGC-{Math.floor(Math.random() * 10000)}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleResetForm}>Submit Another Report</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="sgc-container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="sgc-heading-2 mb-3">Report an Incident</h1>
        <p className="text-sgc-neutral max-w-2xl mx-auto">
          Your safety matters. Use this form to report harassment, discrimination, or other safety concerns.
          All reports are treated with confidentiality.
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= i 
                      ? 'border-sgc-purple bg-sgc-purple text-white' 
                      : 'border-sgc-neutral bg-white text-sgc-neutral'
                  }`}
                >
                  {i}
                </div>
                <span className="text-xs mt-1">
                  {i === 1 ? 'Type' : i === 2 ? 'Details' : 'Submit'}
                </span>
              </div>
              
              {i < 3 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    step > i ? 'bg-sgc-purple' : 'bg-sgc-neutral/30'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <Card className="mb-6">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>What type of incident are you reporting?</CardTitle>
              <CardDescription>
                Select the category that best describes your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={reportType} onValueChange={setReportType}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="harassment">Harassment</TabsTrigger>
                  <TabsTrigger value="discrimination">Discrimination</TabsTrigger>
                  <TabsTrigger value="violence">Violence</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="harassment" className="space-y-4">
                  <h3 className="font-medium text-lg">Harassment</h3>
                  <p className="text-sgc-neutral">
                    This includes verbal, physical, or online harassment in public spaces, workplace, or home.
                  </p>
                  
                  <RadioGroup defaultValue="verbal">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="verbal" id="verbal" />
                        <Label htmlFor="verbal">Verbal harassment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="physical" id="physical" />
                        <Label htmlFor="physical">Physical harassment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">Online harassment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stalking" id="stalking" />
                        <Label htmlFor="stalking">Stalking</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>
                
                <TabsContent value="discrimination" className="space-y-4">
                  <h3 className="font-medium text-lg">Discrimination</h3>
                  <p className="text-sgc-neutral">
                    Unfair treatment based on gender, race, religion, disability, or other protected characteristics.
                  </p>
                  
                  <RadioGroup defaultValue="workplace">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="workplace" id="workplace" />
                        <Label htmlFor="workplace">Workplace discrimination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="housing" id="housing" />
                        <Label htmlFor="housing">Housing discrimination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="service" id="service" />
                        <Label htmlFor="service">Service or business discrimination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="education" id="education" />
                        <Label htmlFor="education">Educational discrimination</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>
                
                <TabsContent value="violence" className="space-y-4">
                  <h3 className="font-medium text-lg">Violence</h3>
                  <p className="text-sgc-neutral">
                    Physical violence, threats, or domestic abuse. If you're in immediate danger, please call emergency services.
                  </p>
                  
                  <RadioGroup defaultValue="physical_assault">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="physical_assault" id="physical_assault" />
                        <Label htmlFor="physical_assault">Physical assault</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="domestic" id="domestic" />
                        <Label htmlFor="domestic">Domestic abuse</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="threats" id="threats" />
                        <Label htmlFor="threats">Threats of violence</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>
                
                <TabsContent value="other" className="space-y-4">
                  <h3 className="font-medium text-lg">Other Issue</h3>
                  <p className="text-sgc-neutral">
                    If your issue doesn't fit the categories above, please describe it below.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="other_issue">Describe the issue</Label>
                    <Textarea id="other_issue" placeholder="Please describe the issue you're experiencing..." />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        )}
        
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Please provide as much detail as you feel comfortable sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Switch id="anonymous" checked={anonymous} onCheckedChange={setAnonymous} />
                <Label htmlFor="anonymous">Submit report anonymously</Label>
              </div>
            
              {!anonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred_contact">Preferred Contact Method</Label>
                    <select 
                      id="preferred_contact" 
                      className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-sgc-purple"
                      defaultValue="email"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="no_contact">Do not contact me</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="location">Where did this happen?</Label>
                <Input id="location" placeholder="Address or description of location" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">When did this happen?</Label>
                <Input id="date" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description of the incident</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe what happened in as much detail as you're comfortable sharing..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>What would you like to happen next?</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="connect_legal" />
                    <label htmlFor="connect_legal" className="text-sm">Connect me with legal resources</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="connect_support" />
                    <label htmlFor="connect_support" className="text-sm">Connect me with support services</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="report_authorities" />
                    <label htmlFor="report_authorities" className="text-sm">Report to authorities</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="just_record" />
                    <label htmlFor="just_record" className="text-sm">Just record this incident (no action needed)</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
        
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription>
                Please review your report before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Report Type</h3>
                <p>{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Submission Type</h3>
                <p>{anonymous ? 'Anonymous' : 'With Contact Information'}</p>
              </div>
              
              <div className="p-4 bg-sgc-purple-light rounded-md">
                <p className="text-sm text-sgc-neutral-dark">
                  By submitting this report, you acknowledge that the information provided is accurate to the best of your knowledge. 
                  {anonymous 
                    ? ' Your report will be anonymous and no personally identifying information will be collected.'
                    : ' Your contact information will only be used to follow up on this report.'
                  }
                </p>
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <div></div>
          )}
          
          <Button className="sgc-button-primary" onClick={handleNext}>
            {step < 3 ? 'Continue' : 'Submit Report'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-sgc-purple-light rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium text-sgc-neutral-dark mb-2">Need Immediate Help?</h3>
        <p className="text-sgc-neutral mb-4">
          If you're in immediate danger, please contact emergency services or reach out to one of our partner helplines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white">
            Emergency Services
          </Button>
          <Button variant="outline" className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white">
            Crisis Helpline
          </Button>
          <Button variant="outline" className="border-sgc-purple text-sgc-purple hover:bg-sgc-purple hover:text-white">
            Find Safe Spaces
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
