import { Link } from 'react-router-dom';
import { Droplet, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <Droplet className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">BloodConnect</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              A platform connecting blood donors with those in need. Every donation
              saves lives.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-blood" className="hover:text-red-400 transition-colors">Find Blood</Link></li>
              <li><Link to="/register-donor" className="hover:text-red-400 transition-colors">Register as Donor</Link></li>
              <li><Link to="/create-request" className="hover:text-red-400 transition-colors">Create Blood Request</Link></li>
              <li><Link to="/blood-requests" className="hover:text-red-400 transition-colors">Blood Requests</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-red-400 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-red-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-red-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-red-400" />
                <span>support@bloodconnect.org</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-red-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BloodConnect. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> for a good cause
          </p>
        </div>
      </div>
    </footer>
  );
}
