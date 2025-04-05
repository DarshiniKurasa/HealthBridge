import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VolunteerActivism, MedicalServices } from "@/components/ui/icons";
import VolunteerForm from "../VolunteerForm";
import ProviderSignupForm from "../ProviderSignupForm";

const VolunteerSection = () => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);

  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-3">Join Our Healthcare Network</h2>
            <p className="mb-4">We're looking for healthcare professionals and volunteers to help expand access to quality healthcare in underserved communities.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-white text-primary font-medium px-6 py-3 rounded-full hover:bg-neutral-100 transition-colors"
                onClick={() => setShowVolunteerForm(true)}
              >
                <VolunteerActivism className="mr-2 h-5 w-5" />
                Volunteer
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setShowProviderForm(true)}
              >
                <MedicalServices className="mr-2 h-5 w-5" />
                Join as Provider
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Healthcare professionals" 
              className="rounded-lg shadow-lg max-w-full h-auto" 
              width="500" 
              height="350" 
            />
          </div>
        </div>
      </div>

      {/* Volunteer Form Dialog */}
      <Dialog open={showVolunteerForm} onOpenChange={setShowVolunteerForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Volunteer Application</DialogTitle>
            <DialogDescription>
              Join our team of dedicated volunteers helping underserved communities access quality healthcare.
            </DialogDescription>
          </DialogHeader>
          <VolunteerForm />
        </DialogContent>
      </Dialog>

      {/* Provider Form Dialog */}
      <Dialog open={showProviderForm} onOpenChange={setShowProviderForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Healthcare Provider Application</DialogTitle>
            <DialogDescription>
              Join our network and connect with patients who need your expertise in underserved communities.
            </DialogDescription>
          </DialogHeader>
          <ProviderSignupForm />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VolunteerSection;
