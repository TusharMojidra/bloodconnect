import { Link } from 'react-router-dom';
import { Droplet, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Droplet className="w-8 h-8 text-white" fill="white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
