import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HealthcareLocatorCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeFilter, setActiveFilter] = useState<'hospitals' | 'pharmacies' | null>(null);

  const handleSearch = () => {
    setIsLoading(true);
    // In a real implementation, this would query Google Maps API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Initialize the map when the component mounts
    // In a real implementation, this would use the Google Maps JavaScript API
  }, []);

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Healthcare Locator</h3>
            <p className="text-neutral-600 text-sm">Find nearby clinics, hospitals and pharmacies</p>
          </div>
          <span className="material-icons text-orange-500">map</span>
        </div>
        <div className="rounded-lg overflow-hidden h-48 bg-neutral-200 mb-4 relative">
          {/* Map placeholder - in production, this would use Google Maps API */}
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <p className="text-neutral-500">Map showing nearby healthcare facilities</p>
          </div>
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white rounded-lg shadow-md flex overflow-hidden">
              <Input
                type="text"
                placeholder="Search for healthcare facilities..."
                className="flex-1 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                className="bg-orange-500 text-white rounded-none" 
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="material-icons animate-spin text-sm">refresh</span>
                ) : (
                  <span className="material-icons text-sm">search</span>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant={activeFilter === 'hospitals' ? 'default' : 'secondary'} 
              className={`px-3 py-1 rounded text-sm flex items-center ${
                activeFilter === 'hospitals' ? 'bg-primary' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
              onClick={() => setActiveFilter(activeFilter === 'hospitals' ? null : 'hospitals')}
            >
              <span className="material-icons text-sm mr-1">local_hospital</span>
              Hospitals
            </Button>
            <Button 
              variant={activeFilter === 'pharmacies' ? 'default' : 'secondary'} 
              className={`px-3 py-1 rounded text-sm flex items-center ${
                activeFilter === 'pharmacies' ? 'bg-primary' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
              onClick={() => setActiveFilter(activeFilter === 'pharmacies' ? null : 'pharmacies')}
            >
              <span className="material-icons text-sm mr-1">local_pharmacy</span>
              Pharmacies
            </Button>
          </div>
          <Button 
            variant="link" 
            className="text-primary flex items-center text-sm font-medium p-0"
            onClick={handleUseMyLocation}
          >
            <span className="material-icons text-sm mr-1">my_location</span>
            Use my location
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HealthcareLocatorCard;
