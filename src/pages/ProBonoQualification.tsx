import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProBonoQualification = () => {
  const navigate = useNavigate();
  const [householdSize, setHouseholdSize] = useState<'1-3'|'4+'|null>(null);
  const [income, setIncome] = useState<'less'|'more'|null>(null);
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!householdSize || !income) {
      setShowError(true);
      return;
    }

    if (income === 'more') {
      // Not qualified - redirect to not qualified page
      navigate('/not-qualified');
    } else {
      // Qualified - redirect to pro bono directory
      navigate('/pro-bono-directory');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sgc-neutral-light/30 to-white">
      <div className="sgc-container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-sgc-purple">Pro Bono Legal Support</h1>
            <p className="text-sgc-neutral">
              To ensure our pro bono services reach those most in need, please answer a few questions about your household.
            </p>
          </div>

          <Card className="mb-6 border-sgc-purple/20">
            <CardHeader className="bg-gradient-to-r from-sgc-purple/5 to-transparent">
              <CardTitle className="text-sgc-purple">Qualification Check</CardTitle>
              <CardDescription>
                Pro bono legal services are available to households meeting specific income criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sgc-purple">How many members are in your household?</Label>
                <RadioGroup
                  value={householdSize || ''}
                  onValueChange={(value) => {
                    setHouseholdSize(value as '1-3'|'4+');
                    setShowError(false);
                  }}
                  className="text-sgc-purple"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-3" id="1-3" className="border-sgc-purple/50 data-[state=checked]:bg-sgc-purple data-[state=checked]:text-white" />
                    <Label htmlFor="1-3">1-3 members</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4+" id="4+" className="border-sgc-purple/50 data-[state=checked]:bg-sgc-purple data-[state=checked]:text-white" />
                    <Label htmlFor="4+">4 or more members</Label>
                  </div>
                </RadioGroup>
              </div>

              {householdSize && (
                <div className="space-y-4">
                  <Label className="text-sgc-purple">
                    Is your annual household income less than {householdSize === '1-3' ? '$60,000' : '$84,000'}?
                  </Label>
                  <RadioGroup
                    value={income || ''}
                    onValueChange={(value) => {
                      setIncome(value as 'less'|'more');
                      setShowError(false);
                    }}
                    className="text-sgc-purple"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="less" id="less" className="border-sgc-purple/50 data-[state=checked]:bg-sgc-purple data-[state=checked]:text-white" />
                      <Label htmlFor="less">Yes, less than this amount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="more" id="more" className="border-sgc-purple/50 data-[state=checked]:bg-sgc-purple data-[state=checked]:text-white" />
                      <Label htmlFor="more">No, more than this amount</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {showError && (
                <Alert variant="destructive" className="border-sgc-purple/20 bg-sgc-purple/10 text-sgc-purple">
                  <AlertCircle className="h-4 w-4 text-sgc-purple" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Please answer all questions to proceed.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full bg-sgc-purple hover:bg-sgc-purple-dark text-white"
                onClick={handleSubmit}
              >
                Check Qualification
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-sgc-neutral">
            <p>Your information is kept confidential and used only for qualification purposes.</p>
            <p className="mt-2">
              If you don't qualify for pro bono services, we'll direct you to other helpful legal resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProBonoQualification; 