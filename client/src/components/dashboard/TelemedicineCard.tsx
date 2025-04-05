import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TelemedicineCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = () => {
    setIsLoading(true);
    // In a real implementation, this would start a Google Meet session
    setTimeout(() => {
      // Simulate API call
      setIsLoading(false);
      window.open("https://meet.google.com", "_blank");
    }, 1500);
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Telemedicine</h3>
            <p className="text-neutral-600 text-sm">Virtual consultations with healthcare professionals</p>
          </div>
          <span className="material-icons text-primary">video_call</span>
        </div>
        <div className="mb-4">
          <div className="rounded-lg overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Doctor consultation"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="font-medium">Connect with a doctor</p>
                <p className="text-sm opacity-90">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <img
              src="https://randomuser.me/api/portraits/women/45.jpg"
              alt="Doctor"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Doctor"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/women/67.jpg"
              alt="Doctor"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium">
              +24
            </div>
          </div>
          <Button
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            onClick={handleStartSession}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                Connecting...
              </>
            ) : (
              "Start Session"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TelemedicineCard;
