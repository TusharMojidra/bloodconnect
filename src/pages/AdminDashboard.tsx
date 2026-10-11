import { useState, useEffect } from 'react';
import { api, Donor, BloodRequest, AdminStats } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Users,
  Droplet,
  FilePlus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from 'lucide-react';
import { LoadingSpinner, StatCard, EmptyState } from '@/components/UI';

type Tab = 'overview' | 'donors' | 'requests';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [statsData, donorData, reqData] = await Promise.all([
          api.admin.stats(),
          api.admin.donors(),
          api.admin.bloodRequests(),
        ]);
        setStats(statsData);
        setDonors(donorData);
        setRequests(reqData);
      } catch (err) {
        setActionError(`Failed to load admin data: ${(err as Error).message}`);
      }
      setLoading(false);
    })();
  }, []);

  const updateRequestStatus = async (id: string, status: string) => {
    setActionError(null);
    setActionLoading(id);
    try {
      await api.bloodRequests.update(id, { status });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      setActionError(`Failed to update request status: ${(err as Error).message}`);
    }
    setActionLoading(null);
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blood request?')) return;
    setActionError(null);
    setActionLoading(`del-${id}`);
    try {
      await api.bloodRequests.delete(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionError(`Failed to delete request: ${(err as Error).message}`);
    }
    setActionLoading(null);
  };

  const toggleDonorAvailability = async (id: string) => {
    setActionError(null);
    setActionLoading(`donor-${id}`);
    try {
      const updated = await api.donors.toggleAvailability(id);
      setDonors((prev) => prev.map((d) => (d._id === id ? updated : d)));
    } catch (err) {
      setActionError(`Failed to update donor availability: ${(err as Error).message}`);
    }
    setActionLoading(null);
  };

  const deleteDonor = async (id: string) => {
    if (!confirm('Are you sure you want to remove this donor record?')) return;
    setActionError(null);
    setActionLoading(`del-donor-${id}`);
    try {
      await api.donors.delete(id);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setActionError(`Failed to delete donor: ${(err as Error).message}`);
    }
    setActionLoading(null);
  };

  const filteredDonors = donors.filter((d) => {
    const q = search.toLowerCase();
    return d.fullName.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.bloodGroup.toLowerCase().includes(q);
  });

  const filteredRequests = requests.filter((r) => {
    const q = search.toLowerCase();
    return r.patientName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.bloodGroup.toLowerCase().includes(q);
  });

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'donors', label: 'Manage Donors', icon: Droplet },
    { id: 'requests', label: 'Manage Requests', icon: FilePlus },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50' },
    fulfilled: { label: 'Fulfilled', color: 'text-emerald-600 bg-emerald-50' },
    cancelled: { label: 'Cancelled', color: 'text-gray-500 bg-gray-100' },
  };

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">{profile?.fullName || 'Administrator'} • System Administrator</p>
          </div>
        </div>

        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {actionError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-white" />}
            label="Total Users"
            value={stats?.users ?? 0}
            color="bg-blue-600"
          />
          <StatCard
            icon={<Droplet className="w-6 h-6 text-white" />}
            label="Total Donors"
            value={donors.length}
            color="bg-red-600"
          />
          <StatCard
            icon={<FilePlus className="w-6 h-6 text-white" />}
            label="Blood Requests"
            value={requests.length}
            color="bg-amber-500"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            label="Available Donors"
            value={donors.filter((d) => d.available).length}
            color="bg-emerald-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(''); }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Request Status Breakdown</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-900">Pending</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">{stats?.pendingRequests ?? requests.filter((r) => r.status === 'pending').length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Fulfilled</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">{stats?.fulfilledRequests ?? requests.filter((r) => r.status === 'fulfilled').length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Cancelled</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-500">
                    {stats?.cancelledRequests ?? requests.filter((r) => r.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Recent Blood Requests</h2>
              <div className="space-y-3">
                {requests.slice(0, 5).map((req) => (
                  <div key={req._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{req.patientName}</p>
                        <p className="text-xs text-gray-500">{req.hospital}, {req.city}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[req.status]?.color ?? 'text-gray-500 bg-gray-100'}`}>
                      {statusConfig[req.status]?.label ?? req.status}
                    </span>
                  </div>
                ))}
                {requests.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No requests yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {tab === 'donors' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Manage Donors ({donors.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none w-64"
                  placeholder="Search donors..."
                />
              </div>
            </div>

            {filteredDonors.length === 0 ? (
              <EmptyState
                icon={<Droplet className="w-8 h-8" />}
                title="No Donors Found"
                message={search ? "No donors match your search." : "No donors have registered yet."}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Blood</th>
                      <th className="pb-3 pr-4 font-medium">City</th>
                      <th className="pb-3 pr-4 font-medium">Phone</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDonors.map((donor) => (
                      <tr key={donor._id} className="text-gray-700">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{donor.fullName}</p>
                          <p className="text-xs text-gray-500 capitalize">{donor.gender}, {donor.age} yrs</p>
                        </td>
                        <td className="py-3 pr-4"><span className="font-bold text-red-600">{donor.bloodGroup}</span></td>
                        <td className="py-3 pr-4">{donor.city}</td>
                        <td className="py-3 pr-4">{donor.phone}</td>
                        <td className="py-3 pr-4">
                          {donor.available ? (
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Available</span>
                          ) : (
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Unavailable</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleDonorAvailability(donor._id)}
                              disabled={actionLoading === `donor-${donor._id}`}
                              className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {donor.available ? 'Set Unavailable' : 'Set Available'}
                            </button>
                            <button
                              onClick={() => deleteDonor(donor._id)}
                              disabled={actionLoading === `del-donor-${donor._id}`}
                              className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Manage Blood Requests ({requests.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none w-64"
                  placeholder="Search requests..."
                />
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={<FilePlus className="w-8 h-8" />}
                title="No Requests Found"
                message={search ? "No requests match your search." : "No blood requests have been created yet."}
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
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRequests.map((req) => (
                      <tr key={req._id} className="text-gray-700">
                        <td className="py-3 pr-4 font-medium text-gray-900">{req.patientName}</td>
                        <td className="py-3 pr-4"><span className="font-bold text-red-600">{req.bloodGroup}</span></td>
                        <td className="py-3 pr-4">{req.hospital}</td>
                        <td className="py-3 pr-4">{req.city}</td>
                        <td className="py-3 pr-4">{req.unitsRequired}</td>
                        <td className="py-3 pr-4 capitalize">{req.urgency}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[req.status]?.color ?? 'text-gray-500 bg-gray-100'}`}>
                            {statusConfig[req.status]?.label ?? req.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {req.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateRequestStatus(req._id, 'fulfilled')}
                                  disabled={actionLoading === req._id}
                                  className="text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                  title="Mark fulfilled"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(req._id, 'cancelled')}
                                  disabled={actionLoading === req._id}
                                  className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                  title="Cancel"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteRequest(req._id)}
                              disabled={actionLoading === `del-${req._id}`}
                              className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
