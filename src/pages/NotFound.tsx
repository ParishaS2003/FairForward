import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600">
            For your safety, please ensure you're accessing valid pages within our platform.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => window.location.href = '/'}
          >
            <Home className="w-4 h-4 mr-2" />
          Return to Home
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or use the emergency button if you need immediate assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
