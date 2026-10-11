import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, BLOOD_GROUPS, CITIES, BloodRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ListChecks, Droplet, MapPin, Building2, Phone, User, FilePlus, Filter } from 'lucide-react';
import Alert, { LoadingSpinner, EmptyState } from '@/components/UI';

const urgencyConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700' },
  urgent: { label: 'Urgent', color: 'bg-amber-100 text-amber-700' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  fulfilled: { label: 'Fulfilled', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-600' },
};

export default function BloodRequests() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params: { status?: string; bloodGroup?: string; city?: string } = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (bloodGroupFilter) params.bloodGroup = bloodGroupFilter;
      if (cityFilter) params.city = cityFilter;
      const data = await api.bloodRequests.list(params);
      setRequests(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(`Failed to load blood requests: ${(err as Error).message}`);
      setRequests([]);
    }
    setLoading(false);
  }, [statusFilter, bloodGroupFilter, cityFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    setActionError(null);
    setUpdating(id);
    try {
      await api.bloodRequests.update(id, { status });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      setActionError(`Failed to update request status: ${(err as Error).message}`);
    }
    setUpdating(null);
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blood request?')) return;
    setActionError(null);
    setDeleting(id);
    try {
      await api.bloodRequests.delete(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionError(`Failed to delete request: ${(err as Error).message}`);
    }
    setDeleting(null);
  };

  const canManage = (req: BloodRequest) => {
    return isAdmin || (user && req.userId === user.id);
  };

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
                <p className="text-sm text-gray-500">View and manage all blood requests</p>
              </div>
            </div>
          </div>
          {user && (
            <Link to="/create-request" className="btn-primary flex items-center gap-2">
              <FilePlus className="w-4 h-4" />
              Create Request
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            Filter Requests
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Blood Group</label>
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Any blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">City</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Any city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {actionError && (
          <div className="mb-4">
            <Alert type="error" message={actionError} onClose={() => setActionError(null)} />
          </div>
        )}
        {fetchError && (
          <div className="mb-4">
            <Alert type="error" message={fetchError} onClose={() => setFetchError(null)} />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Loading blood requests..." />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<Droplet className="w-8 h-8" />}
            title="No Blood Requests"
            message="There are no blood requests matching your filters."
            action={
              user ? (
                <Link to="/create-request" className="btn-primary">Create a Request</Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((req) => (
              <div key={req._id} className="card">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.patientName}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[req.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {statusConfig[req.status]?.label ?? req.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${urgencyConfig[req.urgency]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {urgencyConfig[req.urgency]?.label ?? req.urgency}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {req.hospital}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {req.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-gray-400" />
                    {req.unitsRequired} unit{req.unitsRequired !== 1 ? 's' : ''} needed
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {req.contactName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {req.contactPhone}
                  </p>
                </div>

                {/* Management actions */}
                {canManage(req) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(req._id, 'fulfilled')}
                          disabled={updating === req._id}
                          className="flex-1 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Mark Fulfilled
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, 'cancelled')}
                          disabled={updating === req._id}
                          className="flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {req.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(req._id, 'pending')}
                        disabled={updating === req._id}
                        className="w-full text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 mb-2"
                      >
                        Reopen as Pending
                      </button>
                    )}
                    <button
                      onClick={() => deleteRequest(req._id)}
                      disabled={deleting === req._id}
                      className="w-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors mt-2 disabled:opacity-50"
                    >
                      {deleting === req._id ? 'Deleting...' : 'Delete Request'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
