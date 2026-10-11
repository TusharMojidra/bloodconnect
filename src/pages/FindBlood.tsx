import { useState, useEffect } from 'react';
import { api, BLOOD_GROUPS, CITIES, Donor } from '@/lib/api';
import { Search, Droplet, MapPin, Phone, Mail, Calendar, X } from 'lucide-react';
import Alert, { LoadingSpinner, EmptyState } from '@/components/UI';

export default function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      const params: { bloodGroup?: string; city?: string; available: boolean } = { available: true };
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (city) params.city = city;
      const data = await api.donors.list(params);
      setDonors(data);
    } catch (err) {
      setSearchError(`Failed to search donors: ${(err as Error).message}`);
      setDonors([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = () => {
    setBloodGroup('');
    setCity('');
    setHasSearched(false);
    (async () => {
      setLoading(true);
      try {
        const data = await api.donors.list({ available: true });
        setDonors(data);
      } catch (err) {
        setSearchError(`Failed to search donors: ${(err as Error).message}`);
        setDonors([]);
      }
      setLoading(false);
    })();
  };

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Find Blood Donors</h1>
          <p className="text-gray-500 mt-2">Search for available donors by blood group and city.</p>
        </div>

        {/* Search Bar */}
        <div className="card mb-8">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="input-field"
              >
                <option value="">Any blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field"
              >
                <option value="">Any city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={search} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
              {(bloodGroup || city) && (
                <button onClick={clearFilters} className="btn-secondary px-3" title="Clear filters">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {searchError && (
          <div className="mb-6">
            <Alert type="error" message={searchError} onClose={() => setSearchError(null)} />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Searching for donors..." />
        ) : donors.length === 0 ? (
          <EmptyState
            icon={<Droplet className="w-8 h-8" />}
            title="No Donors Found"
            message={hasSearched
              ? "No available donors match your search criteria. Try different filters."
              : "There are no registered donors yet."}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor) => (
                <div key={donor._id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{donor.fullName}</h3>
                        <p className="text-xs text-gray-500 capitalize">{donor.gender}, {donor.age} years</p>
                      </div>
                    </div>
                    {donor.available && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Available
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {donor.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {donor.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{donor.email}</span>
                    </p>
                    {donor.lastDonationDate && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
