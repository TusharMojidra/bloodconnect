import { Link } from 'react-router-dom';
import {
  Droplet,
  Target,
  Eye,
  Users,
  Heart,
  Shield,
  Award,
  HandHeart,
} from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We believe in the power of empathy and the impact of selfless giving.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'We maintain transparency and security in every interaction on our platform.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build a connected community of donors and recipients across the nation.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in service delivery and user experience.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <Droplet className="w-12 h-12 mx-auto mb-4" fill="white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About BloodConnect</h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            A mission-driven platform dedicated to connecting blood donors with patients
            in need, one donation at a time.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card border-l-4 border-l-red-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To bridge the gap between blood donors and patients by providing a reliable,
                accessible, and user-friendly platform. We aim to ensure that no life is lost
                due to a shortage of blood by building a strong network of willing donors
                across cities and towns.
              </p>
            </div>
            <div className="card border-l-4 border-l-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To create a world where blood is always available when needed, where every
                eligible individual is a registered donor, and where technology serves humanity
                by making the gift of life just a click away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-left">
              <p>
                BloodConnect was born out of a simple observation: despite millions of
                eligible donors, hospitals and patients constantly struggle to find blood
                when it is needed the most. The problem is not a lack of willing donors —
                it is a lack of connection.
              </p>
              <p>
                Founded as a college project for Web Application Development, BloodConnect
                aims to solve this problem using technology. Our platform provides a
                centralized database of donors that can be searched by blood group and
                city, making it easy for patients and hospitals to find matching donors
                quickly.
              </p>
              <p>
                Beyond just finding blood, we also enable users to create urgent blood
                requests, track their donation history, and manage their donor profiles —
                all in one place. We believe that by making the process simple and
                accessible, we can encourage more people to donate and ultimately save
                more lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card text-center">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built With Modern Technology</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              BloodConnect is built using a modern full-stack architecture for reliability and performance.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { name: 'React + Vite', desc: 'Frontend UI' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'Supabase', desc: 'Backend & Database' },
              { name: 'REST APIs', desc: 'Data layer' },
            ].map((tech) => (
              <div key={tech.name} className="card text-center">
                <p className="font-semibold text-gray-900">{tech.name}</p>
                <p className="text-sm text-gray-500 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-16 text-center">
          <HandHeart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Join Our Mission</h2>
          <p className="text-red-100 mb-8 max-w-xl mx-auto">
            Be part of a community that saves lives. Register as a donor today.
          </p>
          <Link
            to="/register-donor"
            className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <Droplet className="w-5 h-5" fill="currentColor" />
            Become a Donor
          </Link>
        </div>
      </section>
    </div>
  );
}
