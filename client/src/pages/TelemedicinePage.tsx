import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Interface for Room details
interface RoomDetails {
  roomName: string;
  roomUrl: string;
  expiresAt: string;
  privacy: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
}

const TelemedicinePage = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [videoServiceAvailable, setVideoServiceAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Available doctors
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrician',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.0
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      rating: 5.0
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Psychiatrist',
      avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
      rating: 4.7
    }
  ];

  // Check if the video service is available
  useEffect(() => {
    const checkVideoService = async () => {
      try {
        const response = await fetch('/api/video/status');
        const data = await response.json();
        
        setVideoServiceAvailable(data.videoServiceAvailable);
        
        if (!data.videoServiceAvailable) {
          console.log('Video service not available:', data.message);
        }
      } catch (error) {
        console.error('Error checking video service:', error);
        setVideoServiceAvailable(false);
      }
    };
    
    checkVideoService();
  }, []);

  const handleStartSession = async (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsLoading(true);
    setError(null);
    
    if (!videoServiceAvailable) {
      // Fallback to the open Google Meet in a new tab if Daily.co is not available
      window.open("https://meet.google.com", "_blank");
      setIsLoading(false);
      return;
    }
    
    try {
      // Create a new video room
      const appointmentId = `app-${Date.now()}`;
      const response = await fetch('/api/video/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          expiryMinutes: 60, // 1 hour expiry
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.room) {
        setRoomDetails(data.room);
        setIsVideoDialogOpen(true);
      } else {
        setError(data.message || 'Failed to create video room');
        toast({
          title: "Error",
          description: "Could not create video room. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating video room:', error);
      setError('Failed to connect. Please try again later.');
      toast({
        title: "Connection Error",
        description: "Could not connect to the video service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <span className="text-primary flex items-center cursor-pointer mb-4">
            <span className="material-icons mr-1">arrow_back</span>
            Back to Dashboard
          </span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Telemedicine Services</h1>
        <p className="text-neutral-500">Connect with healthcare professionals virtually</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 border rounded-lg flex items-start">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full mr-4" 
                />
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-neutral-500">{doctor.specialty}</p>
                  <div className="flex items-center mt-1 text-yellow-500">
                    <span className="material-icons text-sm">star</span>
                    <span className="material-icons text-sm">star</span>
                    <span className="material-icons text-sm">star</span>
                    <span className="material-icons text-sm">star</span>
                    {doctor.rating === 5 ? (
                      <span className="material-icons text-sm">star</span>
                    ) : doctor.rating >= 4.5 ? (
                      <span className="material-icons text-sm">star_half</span>
                    ) : (
                      <span className="material-icons text-sm">star_outline</span>
                    )}
                    <span className="text-neutral-700 text-xs ml-1">({doctor.rating})</span>
                  </div>
                  <Button 
                    onClick={() => handleStartSession(doctor)}
                    className="mt-2 bg-primary text-white px-3 py-1 text-sm rounded-full"
                    disabled={isLoading && currentDoctor?.id === doctor.id}
                  >
                    {isLoading && currentDoctor?.id === doctor.id ? (
                      "Connecting..."
                    ) : (
                      <><span className="material-icons text-sm mr-1">video_call</span>
                      Connect Now</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-3">event</span>
                <div>
                  <h3 className="font-medium">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-neutral-500">Tomorrow, 10:00 AM - General Check-up</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleStartSession(doctors[0])}
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : (
                    <><span className="material-icons text-sm mr-1">video_call</span>
                    Join</>
                  )}
                </Button>
                <Button variant="outline" className="border-neutral-200 text-neutral-700">
                  <span className="material-icons text-sm mr-1">schedule</span>
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <span className="material-icons text-primary mr-3">personal_injury</span>
                <div>
                  <h3 className="font-medium">General Consultation</h3>
                  <p className="text-sm text-neutral-500">For non-urgent medical advice</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <span className="material-icons text-primary mr-3">medication</span>
                <div>
                  <h3 className="font-medium">Prescription Renewal</h3>
                  <p className="text-sm text-neutral-500">For existing medications</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <span className="material-icons text-primary mr-3">sentiment_very_dissatisfied</span>
                <div>
                  <h3 className="font-medium">Mental Health</h3>
                  <p className="text-sm text-neutral-500">Therapy and counseling</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <span className="material-icons text-primary mr-3">child_care</span>
                <div>
                  <h3 className="font-medium">Pediatric Care</h3>
                  <p className="text-sm text-neutral-500">For children under 18</p>
                </div>
              </div>
              
              <Button className="w-full bg-primary text-white">
                <span className="material-icons text-sm mr-2">calendar_today</span>
                Schedule Appointment
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-medium">Select a specialist</h3>
                  <p className="text-sm text-neutral-500">Choose from our network of qualified healthcare providers</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-medium">Book appointment</h3>
                  <p className="text-sm text-neutral-500">Select a convenient time for your virtual visit</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-medium">Attend your visit</h3>
                  <p className="text-sm text-neutral-500">Connect via secure video call at your scheduled time</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">4</div>
                <div>
                  <h3 className="font-medium">Get care</h3>
                  <p className="text-sm text-neutral-500">Receive diagnosis, treatment plan, and prescriptions as needed</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Video Call Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>
              {currentDoctor && `Video Call with ${currentDoctor.name}`}
            </DialogTitle>
          </DialogHeader>
          
          {roomDetails && (
            <div className="relative h-full">
              <iframe
                ref={iframeRef}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                className="w-full h-[500px]"
                src={roomDetails.roomUrl}
                style={{ border: 0 }}
                title="Video Call"
              ></iframe>
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center">
              <div className="text-destructive mb-4">
                <span className="material-icons text-4xl">error_outline</span>
                <p className="mt-2">{error}</p>
              </div>
              <Button 
                onClick={() => setIsVideoDialogOpen(false)} 
                variant="outline"
              >
                Close
              </Button>
            </div>
          )}
          
          <DialogFooter className="p-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsVideoDialogOpen(false)}
            >
              End Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TelemedicinePage;