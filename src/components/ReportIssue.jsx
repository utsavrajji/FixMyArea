import { useState, useRef, useEffect } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import EXIF from "exif-js";
import { MapPin, Camera, ShieldCheck, Map, FileText, Bell, RefreshCw, Clock, X, CheckCircle, Search, AlertTriangle, Layers, Zap, Car, Eye, Upload, Crosshair, Pin } from "lucide-react";
import CategorySelector from "../components/CategorySelector";
import SubIssueSelector from "../components/SubIssueSelector";
import LocationForm from "../components/LocationForm";
import MapPicker from "../components/MapPicker";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Generic Toggle Switch
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        checked ? "bg-[#064E3B]" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </div>
  );
}

export default function ReportIssue() {
  // Original State
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
  const [locationWarning, setLocationWarning] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // New State for Civic Editorial Design
  const [priority, setPriority] = useState("MED");
  const [publicSafety, setPublicSafety] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  // Quick categories
  const quickCategories = [
    { id: "Road & Infrastructure", icon: <Car className="w-5 h-5 text-gray-400" />, label: "Pothole" },
    { id: "Garbage & Cleanliness", icon: "🗑️", label: "Trash" },
    { id: "Environment & Parks",   icon: <Eye className="w-5 h-5 text-gray-400" />, label: "Animals" },
    { id: "Electricity",           icon: <Zap className="w-5 h-5 text-gray-400" />, label: "Streetlight" },
  ];

  // Camera handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "live-photo.jpg", { type: "image/jpeg" });
        if (file.size > 5 * 1024 * 1024) setError("Image max 5MB");
        else {
          setError("");
          setPhoto(file);
          setPreview(URL.createObjectURL(file));
          setLocationWarning("");
          autoFillLocation(file, false);
        }
      }
    }, "image/jpeg", 0.9);
    stopCamera();
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error(e));
    }
  }, [isCameraOpen]);

  // Geocoding & EXIF
  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      setLocationWarning("Extracting exact address...");
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      
      if (data?.address) {
        const addr = data.address;
        setLocation((prev) => ({
          ...prev,
          state: addr.state || "",
          district: addr.state_district || addr.county || addr.city || addr.district || "",
          block: addr.suburb || addr.town || addr.municipality || "",
          village: addr.village || addr.city_district || "",
          panchayat: addr.neighbourhood || "",
          houseNo: data.display_name.split(",")[0] || "",
          pinCode: addr.postcode || "",
        }));
        setLocationCoords({ lat, lon, accuracy: 50 });
        setLocationWarning("Location automatically filled from GPS.");
      } else {
        setLocationWarning("Could not fetch precise details. Fill manually.");
      }
    } catch (err) {
      setLocationWarning("Failed to auto-detect address.");
    }
  };

  const convertExifToDecimal = (gpsData, ref) => {
    if (!gpsData || gpsData.length !== 3) return null;
    const degrees = gpsData[0].numerator / gpsData[0].denominator;
    const minutes = gpsData[1].numerator / gpsData[1].denominator;
    const seconds = gpsData[2].numerator / gpsData[2].denominator;
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (ref === "S" || ref === "W") decimal *= -1;
    return decimal;
  };

  const autoFillLocation = (file, isManualUpload = false) => {
    setLocationWarning("Checking image metadata...");
    setIsManualMode(isManualUpload);
    EXIF.getData(file, function () {
      const latData = EXIF.getTag(this, "GPSLatitude");
      const lonData = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef");
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

      if (latData && lonData && latRef && lonRef) {
        const imgLat = convertExifToDecimal(latData, latRef);
        const imgLon = convertExifToDecimal(lonData, lonRef);
        if (imgLat && imgLon) {
          fetchAddressFromCoords(imgLat, imgLon);
          return;
        }
      } 
      // Fallback
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchAddressFromCoords(pos.coords.latitude, pos.coords.longitude),
          (err) => setLocationWarning("Select location manually on the map."),
          { enableHighAccuracy: true }
        );
      }
    });
  };

  // Predefined check
  const predefinedCategories = [
    "Road & Infrastructure", "Garbage & Cleanliness", "Water Supply", "Electricity",
    "Environment & Parks", "Traffic & Transport", "Safety & Security", "Public Buildings & Facilities",
    "Housing Area Problems", "Accessibility for Disabled", "Drainage & Sewage", "Public Utilities",
    "Emergency / Urgent Issues", "Community & Social Issues", "Government Services"
  ];
  const isCustomCategory = (cat) => cat && !predefinedCategories.includes(cat);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return setError("Upload an image file");
      if (file.size > 5 * 1024 * 1024) return setError("Max size 5MB");
      setError(""); setPhoto(file); setPreview(URL.createObjectURL(file));
      setLocationWarning(""); autoFillLocation(file, true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return setError("Upload an image file");
      if (file.size > 5 * 1024 * 1024) return setError("Max size 5MB");
      setError(""); setPhoto(file); setPreview(URL.createObjectURL(file));
      setLocationWarning(""); autoFillLocation(file, true);
    }
  };

  const validate = () => {
    if (!category || category === "Other") { setError("Please set a category"); return false; }
    if (!isCustomCategory(category) && (!subIssue || subIssue === "Other")) { setError("Please set a specific issue type"); return false; }
    if (!description.trim()) { setError("Describe the issue"); return false; }
    if (!location.state || !location.district) { setError("Location details missing"); return false; }
    if (!photo) { setError("Photo evidence required"); return false; }
    setError(""); return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError("");

    const user = auth.currentUser;
    if (!user) {
      setLoading(false); navigate("/login"); return;
    }

    try {
      const { url: photoURL, publicId } = await uploadToCloudinary(photo, "issues");
      const title = isCustomCategory(category) ? category : `${category} - ${subIssue}`;
      await addDoc(collection(db, "issues"), {
        userId: user.uid,
        createdBy: user.uid,
        title, category,
        subIssue: subIssue || "Not specified",
        description: description.trim(),
        location, locationCoords,
        photoURL, photoPublicId: publicId,
        status: "Pending",
        upvotes: 0, comments: [],
        createdAt: serverTimestamp(),
        // New civic features
        priority, publicSafety,
        realTimeUpdates, anonymous
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  const locationStr = [location.houseNo, location.village, location.block, location.district]
    .filter(Boolean).join(", ") || "No location picked yet";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F3F4F6] pb-16 font-sans">
        
        {/* Camera Modal Overlay */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
            <button onClick={stopCamera} className="absolute top-4 right-4 bg-white/20 text-white p-3 rounded-full"><X className="w-5 h-5 inline mr-1 -mt-0.5" /> Close</button>
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg bg-black rounded-lg shadow-2xl mb-6 transform scale-x-[-1]" />
            <button onClick={capturePhoto} className="bg-white text-black font-bold px-8 py-4 rounded-full text-xl hover:bg-gray-200"><Camera className="w-6 h-6 inline mr-2 -mt-1" /> Capture Photo</button>
          </div>
        )}

        {/* Top Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-2 tracking-tight">Report a Local Issue</h1>
          <p className="text-gray-600 max-w-xl text-sm leading-relaxed">
            Your contribution helps us build a better, safer community. Fill out the details below to alert the local authorities.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row gap-8">
          
          {/* ── LEFT COLUMN: FORM ── */}
          <div className="w-full xl:w-2/3 space-y-6">
            
            {/* Alerts */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-2 border border-red-100 shadow-sm text-sm font-medium">
                <AlertTriangle className="w-5 h-5 inline mr-2 -mt-0.5" /> {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 border border-emerald-100 shadow-sm text-sm font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2 -mt-0.5" /> Submitted successfully! Redirecting...
              </div>
            )}

            {/* 1. Visual Evidence */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 font-bold text-gray-900">
                  <span className="text-blue-500 text-lg">📷</span> Visual Evidence
                </h2>
                <span className="bg-amber-900 text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-widest uppercase">
                  AI Analysis Active
                </span>
              </div>
              
              {!preview ? (
                <div
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all min-h-[200px] ${
                    dragActive ? "border-[#064E3B] bg-[#064E3B]/5" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">Drag and drop your photos here</p>
                    <p className="text-xs text-gray-500 mt-1">AI will automatically extract GPS data &amp; suggest categories.</p>
                  </label>
                  <button onClick={startCamera} className="mt-4 text-xs font-semibold text-[#064E3B] underline underline-offset-2">
                    Or take a live photo
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={preview} alt="Upload" className="w-full h-[250px] object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setPhoto(null); setPreview(null); }}
                      className="bg-white text-red-600 font-bold px-4 py-2 rounded-xl text-sm shadow">
                      Remove &amp; Retake
                    </button>
                  </div>
                </div>
              )}

              {/* Status Ribbon */}
              <div className="mt-4 bg-[#F5F2EF] text-[#A66C44] text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A66C44] animate-pulse" />
                {locationWarning || "Waiting for image upload to process AI details..."}
              </div>
            </div>

            {/* 2. Precise Location */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" /> Precise Location
              </h2>

              {/* Location detected pill */}
              <div className={`flex items-center gap-3 p-3 rounded-2xl border mb-4 ${
                locationCoords?.lat
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  locationCoords?.lat ? "bg-emerald-100" : "bg-gray-100"
                }`}>
                  {locationCoords?.lat ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Search className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${
                    locationCoords?.lat ? "text-emerald-700" : "text-gray-500"
                  }`}>
                    {locationCoords?.lat ? "Location Detected" : "Location Not Yet Detected"}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {locationStr !== "No location picked yet" ? locationStr : "Upload a photo or select manually below"}
                  </p>
                </div>
                {locationCoords?.lat && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {locationCoords.lat.toFixed(4)}, {locationCoords.lon.toFixed(4)}
                  </span>
                )}
              </div>

              {/* Manual Adjustments toggle */}
              <button
                type="button"
                onClick={() => setShowMap(prev => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                  showMap
                    ? "bg-[#064E3B] border-[#064E3B] text-white"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#064E3B]/40 hover:bg-[#064E3B]/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span className="text-sm font-bold">Manual Adjustments</span>
                  {!locationCoords?.lat && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showMap ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Collapsible map + form */}
              {showMap && (
                <div className="mt-3 space-y-3">

                  {/* Interactive MapPicker only */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                    <MapPicker
                      initialCoords={locationCoords}
                      onLocationSelect={fetchAddressFromCoords}
                    />
                  </div>

                  {/* Address form fields */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Verify / Edit Address</p>
                    <LocationForm location={location} setLocation={setLocation} />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Issue Details */}
            <div className="bg-[#F9FAFB] rounded-3xl p-6 border border-gray-100">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-5">
                <FileText className="w-5 h-5 text-blue-500" /> Issue Details
              </h2>
              
              {/* Category Quick Select */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Select Category</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {quickCategories.map(cat => (
                    <button key={cat.id} type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        category === cat.id ? "border-[#064E3B] bg-[#064E3B] text-white shadow-md" : "border-gray-200 bg-white hover:border-[#064E3B]/30 text-gray-700"
                      }`}>
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
                <CategorySelector category={category} setCategory={setCategory} />
                {category && (
                  <div className="mt-3">
                    <SubIssueSelector category={category} subIssue={subIssue} setSubIssue={setSubIssue} />
                  </div>
                )}
              </div>

              {/* Priority & Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Priority Level</p>
                  <div className="flex items-center bg-gray-200/50 p-1 rounded-lg">
                    {["LOW", "MED", "HIGH", "SOS"].map(level => (
                      <button key={level} type="button"
                        onClick={() => setPriority(level)}
                        className={`text-[10px] font-bold px-4 py-1.5 rounded-md transition-all ${
                          priority === level ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                        } ${level === "SOS" && priority === "SOS" ? "text-red-600" : ""}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Toggle checked={publicSafety} onChange={setPublicSafety} />
                  <span className="text-xs font-bold text-gray-800">Affects Public Safety</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</p>
                <textarea
                  rows={4}
                  placeholder="Tell us more about the issue..."
                  className="w-full bg-gray-200/50 border-transparent focus:bg-white focus:border-[#064E3B]/50 focus:ring-2 focus:ring-[#064E3B]/20 rounded-xl p-4 text-sm text-gray-800 resize-none transition-all placeholder-gray-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Settings Toggles */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Bell className="w-4 h-4" /></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Real-time status updates</p>
                  <p className="text-[10px] text-gray-500">Get notified via SMS and Email</p>
                </div>
              </div>
              <Toggle checked={realTimeUpdates} onChange={setRealTimeUpdates} />
            </div>

            <div className="flex items-center gap-2 px-2">
              <input type="checkbox" id="anon"
                checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 text-[#064E3B] rounded border-gray-300 focus:ring-[#064E3B]" />
              <label htmlFor="anon" className="text-xs font-semibold text-gray-800">Report Anonymously</label>
              <span className="text-[10px] text-gray-500 ml-1">(Your identity will be hidden from the public report)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-[3] bg-[#064E3B] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#053d2f] transition-all disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin inline ml-2" /> : null}
                {success ? "Success!" : loading ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-sm hover:bg-gray-300 transition-all uppercase tracking-wide"
              >
                Draft
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SIDEBAR ── */}
          <div className="w-full xl:w-1/3 mt-8 xl:mt-0 space-y-5">
            
            {/* Live Preview Card */}
            <div className="sticky top-24">
              <h3 className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-1">Live Preview</h3>
              <h2 className="text-lg font-extrabold text-[#064E3B] mb-4">Citizens Report #492</h2>
              
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 flex-col gap-2">
                      <Camera className="w-8 h-8 text-gray-300 mx-auto mt-2" />
                      <span className="text-xs font-semibold">Image Preview</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-md px-2.5 py-1 box-shadow">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Pending Review</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-1">
                      <span>{category === "Garbage & Cleanliness" ? <Layers className="w-4 h-4 text-gray-500" /> : category === "Road & Infrastructure" ? <Car className="w-4 h-4 text-gray-500" /> : <Pin className="w-4 h-4 text-gray-500" /> }</span> 
                      {category || "CATEGORY"}
                    </div>
                    {publicSafety && (
                      <div className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500 -mt-0.5" /> Safety Risk
                      </div>
                    )}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-3">
                    {description ? description.slice(0, 30) + (description.length > 30 ? "..." : "") : "Issue Title Appears Here"}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        <span className="font-bold block text-gray-900">Location</span>
                        {locationStr !== "No location picked yet" ? locationStr : "Address will render here"}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        <span className="font-bold block text-gray-900">Reported</span>
                        Just now by {anonymous ? "Anonymous Citizen" : "You"}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic border-l-2 border-gray-200 pl-2 leading-relaxed">
                    "{description ? description : "The full description provided by the citizen will be displayed here for authorities and neighbors to read."}"
                  </p>

                  <div className="mt-5 bg-gray-50 rounded-xl p-2.5 flex items-center justify-between border border-gray-100">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-300 border border-white"></div>
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-[8px] font-bold flex items-center justify-center text-blue-600 border border-white">+12</div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Awaiting Verification</span>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-5 bg-[#F5F5F4] rounded-2xl p-5 border border-gray-200">
                <h4 className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Official Review Guarantee
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Reports submitted through FixMyArea are directly integrated into the Municipal Maintenance Dispatch. Average response time for medium priority issues: 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
