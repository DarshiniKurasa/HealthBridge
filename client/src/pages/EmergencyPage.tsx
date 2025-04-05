import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const EmergencyPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Try to get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter your address manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser. Please enter your address manually.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEmergencyRequest = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call an API endpoint to send emergency alerts
      // to nearby healthcare providers or emergency services
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      toast({
        title: "Emergency Alert Sent",
        description: "Help is on the way. Please stay where you are if possible.",
      });

      // Then redirect to a page with emergency instructions or status updates
    } catch (error) {
      toast({
        title: "Error Sending Alert",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-destructive">Emergency Assistance</h1>
        <p className="text-lg text-muted-foreground mt-2">
          For immediate medical emergencies, please call 911 directly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Request Emergency Help</CardTitle>
            <CardDescription>
              Send an alert to nearby healthcare providers and emergency services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="text-sm">
                <p><span className="font-medium">Name:</span> {user.fullName || user.username}</p>
                {user.email && <p><span className="font-medium">Contact:</span> {user.email}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Not signed in. Some information may need to be provided manually.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Your Location</Label>
              {location ? (
                <div className="text-sm bg-primary/10 p-3 rounded-md">
                  <p className="font-medium">Location detected:</p>
                  <p>Latitude: {location.lat.toFixed(6)}</p>
                  <p>Longitude: {location.lng.toFixed(6)}</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    id="address"
                    placeholder="Enter your street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-type">Emergency Type</Label>
              <select
                id="emergency-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select emergency type</option>
                <option value="medical">Medical Emergency</option>
                <option value="injury">Injury</option>
                <option value="mental-health">Mental Health Crisis</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                placeholder="Describe your emergency situation"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleEmergencyRequest}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 size-4 border-2 border-background border-r-transparent rounded-full"></span>
                  Sending alert...
                </span>
              ) : "Send Emergency Alert"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Phone Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Emergency Services</p>
                  <p className="text-sm text-muted-foreground">Police, Fire, Ambulance</p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = "tel:911"}>
                  <span className="material-icons mr-1">call</span> 911
                </Button>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Poison Control</p>
                  <p className="text-sm text-muted-foreground">For poisoning emergencies</p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = "tel:18002221222"}>
                  <span className="material-icons mr-1">call</span> 1-800-222-1222
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Mental Health Crisis Line</p>
                  <p className="text-sm text-muted-foreground">24/7 Support</p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = "tel:988"}>
                  <span className="material-icons mr-1">call</span> 988
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="font-medium mb-1">Stay Calm</p>
                <p>Take deep breaths and try to remain calm. This helps you communicate clearly.</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="font-medium mb-1">Clear Information</p>
                <p>Be ready to share your location, the nature of the emergency, and any medical conditions.</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="font-medium mb-1">Follow Instructions</p>
                <p>Listen carefully to emergency responders and follow their guidance.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;