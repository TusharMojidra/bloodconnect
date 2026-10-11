import { useState } from 'react';
import { api } from '@/lib/api';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import Alert from '@/components/UI';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.contact.submit(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(`Failed to send message: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 98765 43210',
      detail: 'Mon to Sat, 9 AM - 6 PM',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@bloodconnect.org',
      detail: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'New Delhi, India',
      detail: 'Serving across the nation',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Have a question or need help? We're here for you. Reach out and we'll
            get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info) => (
              <div key={info.label} className="card text-center">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <info.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{info.label}</h3>
                <p className="text-gray-700 font-medium">{info.value}</p>
                <p className="text-sm text-gray-500 mt-1">{info.detail}</p>
              </div>
            ))}
          </div>

          {/* Form + Info */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
              </div>

              {success && (
                <div className="mb-4">
                  <Alert type="success" message="Your message has been sent! We'll get back to you soon." />
                </div>
              )}
              {error && (
                <div className="mb-4">
                  <Alert type="error" message={error} onClose={() => setError(null)} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Write your message here..."
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* FAQ / Info */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-gray-900">Response Time</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our support team typically responds within 24 hours during business days.
                  For urgent blood-related emergencies, please call our helpline directly.
                </p>
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: 'How do I register as a donor?',
                      a: 'Click "Register as Donor" in the navigation, fill in your details including blood group and city, and submit the form.',
                    },
                    {
                      q: 'How do I find blood in an emergency?',
                      a: 'Go to "Find Blood", select the required blood group and city, and search for available donors in your area.',
                    },
                    {
                      q: 'Can I update my availability status?',
                      a: 'Yes, log in to your dashboard and toggle your availability under the Donor Information section.',
                    },
                    {
                      q: 'Is my contact information visible to everyone?',
                      a: 'Your name, blood group, city, and contact details are visible to those searching for donors so they can reach you.',
                    },
                  ].map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{faq.q}</p>
                      <p className="text-sm text-gray-500">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-red-50 border-red-100">
                <h3 className="font-bold text-red-900 mb-2">Emergency Helpline</h3>
                <p className="text-sm text-red-700">
                  For blood emergencies, call our 24/7 helpline at{' '}
                  <span className="font-bold">+91 98765 43210</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
