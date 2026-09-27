import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Audience pages
import ClubHome from "./pages/ClubHome";
import EventRegister from "./pages/EventRegister";
import TicketConfirmation from "./pages/TicketConfirmation";
import CertificateDownload from "./pages/CertificateDownload";
import CertificateVerify from "./pages/CertificateVerify";

// Member / dashboard pages
import MemberLogin from "./pages/MemberLogin";
import Dashboard from "./pages/Dashboard";
import EventsList from "./pages/EventsList";
import EventEditor from "./pages/EventEditor";
import Registrations from "./pages/Registrations";
import RegistrationsPicker from "./pages/RegistrationsPicker";
import ScanCheckIn from "./pages/ScanCheckIn";
import ScanPicker from "./pages/ScanPicker";
import EventAnalytics from "./pages/EventAnalytics";
import AnalyticsPicker from "./pages/AnalyticsPicker";
import CertificateManager from "./pages/CertificateManager";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ClubHome />} />

          {/* Audience / public pages */}
          <Route path="/club/:slug" element={<ClubHome />} />
          <Route path="/club/:slug/events/:id/register" element={<EventRegister />} />
          <Route path="/club/:slug/events/:id/ticket" element={<TicketConfirmation />} />
          <Route path="/certificate/:registrationId" element={<CertificateDownload />} />
          <Route path="/verify/:certificateId" element={<CertificateVerify />} />

          {/* Member / event creator pages */}
          <Route path="/login" element={<MemberLogin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
          <Route path="/dashboard/events/new" element={<ProtectedRoute><EventEditor /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/edit" element={<ProtectedRoute><EventEditor /></ProtectedRoute>} />
          <Route path="/dashboard/registrations" element={<ProtectedRoute><RegistrationsPicker /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/registrations" element={<ProtectedRoute><Registrations /></ProtectedRoute>} />
          <Route path="/dashboard/scan" element={<ProtectedRoute><ScanPicker /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/scan" element={<ProtectedRoute><ScanCheckIn /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPicker /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/analytics" element={<ProtectedRoute><EventAnalytics /></ProtectedRoute>} />
          <Route path="/dashboard/certificates" element={<ProtectedRoute><CertificateManager /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
