import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ReportIssue from "./components/ReportIssue";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGate from "./pages/AdminGate";
import ResolvedIssues from "./pages/ResolvedIssues";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report-issue" element={<ReportIssue />} />
      {/* You can add <Route path="/admin" .../> in future */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/admin" element={<AdminGate />} />
         <Route path="/history" element={<ResolvedIssues />} />
    </Routes>
  );
}

export default App;
