import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SOSCard = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOSClick = () => {
    setIsAlertOpen(true);
  };

  const handleEmergencyConfirm = () => {
    setIsAlertOpen(false);
    setIsEmergencyActive(true);
    
    // Start countdown
    let seconds = 5;
    setCountdown(seconds);
    
    const timer = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      
      if (seconds <= 0) {
        clearInterval(timer);
        // In a real implementation, this would trigger emergency services via Google Maps & Firebase Cloud Messaging
        setTimeout(() => {
          setIsEmergencyActive(false);
          alert("Emergency services have been notified of your location.");
        }, 1000);
      }
    }, 1000);
  };

  return (
    <>
      <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Emergency Assistance</h3>
              <p className="text-neutral-600 text-sm">Get immediate help in critical situations</p>
            </div>
            <span className="material-icons text-destructive">emergency</span>
          </div>
          <div className="flex justify-center mb-4">
            <button 
              className={`w-32 h-32 rounded-full ${isEmergencyActive 
                ? 'bg-destructive animate-pulse' 
                : 'bg-destructive hover:bg-destructive/90'} 
                text-white flex flex-col items-center justify-center`}
              onClick={handleSOSClick}
              disabled={isEmergencyActive}
            >
              {isEmergencyActive ? (
                <>
                  <span className="material-icons text-4xl">sos</span>
                  <span className="font-bold mt-2">SENDING</span>
                  <span className="text-2xl font-bold">{countdown}</span>
                </>
              ) : (
                <>
                  <span className="material-icons text-4xl">sos</span>
                  <span className="font-bold mt-2">SOS</span>
                </>
              )}
            </button>
          </div>
          <div className="text-center text-sm">
            <p className="text-neutral-600 mb-2">
              Press the SOS button in case of emergency to alert nearby healthcare providers
            </p>
            <p className="font-medium text-destructive">
              Emergency services will be notified of your location
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-neutral-100 text-neutral-800 rounded"
            >
              <span className="material-icons text-sm mr-1">contacts</span>
              Emergency Contacts
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-neutral-100 text-neutral-800 rounded"
            >
              <span className="material-icons text-sm mr-1">medical_services</span>
              First Aid Guide
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emergency Alert Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              This will alert emergency services and share your current location. Only proceed if you have a genuine emergency.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleEmergencyConfirm}
            >
              Confirm Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SOSCard;
