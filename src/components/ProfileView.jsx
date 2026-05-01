import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { AlertTriangle, X, CheckCircle, BarChart3, ClipboardList, Clock, Lock, Mail, IdCard, Calendar, User, Pencil } from "lucide-react";

export default function ProfileView({ profile: propProfile }) {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(!propProfile);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    location: {
      state: "",
      district: "",
      block: "",
      village: "",
      pinCode: ""
    }
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Sync with propProfile if it changes
  useEffect(() => {
    if (propProfile) {
      setUserData(propProfile);
      setFormData({
        displayName: propProfile.displayName || propProfile.name || "",
        phone: propProfile.phone || "",
        location: propProfile.location || {
          state: "", district: "", block: "", village: "", pinCode: ""
        }
      });
      setLoading(false);
    }
  }, [propProfile]);

  // Initial stats fetch or data fetch if no propProfile
  useEffect(() => {
    if (!user) {
      const unsub = auth.onAuthStateChanged(u => {
        if (u) {
          setUser(u);
          if (!propProfile) fetchUserData(u.uid);
          else fetchUserStats(u.uid);
        }
      });
      return () => unsub();
    } else {
      if (!propProfile) fetchUserData(user.uid);
      else fetchUserStats(user.uid);
    }
  }, [user, propProfile]);

  const fetchUserStats = async (uid) => {
    try {
      const issuesRef = collection(db, "issues");
      const q = query(issuesRef, where("userId", "==", uid));
      const issuesSnap = await getDocs(q);
      const all = issuesSnap.docs.map(d => d.data());
      setUserStats({
        total: all.length,
        pending: all.filter(i => i.status === "Pending" || i.status === "Under Review").length,
        resolved: all.filter(i => i.status === "Resolved").length
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchUserData = async (uid) => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setFormData({
          displayName: data.displayName || data.name || "",
          phone: data.phone || "",
          location: data.location || { state: "", district: "", block: "", village: "", pinCode: "" }
        });
      }
      await fetchUserStats(uid);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        name: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        updatedAt: new Date()
      });

      setSuccess("Profile updated successfully!");
      setEditing(false);
      fetchUserData(user.uid);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setUpdating(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setSuccess("Password changed successfully!");
      setChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else if (err.code === "auth/weak-password") {
        setError("New password is too weak");
      } else {
        setError(err.message || "Failed to change password");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#064E3B] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-900/20">
            {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your personal information and security</p>
          </div>
        </div>
        {!editing && !changingPassword && (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#053d2f] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 animate-shake">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
          <button onClick={() => setSuccess("")} className="ml-auto text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Contribution Stats</span>
            </h2>
            
            <div className="space-y-3">
              {[
                { label: "Total Issues", val: userStats.total, color: "blue", icon: <ClipboardList className="w-4 h-4" /> },
                { label: "Pending", val: userStats.pending, color: "amber", icon: <Clock className="w-4 h-4" /> },
                { label: "Resolved", val: userStats.resolved, color: "emerald", icon: <CheckCircle className="w-4 h-4" /> }
              ].map((stat) => (
                <div key={stat.label} className={`p-3 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}>
                      {stat.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{stat.label}</span>
                  </div>
                  <span className={`text-lg font-black text-${stat.color}-700`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              <span>Security</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Email Address</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Member Since</p>
                  <p className="text-sm font-bold text-gray-800">
                    {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setChangingPassword(!changingPassword)}
                className="w-full mt-2 py-2.5 rounded-xl border-2 border-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
              >
                {changingPassword ? "Cancel Change" : "Change Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            {changingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Security Update</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={updating} className="flex-1 bg-[#064E3B] text-white py-3 rounded-xl font-bold hover:bg-[#053d2f] transition-all">
                    {updating ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            ) : editing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Full Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["state", "district", "block", "village", "pinCode"].map(field => (
                      <div key={field}>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{field === "pinCode" ? "PIN CODE" : field}</label>
                        <input
                          type="text"
                          name={`location.${field}`}
                          value={formData.location[field]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="submit" disabled={updating} className="flex-1 bg-[#064E3B] text-white py-3 rounded-xl font-bold hover:bg-[#053d2f] transition-all shadow-md">
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="flex-1 border-2 border-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
                      <p className="text-base font-bold text-gray-800">{formData.displayName || "Not set"}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Phone Number</label>
                      <p className="text-base font-bold text-gray-800">{formData.phone || "Not set"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-6">Address & Location</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(formData.location).map(([key, val]) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{key}</label>
                        <p className="text-sm font-bold text-gray-800">{val || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
