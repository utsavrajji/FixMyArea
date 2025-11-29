import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
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

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data and stats
  const fetchUserData = async (uid) => {
    try {
      setLoading(true);
      
      // Fetch user document
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setFormData({
          displayName: data.displayName || data.name || "",
          phone: data.phone || "",
          location: data.location || {
            state: "",
            district: "",
            block: "",
            village: "",
            pinCode: ""
          }
        });
      }

      // Fetch user's issue statistics
      const issuesRef = collection(db, "issues");
      const q = query(issuesRef, where("userId", "==", uid));
      const issuesSnap = await getDocs(q);
      
      const total = issuesSnap.size;
      const pending = issuesSnap.docs.filter(doc => doc.data().status === "Pending" || doc.data().status === "Under Review").length;
      const resolved = issuesSnap.docs.filter(doc => doc.data().status === "Resolved").length;
      
      setUserStats({ total, pending, resolved });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-300 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-shake">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={() => setError("")} className="ml-auto text-red-700 hover:text-red-900">✕</button>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Success!</p>
                <p className="text-sm">{success}</p>
              </div>
              <button onClick={() => setSuccess("")} className="ml-auto text-green-700 hover:text-green-900">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="space-y-6">
              {/* Statistics Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Your Statistics</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">Total Issues</p>
                        <p className="text-3xl font-bold text-blue-700">{userStats.total}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-yellow-600 font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-700">{userStats.pending}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600 font-medium mb-1">Resolved</p>
                        <p className="text-3xl font-bold text-green-700">{userStats.resolved}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔐</span>
                  <span>Account Info</span>
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span>📧</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span>🆔</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">User ID</p>
                      <p className="font-mono text-xs text-gray-600 truncate">{user?.uid}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span>📅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {userData?.createdAt 
                          ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setChangingPassword(!changingPassword)}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                >
                  {changingPassword ? "Cancel Password Change" : "Change Password"}
                </button>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    <span>Profile Information</span>
                  </h2>
                  {!editing && !changingPassword && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <span>✏️</span>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {/* Password Change Form */}
                {changingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? "Updating..." : "Update Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChangingPassword(false);
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                          setError("");
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : editing ? (
                  /* Edit Profile Form */
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91-XXXXX-XXXXX"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                      />
                    </div>

                    <div className="border-t-2 border-gray-200 pt-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Location Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleInputChange}
                            placeholder="e.g., Jharkhand"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                          <input
                            type="text"
                            name="location.district"
                            value={formData.location.district}
                            onChange={handleInputChange}
                            placeholder="e.g., Ranchi"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Block</label>
                          <input
                            type="text"
                            name="location.block"
                            value={formData.location.block}
                            onChange={handleInputChange}
                            placeholder="e.g., Ranchi"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Village/Area</label>
                          <input
                            type="text"
                            name="location.village"
                            value={formData.location.village}
                            onChange={handleInputChange}
                            placeholder="e.g., Radhe Nagar"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code</label>
                          <input
                            type="text"
                            name="location.pinCode"
                            value={formData.location.pinCode}
                            onChange={handleInputChange}
                            placeholder="e.g., 834001"
                            maxLength={6}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setError("");
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
                      <p className="text-lg font-semibold text-gray-800">{formData.displayName || "Not provided"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
                      <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Phone Number</label>
                      <p className="text-lg font-semibold text-gray-800">{formData.phone || "Not provided"}</p>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Location Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">State</label>
                          <p className="font-semibold text-gray-800">{formData.location.state || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">District</label>
                          <p className="font-semibold text-gray-800">{formData.location.district || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">Block</label>
                          <p className="font-semibold text-gray-800">{formData.location.block || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">Village/Area</label>
                          <p className="font-semibold text-gray-800">{formData.location.village || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">Pin Code</label>
                          <p className="font-semibold text-gray-800">{formData.location.pinCode || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      <Footer />
    </>
  );
}
