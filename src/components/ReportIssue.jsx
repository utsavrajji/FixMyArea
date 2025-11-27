import { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import CategorySelector from "../components/CategorySelector";
import SubIssueSelector from "../components/SubIssueSelector";
import LocationForm from "../components/LocationForm";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function ReportIssue() {
  const [category, setCategory] = useState("");
  const [subIssue, setSubIssue] = useState("");
  const [location, setLocation] = useState({
    state: "", district: "", block: "", village: "",
    panchayat: "", houseNo: "", pinCode: "", mobile: ""
  });
  const [locationCoords, setLocationCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Photo Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file (JPG, PNG, WEBP)");
        return;
      }
      if (file.size > 1024 * 1024) {
        setError("Image size must be less than 1MB");
        return;
      }
      setError("");
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 1024 * 1024) {
        setError("Image size must be less than 1MB");
        return;
      }
      setError("");
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreview(null);
  };

  // Validation
  const validate = () => {
    if (!category || !subIssue || !description.trim()) {
      setError("Please fill in all required fields");
      return false;
    }
    if (!location.state || !location.district || !location.pinCode) {
      setError("Location details are required");
      return false;
    }
    if (!photo) {
      setError("Please attach a photo of the issue");
      return false;
    }
    setError("");
    return true;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to report an issue");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const { url: photoURL, publicId } = await uploadToCloudinary(photo, "issues");

      await addDoc(collection(db, "issues"), {
        userId: user.uid,
        createdBy: user.uid,
        title: `${category} - ${subIssue}`,
        category,
        subIssue,
        description: description.trim(),
        location,
        locationCoords,
        photoURL,
        photoPublicId: publicId,
        status: "Pending",
        upvotes: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to submit issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              🚨 Make Your Voice Heard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Report a Local Issue
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Help improve your community by reporting local problems. Your report helps authorities take action faster.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <div className="flex items-center justify-between text-white text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${category ? 'bg-white text-orange-500' : 'bg-white/30'}`}>1</span>
                  <span className="hidden sm:inline">Category</span>
                </div>
                <div className="flex-1 h-1 bg-white/30 mx-2" />
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${subIssue ? 'bg-white text-orange-500' : 'bg-white/30'}`}>2</span>
                  <span className="hidden sm:inline">Details</span>
                </div>
                <div className="flex-1 h-1 bg-white/30 mx-2" />
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${location.state ? 'bg-white text-orange-500' : 'bg-white/30'}`}>3</span>
                  <span className="hidden sm:inline">Location</span>
                </div>
                <div className="flex-1 h-1 bg-white/30 mx-2" />
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${photo ? 'bg-white text-orange-500' : 'bg-white/30'}`}>4</span>
                  <span className="hidden sm:inline">Photo</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-shake">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Your issue has been reported. Redirecting to dashboard...</p>
                  </div>
                </div>
              )}

              {/* Section 1: Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📂</span>
                  <label className="text-lg font-bold text-gray-800">Select Issue Category</label>
                  <span className="text-red-500">*</span>
                </div>
                <CategorySelector category={category} setCategory={setCategory} />
              </div>

              {/* Section 2: Sub-Issue */}
              {category && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    <label className="text-lg font-bold text-gray-800">Specific Issue Type</label>
                    <span className="text-red-500">*</span>
                  </div>
                  <SubIssueSelector category={category} subIssue={subIssue} setSubIssue={setSubIssue} />
                </div>
              )}

              {/* Section 3: Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <label className="text-lg font-bold text-gray-800">Describe the Issue</label>
                  <span className="text-red-500">*</span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Please provide detailed information about the issue. Include when it started, how it affects you, and any other relevant details..."
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 text-right">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Section 4: Location */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <label className="text-lg font-bold text-gray-800">Location Details</label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <LocationForm 
                    location={location} 
                    setLocation={setLocation} 
                    setLocationCoords={setLocationCoords} 
                  />
                </div>
              </div>

              {/* Section 5: Photo Upload - UPDATED */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📸</span>
                  <label className="text-lg font-bold text-gray-800">Upload Photo Evidence</label>
                  <span className="text-red-500">*</span>
                </div>

                {/* Photo Upload Box */}
                {!preview ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-3 border-dashed rounded-3xl p-10 transition-all duration-300 ${
                      dragActive
                        ? "border-orange-500 bg-orange-50 scale-[1.02] shadow-xl"
                        : "border-gray-300 bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 hover:border-orange-400 hover:shadow-lg"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="photo-upload-input"
                    />
                    
                    <div className="text-center space-y-5">
                      {/* Animated Icon */}
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {/* Main Text */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {dragActive ? "🎯 Drop it here!" : "📸 Upload Issue Photo"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Drag & drop your image here, or click the button below
                        </p>
                      </div>

                      {/* Choose File Button */}
                      <div>
                        <label
                          htmlFor="photo-upload-input"
                          className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-bold rounded-2xl cursor-pointer shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group overflow-hidden"
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                          
                          {/* Icon */}
                          <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          
                          {/* Text */}
                          <span className="relative z-10 text-lg">Choose File</span>
                        </label>
                      </div>

                      {/* File Info */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">JPG, PNG, WEBP</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                          <span className="text-blue-600">💾</span>
                          <span className="text-gray-700">Max 1MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Preview Area */
                  <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-3xl p-6 shadow-xl animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Image Preview */}
                      <div className="relative group">
                        <div className="w-full md:w-56 h-56 bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-2 ring-green-300">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {/* Success Badge */}
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce-slow">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </div>
                      </div>

                      {/* File Details */}
                      <div className="flex-1 space-y-4 text-center md:text-left w-full">
                        {/* Title */}
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">✅</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Photo Ready!</h3>
                            <p className="text-sm text-gray-600">Image uploaded successfully</p>
                          </div>
                        </div>
                        
                        {/* File Info Cards */}
                        <div className="space-y-2">
                          <div className="bg-white rounded-xl p-3 shadow-md flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">📄</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">File Name</p>
                              <p className="font-semibold text-gray-800 truncate text-sm">{photo.name}</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-3 shadow-md flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">💾</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">File Size</p>
                              <p className="font-semibold text-gray-800 text-sm">{(photo.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center md:justify-start pt-2">
                          <label
                            htmlFor="photo-change-input"
                            className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="photo-change-input"
                            />
                          </label>
                          
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips Section */}
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl p-5 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-xl">💡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-indigo-900 mb-2">Photo Tips for Better Results:</p>
                      <ul className="text-xs text-indigo-800 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>Take photos in good lighting (daylight is best)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>Capture the full extent of the problem</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>Include nearby landmarks for location reference</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>Avoid blurry or dark images</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t-2 border-gray-100">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Your Report...</span>
                    </>
                  ) : success ? (
                    <>
                      <span>✅</span>
                      <span>Submitted Successfully!</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Submit Issue Report</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-800 mb-1">Fast Response</h3>
              <p className="text-sm text-gray-600">Issues are reviewed within 24-48 hours</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-bold text-gray-800 mb-1">Secure & Private</h3>
              <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-gray-800 mb-1">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor status updates in real-time</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </>
  );
}
