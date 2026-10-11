import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Droplet,
  Search,
  UserPlus,
  FilePlus,
  Heart,
  Users,
  Building2,
  Activity,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({ donors: 0, requests: 0, cities: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [donors, requestsResult] = await Promise.all([
          api.donors.list({ available: true }),
          api.bloodRequests.list(),
        ]);
        const uniqueCities = new Set(donors.map((d) => d.city)).size;
        setStats({
          donors: donors.length,
          requests: requestsResult.length,
          cities: uniqueCities,
        });
      } catch {
        // keep zeros if API unreachable
      }
      setLoading(false);
    })();
  }, []);

  const features = [
    {
      icon: Search,
      title: 'Find Blood',
      description: 'Search for available blood donors by blood group and city in real-time.',
      link: '/find-blood',
      color: 'bg-red-50 text-red-600',
    },
    {
      icon: UserPlus,
      title: 'Register as Donor',
      description: 'Become a lifesaver. Register yourself as a blood donor and help those in need.',
      link: '/register-donor',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: FilePlus,
      title: 'Create Blood Request',
      description: 'Need blood urgently? Create a request and connect with matching donors.',
      link: '/create-request',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Activity,
      title: 'Track Requests',
      description: 'View all active and completed blood requests in one organized dashboard.',
      link: '/blood-requests',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const steps = [
    { icon: UserPlus, title: 'Sign Up', description: 'Create your free account on BloodConnect.' },
    { icon: Droplet, title: 'Register as Donor', description: 'Fill in your donor details and availability.' },
    { icon: Search, title: 'Find or Request Blood', description: 'Search for donors or create a blood request.' },
    { icon: Heart, title: 'Save Lives', description: 'Connect and contribute to saving lives.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container-max px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Droplet className="w-4 h-4" fill="white" />
                <span className="text-sm font-medium">Every drop counts</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Connect Donors.<br />Save Lives.
              </h1>
              <p className="text-lg text-red-100 mb-8 max-w-lg leading-relaxed">
                BloodConnect is a platform that bridges the gap between blood donors
                and patients in need. Find donors, create requests, and make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/find-blood"
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Find Blood Now
                </Link>
                <Link
                  to="/register-donor"
                  className="bg-red-900/40 backdrop-blur-sm border border-white/30 hover:bg-red-900/60 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Become a Donor
                </Link>
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden md:block animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <h3 className="text-lg font-semibold mb-6 text-center">Live Platform Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white/15 rounded-xl mx-auto flex items-center justify-center mb-3">
                      <Users className="w-7 h-7" />
                    </div>
                    <p className="text-3xl font-bold">
                      {loading ? '—' : stats.donors}
                    </p>
                    <p className="text-sm text-red-100">Donors</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white/15 rounded-xl mx-auto flex items-center justify-center mb-3">
                      <FilePlus className="w-7 h-7" />
                    </div>
                    <p className="text-3xl font-bold">
                      {loading ? '—' : stats.requests}
                    </p>
                    <p className="text-sm text-red-100">Requests</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white/15 rounded-xl mx-auto flex items-center justify-center mb-3">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <p className="text-3xl font-bold">
                      {loading ? '—' : stats.cities}
                    </p>
                    <p className="text-sm text-red-100">Cities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What You Can Do
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Everything you need to find blood or become a donor, all in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="card hover:shadow-md hover:border-red-100 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Get started <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Joining and using BloodConnect is simple. Follow these four steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="card text-center">
                  <div className="w-14 h-14 bg-red-600 text-white rounded-full mx-auto flex items-center justify-center mb-4 relative">
                    <step.icon className="w-7 h-7" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-red-600 text-xs font-bold rounded-full flex items-center justify-center border-2 border-red-600">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Blood Donation Matters
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Every two seconds, someone in the world needs blood. One single donation
                can save up to three lives. Yet there is a constant shortage of blood in
                hospitals across the country. By becoming a donor, you become a hero to
                someone you may never meet.
              </p>
              <ul className="space-y-3">
                {[
                  'One donation can save up to 3 lives',
                  'Blood cannot be manufactured — it can only come from donors',
                  'Red blood cells must be used within 42 days',
                  'Regular donations help maintain a stable blood supply',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, value: '3', label: 'Lives saved per donation', color: 'bg-red-50 text-red-600' },
                { icon: Clock, value: '15 min', label: 'Time to donate blood', color: 'bg-blue-50 text-blue-600' },
                { icon: Shield, value: '56 days', label: 'Minimum between donations', color: 'bg-emerald-50 text-emerald-600' },
                { icon: Activity, value: '5L', label: 'Blood in adult body', color: 'bg-amber-50 text-amber-600' },
              ].map((stat) => (
                <div key={stat.label} className="card text-center">
                  <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Droplet className="w-12 h-12 mx-auto mb-4" fill="white" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-red-100 mb-8 max-w-xl mx-auto">
            Join thousands of donors who are saving lives every day. Your contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/about"
              className="border border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
