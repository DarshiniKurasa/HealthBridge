import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="material-icons mr-2">favorite</span>
              HealthBridge
            </h3>
            <p className="text-neutral-300 text-sm mb-4">
              Bridging the gap to quality healthcare for underserved communities through technology and compassion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">instagram</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">youtube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/telemedicine"><span className="hover:text-white transition-colors cursor-pointer">Telemedicine</span></Link></li>
              <li><Link href="/symptom-checker"><span className="hover:text-white transition-colors cursor-pointer">AI Symptom Checker</span></Link></li>
              <li><Link href="/mental-health"><span className="hover:text-white transition-colors cursor-pointer">Mental Health Support</span></Link></li>
              <li><Link href="/reminders"><span className="hover:text-white transition-colors cursor-pointer">Medication Reminders</span></Link></li>
              <li><Link href="/locator"><span className="hover:text-white transition-colors cursor-pointer">Healthcare Locator</span></Link></li>
              <li><Link href="/emergency"><span className="hover:text-white transition-colors cursor-pointer">Emergency Services</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/blog"><span className="hover:text-white transition-colors cursor-pointer">Health Blog</span></Link></li>
              <li><Link href="/videos"><span className="hover:text-white transition-colors cursor-pointer">Educational Videos</span></Link></li>
              <li><Link href="/forum"><span className="hover:text-white transition-colors cursor-pointer">Community Forum</span></Link></li>
              <li><Link href="/volunteer"><span className="hover:text-white transition-colors cursor-pointer">Volunteer Opportunities</span></Link></li>
              <li><Link href="/api-docs"><span className="hover:text-white transition-colors cursor-pointer">API Documentation</span></Link></li>
              <li><Link href="/research"><span className="hover:text-white transition-colors cursor-pointer">Research & Publications</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start">
                <span className="material-icons text-primary mr-2">email</span>
                <span>support@healthbridge.org</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-primary mr-2">phone</span>
                <span>+1 (800) HEALTH-1</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-primary mr-2">location_on</span>
                <span>123 Healthcare Avenue, Wellness City, HC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} HealthBridge. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-neutral-400">
            <Link href="/privacy"><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link>
            <Link href="/terms"><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></Link>
            <Link href="/accessibility"><span className="hover:text-white transition-colors cursor-pointer">Accessibility</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
