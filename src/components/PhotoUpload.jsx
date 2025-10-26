export default function PhotoUpload({ photo, setPhoto }) {
  return (
    <div>
      <label className="block font-semibold mb-2">Upload Issue Photo (max 1MB)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && setPhoto(e.target.files[0])}
        className="block"
        required
      />
      {photo && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {photo.name} ({(photo.size / 1024).toFixed(1)} KB)
        </div>
      )}
    </div>
  );
}
