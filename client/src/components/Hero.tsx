import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Healthcare for All Communities</h1>
            <p className="text-lg mb-6 text-white/90">Access quality healthcare services no matter where you are. Physical and mental health support available 24/7.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button className="bg-white text-primary font-medium px-6 py-3 rounded-full hover:bg-neutral-100 transition-colors">
                Get Started
              </Button>
              <Button variant="outline" className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                Emergency Help
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
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

export default Hero;
