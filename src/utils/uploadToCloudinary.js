export async function uploadToCloudinary(file, folder = "issues") {
  if (!file) throw new Error("No file selected");
  if (file.size > 1024 * 1024) throw new Error("Image must be < 1MB");

  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error("Cloudinary env vars missing");

  const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);   // unsigned preset
  fd.append("folder", folder);

  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
