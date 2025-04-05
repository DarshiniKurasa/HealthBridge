import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, MapPin, Navigation, Phone, Clock, Building } from "lucide-react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FacilityProps {
  name: string;
  address: string;
  distance: string;
  type: string;
  phone: string;
  hours: string;
  rating: number;
}

const HealthcareLocatorPage = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [facilities, setFacilities] = useState<FacilityProps[]>([]);
  const [activeTab, setActiveTab] = useState("hospitals");
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const goBack = () => navigate('/');

  useEffect(() => {
    // Try to get user's location on component mount
    handleUseMyLocation();
    // Initialize map when the component mounts
    initMap();
  }, []);

  const initMap = () => {
    // In a production environment, this would initialize a map library like Leaflet or Google Maps
    console.log('Map initialized');
  };

  const handleUseMyLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          
          // Now get the user's address from coordinates using OpenCage
          try {
            const response = await fetch(`/api/geocode/reverse?lat=${coords.lat}&lng=${coords.lng}`);
            const data = await response.json();
            
            if (data.formatted) {
              const address = data.formatted;
              setSearchQuery(address);
              // Now search for healthcare facilities near this location
              searchFacilities(coords);
            }
          } catch (error) {
            console.error("Error with geocoding:", error);
            toast({
              title: "Location Error",
              description: "Could not determine your address. Please enter it manually.",
              variant: "destructive"
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or enter your address manually.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser. Please enter your address manually.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Convert address to coordinates using OpenCage
      const response = await fetch(`/api/geocode/forward?address=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.geometry) {
        const coords = {
          lat: data.geometry.lat,
          lng: data.geometry.lng
        };
        setUserLocation(coords);
        // Search for healthcare facilities near this location
        searchFacilities(coords);
      } else {
        toast({
          title: "Address Not Found",
          description: "Could not find coordinates for this address. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error with geocoding search:", error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const searchFacilities = async (coords: { lat: number, lng: number }) => {
    setIsLoading(true);
    try {
      // Make API call to get facilities based on location and type
      let facilityType = 'hospital';
      if (activeTab === 'clinics') facilityType = 'clinic';
      if (activeTab === 'pharmacies') facilityType = 'pharmacy';
      
      const response = await fetch(`/api/healthcare/facilities?lat=${coords.lat}&lng=${coords.lng}&type=${facilityType}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setFacilities(data);
        toast({
          title: "Facilities Found",
          description: `Found ${data.length} healthcare facilities near you.`,
        });
      } else {
        // If no facilities found or API error, show a message
        setFacilities([]);
        toast({
          title: "No Facilities Found",
          description: "We couldn't find any healthcare facilities matching your criteria. Try expanding your search.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching healthcare facilities:", error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching for facilities. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to empty list
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (userLocation) {
      searchFacilities(userLocation);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4" 
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Healthcare Facilities Locator</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter your address, city, or zip code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="bg-primary"
            >
              {isLoading ? "Searching..." : <><Search className="h-4 w-4 mr-2" /> Search</>}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleUseMyLocation}
              disabled={isLoading}
            >
              <MapPin className="h-4 w-4 mr-2" /> Use My Location
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="hospitals" onValueChange={handleTabChange}>
                <TabsList className="w-full">
                  <TabsTrigger value="hospitals" className="flex-1">Hospitals</TabsTrigger>
                  <TabsTrigger value="clinics" className="flex-1">Clinics</TabsTrigger>
                  <TabsTrigger value="pharmacies" className="flex-1">Pharmacies</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-4">
                  {facilities.map((facility, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{facility.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {facility.type}
                              <span className="mx-2">•</span>
                              <Navigation className="h-3 w-3 mr-1" />
                              {facility.distance}
                            </p>
                          </div>
                          <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                            {facility.rating} ★
                          </div>
                        </div>
                        <p className="text-sm mt-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {facility.address}
                        </p>
                        <p className="text-sm mt-1 flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {facility.phone}
                        </p>
                        <p className="text-sm mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {facility.hours}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" className="text-xs bg-primary">
                            Get Directions
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {facilities.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Search for healthcare facilities or use your location to see results here.</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div ref={mapRef} className="bg-gray-200 h-[500px] w-full flex items-center justify-center relative">
                {userLocation ? (
                  <div className="text-center">
                    <p>Map view showing healthcare facilities near your location</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md">
                      <p className="text-xs font-medium">Showing {facilities.length} results</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 bg-primary rounded-full animate-ping"></div>
                      <div className="h-6 w-6 bg-primary rounded-full absolute"></div>
                    </div>
                    {facilities.map((facility, index) => (
                      <div 
                        key={index} 
                        className="absolute bg-white rounded-full w-5 h-5 shadow-md flex items-center justify-center"
                        style={{ 
                          left: `${30 + Math.random() * 40}%`, 
                          top: `${30 + Math.random() * 40}%` 
                        }}
                      >
                        <span className="text-xs">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Use the search or location button to find healthcare facilities near you</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthcareLocatorPage;