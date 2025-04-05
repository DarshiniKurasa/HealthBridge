import { Button } from "@/components/ui/button";

const VolunteerSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-3">Join Our Healthcare Network</h2>
            <p className="mb-4">We're looking for healthcare professionals and volunteers to help expand access to quality healthcare in underserved communities.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button className="bg-white text-primary font-medium px-6 py-3 rounded-full hover:bg-neutral-100 transition-colors">
                <span className="material-icons mr-2">volunteer_activism</span>
                Volunteer
              </Button>
              <Button variant="outline" className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                <span className="material-icons mr-2">medical_services</span>
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
    </section>
  );
};

export default VolunteerSection;
