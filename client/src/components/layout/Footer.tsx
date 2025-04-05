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
              <li><Link href="/telemedicine"><a className="hover:text-white transition-colors">Telemedicine</a></Link></li>
              <li><Link href="/symptom-checker"><a className="hover:text-white transition-colors">AI Symptom Checker</a></Link></li>
              <li><Link href="/mental-health"><a className="hover:text-white transition-colors">Mental Health Support</a></Link></li>
              <li><Link href="/reminders"><a className="hover:text-white transition-colors">Medication Reminders</a></Link></li>
              <li><Link href="/locator"><a className="hover:text-white transition-colors">Healthcare Locator</a></Link></li>
              <li><Link href="/emergency"><a className="hover:text-white transition-colors">Emergency Services</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/blog"><a className="hover:text-white transition-colors">Health Blog</a></Link></li>
              <li><Link href="/videos"><a className="hover:text-white transition-colors">Educational Videos</a></Link></li>
              <li><Link href="/forum"><a className="hover:text-white transition-colors">Community Forum</a></Link></li>
              <li><Link href="/volunteer"><a className="hover:text-white transition-colors">Volunteer Opportunities</a></Link></li>
              <li><Link href="/api-docs"><a className="hover:text-white transition-colors">API Documentation</a></Link></li>
              <li><Link href="/research"><a className="hover:text-white transition-colors">Research & Publications</a></Link></li>
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
            <Link href="/privacy"><a className="hover:text-white transition-colors">Privacy Policy</a></Link>
            <Link href="/terms"><a className="hover:text-white transition-colors">Terms of Service</a></Link>
            <Link href="/accessibility"><a className="hover:text-white transition-colors">Accessibility</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
