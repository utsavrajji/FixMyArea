import { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import CategorySelector from "../components/CategorySelector";
import SubIssueSelector from "../components/SubIssueSelector";
import LocationForm from "../components/LocationForm";
import PhotoUpload from "../components/PhotoUpload";
import { useNavigate } from "react-router-dom";

export default function ReportIssue() {
  const [category, setCategory] = useState("");
  const [subIssue, setSubIssue] = useState("");
  const [location, setLocation] = useState({
    state: "", district: "", block: "", village: "",
    panchayat: "", houseNo: "", pinCode: "", mobile: ""
  });
  const [locationCoords, setLocationCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!category || !subIssue || !description.trim()) { setError("All fields are required."); return false; }
    if (!location.state || !location.district || !location.pinCode) { setError("Location required."); return false; }
    if (!photo) { setError("Attach a photo (<1MB)."); return false; }
    if (photo.size > 1024 * 1024) { setError("Image must be < 1MB."); return false; }
    setError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to report an issue.");
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
        likes: [],
        likesCount: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-7 text-center text-orange-700">Report a Local Issue</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-6">
        {error && <div className="text-red-600">{error}</div>}

        <CategorySelector category={category} setCategory={setCategory} />
        {category && <SubIssueSelector category={category} subIssue={subIssue} setSubIssue={setSubIssue} />}

        <textarea
          rows={3}
          placeholder="Describe the issue (required)"
          className="w-full border rounded p-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <LocationForm location={location} setLocation={setLocation} setLocationCoords={setLocationCoords} />

        <PhotoUpload photo={photo} setPhoto={setPhoto} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-700 text-white py-3 rounded font-semibold hover:bg-orange-800 transition"
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
}
