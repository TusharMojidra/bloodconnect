import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api, BLOOD_GROUPS, CITIES, URGENCY_LEVELS } from '@/lib/api';
import { FilePlus, Droplet } from 'lucide-react';
import Alert from '@/components/UI';

export default function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient_name: '',
    blood_group: '',
    hospital: '',
    city: '',
    units_required: '1',
    urgency: 'normal' as string,
    contact_name: '',
    contact_phone: '',
  });

  const handleChange = (field: string, value: string) => {
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

    const units = parseInt(form.units_required, 10);
    if (isNaN(units) || units <= 0) {
      setError('Units required must be a positive number.');
      return;
    }

    setLoading(true);

    try {
      await api.bloodRequests.create({
        patientName: form.patient_name.trim(),
        bloodGroup: form.blood_group,
        hospital: form.hospital.trim(),
        city: form.city,
        unitsRequired: units,
        urgency: form.urgency,
        contactName: form.contact_name.trim(),
        contactPhone: form.contact_phone.trim(),
      });

      setSuccess('Blood request created successfully! It will appear in the Blood Requests page.');
      setForm({
        patient_name: '',
        blood_group: '',
        hospital: '',
        city: '',
        units_required: '1',
        urgency: 'normal',
        contact_name: '',
        contact_phone: '',
      });
      setTimeout(() => navigate('/blood-requests'), 2000);
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-max max-w-md text-center">
          <div className="card">
            <Droplet className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">
              You need to be signed in to create a blood request.
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

  const urgencyColors: Record<string, string> = {
    critical: 'bg-red-50 border-red-300 text-red-700',
    urgent: 'bg-amber-50 border-amber-300 text-amber-700',
    normal: 'bg-blue-50 border-blue-300 text-blue-700',
  };

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FilePlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create a Blood Request</h1>
          <p className="text-gray-500 mt-2">
            Fill in the details below to request blood from our donor community.
          </p>
        </div>

        <div className="card">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}
          {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess(null)} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name *</label>
              <input
                type="text"
                required
                value={form.patient_name}
                onChange={(e) => handleChange('patient_name', e.target.value)}
                className="input-field"
                placeholder="Full name of the patient"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group Needed *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Units Required *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.units_required}
                  onChange={(e) => handleChange('units_required', e.target.value)}
                  className="input-field"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={form.hospital}
                  onChange={(e) => handleChange('hospital', e.target.value)}
                  className="input-field"
                  placeholder="e.g., AIIMS Hospital"
                />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
              <div className="grid grid-cols-3 gap-3">
                {URGENCY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('urgency', level)}
                    className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                      form.urgency === level
                        ? urgencyColors[level]
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={form.contact_name}
                  onChange={(e) => handleChange('contact_name', e.target.value)}
                  className="input-field"
                  placeholder="Person to contact"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="input-field"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating request...' : 'Create Blood Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
