import { useState, useRef } from "react";
import { CheckCircle2, Upload, X, Image, Loader2, AlertCircle } from "lucide-react";

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "djzx7f5te";
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "preset";

export default function ResolvedUploadModal({ issue, onConfirm, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Sirf image files allowed hain (JPG, PNG, WEBP).");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Image 10 MB se choti honi chahiye.");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUploadAndConfirm = async () => {
    if (!file) {
      setError("Kripya resolution proof image upload karein.");
      return;
    }
    setUploading(true);
    setError("");

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);
      formData.append("folder", "fixmyarea/resolutions");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || "Image upload fail ho gayi.");
      }

      // Pass URL back to parent to update status + send email
      await onConfirm(data.secure_url);
    } catch (err) {
      setError(err.message || "Upload fail ho gayi. Dobara try karein.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          style={{ animation: "resolvedSlideUp 0.3s cubic-bezier(.22,.68,0,1.2)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base leading-tight">
                    Issue Resolved Proof
                  </h3>
                  <p className="text-emerald-100 text-[11px] font-medium mt-0.5">
                    Photo upload zaroori hai status update ke liye
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={uploading}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Info banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800">
                  Resolution proof required
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Issue resolve hone ke baad uski proof photo upload karein.
                  Yeh photo user ko email ke saath bhi bheja jaayega.
                </p>
              </div>
            </div>

            {/* Issue reference */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Issue
              </p>
              <p className="text-sm font-bold text-gray-800 line-clamp-2">
                {issue.title || issue.category}
              </p>
            </div>

            {/* Upload area */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                📸 Resolution Proof Photo <span className="text-red-500">*</span>
              </label>

              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 bg-gray-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-52 object-contain"
                  />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    disabled={uploading}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 px-3 py-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-[11px] font-bold truncate">{file.name}</span>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-emerald-400 bg-emerald-50 scale-[1.01]"
                      : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      dragOver ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <Image className={`w-7 h-7 ${dragOver ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        Photo drag karein ya <span className="text-emerald-600 underline">browse</span> karein
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP · Max 10 MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition">
                      <Upload className="w-3.5 h-3.5" />
                      Image Choose Karein
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadAndConfirm}
              disabled={uploading || !file}
              className="flex-[2] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Upload ho raha hai…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Resolved &amp; Email Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes resolvedSlideUp {
          from { transform: translateY(20px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
