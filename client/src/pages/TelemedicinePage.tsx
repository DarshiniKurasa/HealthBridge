import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const TelemedicinePage = () => {
  const handleStartSession = () => {
    window.open("https://meet.google.com", "_blank");
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
            {/* Doctor Card 1 */}
            <div className="p-4 border rounded-lg flex items-start">
              <img 
                src="https://randomuser.me/api/portraits/women/45.jpg" 
                alt="Dr. Sarah Johnson"
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                <p className="text-sm text-neutral-500">General Physician</p>
                <div className="flex items-center mt-1 text-yellow-500">
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star_half</span>
                  <span className="text-neutral-700 text-xs ml-1">(4.5)</span>
                </div>
                <Button 
                  onClick={handleStartSession}
                  className="mt-2 bg-primary text-white px-3 py-1 text-sm rounded-full"
                >
                  <span className="material-icons text-sm mr-1">video_call</span>
                  Connect Now
                </Button>
              </div>
            </div>
            
            {/* Doctor Card 2 */}
            <div className="p-4 border rounded-lg flex items-start">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Dr. Michael Chen"
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold">Dr. Michael Chen</h3>
                <p className="text-sm text-neutral-500">Pediatrician</p>
                <div className="flex items-center mt-1 text-yellow-500">
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star_outline</span>
                  <span className="text-neutral-700 text-xs ml-1">(4.0)</span>
                </div>
                <Button 
                  onClick={handleStartSession}
                  className="mt-2 bg-primary text-white px-3 py-1 text-sm rounded-full"
                >
                  <span className="material-icons text-sm mr-1">video_call</span>
                  Connect Now
                </Button>
              </div>
            </div>
            
            {/* Doctor Card 3 */}
            <div className="p-4 border rounded-lg flex items-start">
              <img 
                src="https://randomuser.me/api/portraits/women/67.jpg" 
                alt="Dr. Emily Rodriguez"
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold">Dr. Emily Rodriguez</h3>
                <p className="text-sm text-neutral-500">Dermatologist</p>
                <div className="flex items-center mt-1 text-yellow-500">
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="text-neutral-700 text-xs ml-1">(5.0)</span>
                </div>
                <Button 
                  onClick={handleStartSession}
                  className="mt-2 bg-primary text-white px-3 py-1 text-sm rounded-full"
                >
                  <span className="material-icons text-sm mr-1">video_call</span>
                  Connect Now
                </Button>
              </div>
            </div>
            
            {/* Doctor Card 4 */}
            <div className="p-4 border rounded-lg flex items-start">
              <img 
                src="https://randomuser.me/api/portraits/men/79.jpg" 
                alt="Dr. James Wilson"
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold">Dr. James Wilson</h3>
                <p className="text-sm text-neutral-500">Psychiatrist</p>
                <div className="flex items-center mt-1 text-yellow-500">
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star</span>
                  <span className="material-icons text-sm">star_half</span>
                  <span className="text-neutral-700 text-xs ml-1">(4.7)</span>
                </div>
                <Button 
                  onClick={handleStartSession}
                  className="mt-2 bg-primary text-white px-3 py-1 text-sm rounded-full"
                >
                  <span className="material-icons text-sm mr-1">video_call</span>
                  Connect Now
                </Button>
              </div>
            </div>
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
                  onClick={handleStartSession}
                >
                  <span className="material-icons text-sm mr-1">video_call</span>
                  Join
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
    </div>
  );
};

export default TelemedicinePage;