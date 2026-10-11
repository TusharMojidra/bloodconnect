import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api, CITIES, Donor, BloodRequest, Donation } from '@/lib/api';
import {
  LayoutDashboard,
  Droplet,
  FilePlus,
  Heart,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import Alert, { LoadingSpinner, StatCard, EmptyState } from '@/components/UI';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50', icon: Clock },
  fulfilled: { label: 'Fulfilled', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-gray-500 bg-gray-100', icon: XCircle },
};

export default function UserDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', city: '' });
  const [editDonor, setEditDonor] = useState(false);
  const [donorForm, setDonorForm] = useState({ available: true, phone: '', city: '' });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [donorData, reqData, donationData] = await Promise.all([
          api.donors.getMine().catch(() => null),
          api.bloodRequests.getMine(),
          api.donations.list(),
        ]);
        setDonor(donorData);
        setRequests(reqData);
        setDonations(donationData);
      } catch (err) {
        setSaveError(`Failed to load dashboard data: ${(err as Error).message}`);
      }
      setLoading(false);
    })();
  }, [user]);

  const startEditProfile = () => {
    setEditForm({
      full_name: profile?.fullName || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
    });
    setEditingProfile(true);
  };

  const saveProfile = async () => {
    setSaveError(null);
    setSaveSuccess(null);
    if (!user) return;

    try {
      await api.auth.updateProfile({
        fullName: editForm.full_name.trim(),
        phone: editForm.phone.trim(),
        city: editForm.city,
      });
      await refreshProfile();
      setEditingProfile(false);
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError((err as Error).message);
    }
  };

  const startEditDonor = () => {
    if (!donor) return;
    setDonorForm({
      available: donor.available,
      phone: donor.phone,
      city: donor.city,
    });
    setEditDonor(true);
  };

  const saveDonor = async () => {
    if (!donor) return;
    setSaveError(null);

    try {
      const updated = await api.donors.update(donor._id, {
        available: donorForm.available,
        phone: donorForm.phone.trim(),
        city: donorForm.city,
      });
      setDonor(updated);
      setEditDonor(false);
      setSaveSuccess('Donor information updated!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError((err as Error).message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const fulfilledRequests = requests.filter((r) => r.status === 'fulfilled').length;

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {profile?.fullName || 'User'}</p>
          </div>
        </div>

        {saveSuccess && <div className="mb-4"><Alert type="success" message={saveSuccess} /></div>}
        {saveError && <div className="mb-4"><Alert type="error" message={saveError} onClose={() => setSaveError(null)} /></div>}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Droplet className="w-6 h-6 text-white" />}
            label="Donation Records"
            value={donations.length}
            color="bg-red-600"
          />
          <StatCard
            icon={<FilePlus className="w-6 h-6 text-white" />}
            label="Total Requests"
            value={requests.length}
            color="bg-blue-600"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-white" />}
            label="Pending Requests"
            value={pendingRequests}
            color="bg-amber-500"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            label="Fulfilled Requests"
            value={fulfilledRequests}
            color="bg-emerald-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Profile</h2>
              {!editingProfile ? (
                <button onClick={startEditProfile} className="text-sm text-red-600 font-medium flex items-center gap-1 hover:underline">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="text-sm text-gray-500 font-medium flex items-center gap-1 hover:underline">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">City</label>
                  <select
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  {profile?.fullName || 'Not set'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {profile?.phone || 'Not set'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {profile?.city || 'Not set'}
                </div>
              </div>
            )}
          </div>

          {/* Donor Info Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Donor Information</h2>
              {donor && !editDonor && (
                <button onClick={startEditDonor} className="text-sm text-red-600 font-medium flex items-center gap-1 hover:underline">
                  <Edit3 className="w-3.5 h-3.5" /> Update
                </button>
              )}
              {editDonor && (
                <div className="flex gap-2">
                  <button onClick={saveDonor} className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={() => setEditDonor(false)} className="text-sm text-gray-500 font-medium flex items-center gap-1 hover:underline">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {donor ? (
              editDonor ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <select
                      value={donorForm.city}
                      onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                      className="input-field"
                    >
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={donorForm.available}
                      onChange={(e) => setDonorForm({ ...donorForm, available: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Available to donate</span>
                  </label>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{donor.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{donor.gender}, {donor.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {donor.city}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {donor.phone}
                  </div>
                  {donor.lastDonationDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="pt-2">
                    {donor.available ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Available to donate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        Currently unavailable
                      </span>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <Droplet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">You haven't registered as a donor yet.</p>
                <Link to="/register-donor" className="text-sm text-red-600 font-medium hover:underline">
                  Register now →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Donation History</h2>
            {donations.length === 0 ? (
              <div className="text-center py-6">
                <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No donations recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-9 h-9 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      {d.bloodGroup}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {d.units} unit{d.units !== 1 ? 's' : ''} donated
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(d.donationDate).toLocaleDateString()} • {d.city}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blood Requests Table */}
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">My Blood Requests</h2>
            <Link to="/create-request" className="text-sm text-red-600 font-medium hover:underline">
              + Create New
            </Link>
          </div>
          {requests.length === 0 ? (
            <EmptyState
              icon={<FilePlus className="w-8 h-8" />}
              title="No Requests Yet"
              message="You haven't created any blood requests."
              action={<Link to="/create-request" className="btn-primary">Create a Request</Link>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
                    <th className="pb-3 pr-4 font-medium">Patient</th>
                    <th className="pb-3 pr-4 font-medium">Blood</th>
                    <th className="pb-3 pr-4 font-medium">Hospital</th>
                    <th className="pb-3 pr-4 font-medium">City</th>
                    <th className="pb-3 pr-4 font-medium">Units</th>
                    <th className="pb-3 pr-4 font-medium">Urgency</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((req) => {
                    const sc = statusConfig[req.status] ?? { label: req.status, color: 'text-gray-500 bg-gray-100', icon: Clock };
                    return (
                      <tr key={req._id} className="text-gray-700">
                        <td className="py-3 pr-4 font-medium text-gray-900">{req.patientName}</td>
                        <td className="py-3 pr-4"><span className="font-bold text-red-600">{req.bloodGroup}</span></td>
                        <td className="py-3 pr-4">{req.hospital}</td>
                        <td className="py-3 pr-4">{req.city}</td>
                        <td className="py-3 pr-4">{req.unitsRequired}</td>
                        <td className="py-3 pr-4 capitalize">{req.urgency}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${sc.color}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
