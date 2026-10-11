import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api, BLOOD_GROUPS, CITIES, Donor } from '@/lib/api';
import { Droplet, UserPlus, CheckCircle2 } from 'lucide-react';
import Alert, { LoadingSpinner } from '@/components/UI';

interface DonorData {
  full_name: string;
  age: string;
  gender: string;
  blood_group: string;
  phone: string;
  email: string;
  city: string;
  last_donation_date: string;
  available: boolean;
}

export default function RegisterDonor() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [existingDonor, setExistingDonor] = useState<Donor | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<DonorData>({
    full_name: profile?.fullName || '',
    age: '',
    gender: '',
    blood_group: '',
    phone: profile?.phone || '',
    email: user?.email || '',
    city: profile?.city || '',
    last_donation_date: '',
    available: true,
  });

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    (async () => {
      try {
        const data = await api.donors.getMine();
        setExistingDonor(data);
        setForm({
          full_name: data.fullName,
          age: String(data.age),
          gender: data.gender,
          blood_group: data.bloodGroup,
          phone: data.phone,
          email: data.email,
          city: data.city,
          last_donation_date: data.lastDonationDate ? data.lastDonationDate.split('T')[0] : '',
          available: data.available,
        });
      } catch {
        // 404 = no donor profile yet, which is fine
      }
      setChecking(false);
    })();
  }, [user]);

  const handleChange = (field: keyof DonorData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      navigate('/login');
      return;
    }

    const ageNum = parseInt(form.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      setError('Age must be between 18 and 65 to be eligible for blood donation.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: form.full_name.trim(),
        age: ageNum,
        gender: form.gender,
        bloodGroup: form.blood_group,
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city,
        lastDonationDate: form.last_donation_date || null,
        available: form.available,
      };

      if (existingDonor) {
        const updated = await api.donors.update(existingDonor._id, payload);
        setExistingDonor(updated);
        setSuccess('Donor profile updated successfully!');
      } else {
        await api.donors.create(payload);
        setSuccess('You are now registered as a blood donor. Thank you!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  if (checking) {
    return <LoadingSpinner text="Checking donor status..." />;
  }

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-max max-w-md text-center">
          <div className="card">
            <Droplet className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">
              You need to be signed in to register as a blood donor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/signup" className="btn-secondary">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingDonor ? 'Update Your Donor Profile' : 'Register as a Blood Donor'}
          </h1>
          <p className="text-gray-500 mt-2">
            {existingDonor
              ? 'Keep your donor information up to date.'
              : 'Fill in your details to join our donor community.'}
          </p>
        </div>

        <div className="card">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}
          {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess(null)} /></div>}

          {existingDonor && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">You are already a registered donor. Update your details below.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Age *</label>
                <input
                  type="number"
                  required
                  min="18"
                  max="65"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="input-field"
                  placeholder="18-65"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                <select
                  required
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group *</label>
                <select
                  required
                  value={form.blood_group}
                  onChange={(e) => handleChange('blood_group', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                <select
                  required
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Donation Date</label>
              <input
                type="date"
                value={form.last_donation_date}
                onChange={(e) => handleChange('last_donation_date', e.target.value)}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Leave empty if you have never donated before.</p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  I am currently available to donate blood
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? 'Saving...'
                : existingDonor
                  ? 'Update Donor Profile'
                  : 'Register as Donor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
