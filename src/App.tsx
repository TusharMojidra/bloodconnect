import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import About from '@/pages/About';
import FindBlood from '@/pages/FindBlood';
import RegisterDonor from '@/pages/RegisterDonor';
import CreateRequest from '@/pages/CreateRequest';
import BloodRequests from '@/pages/BloodRequests';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/find-blood" element={<FindBlood />} />
            <Route path="/register-donor" element={<RegisterDonor />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/blood-requests" element={<BloodRequests />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
