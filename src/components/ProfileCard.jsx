export default function ProfileCard({ profile }) {
  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
        <div className="h-4 bg-gray-200 w-1/3 rounded mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Full Name", value: profile.name || profile.fullName },
    { label: "Email", value: profile.email },
    { label: "Mobile", value: profile.phone || profile.mobile },
    { label: "State", value: profile.state },
    { label: "District", value: profile.district },
    { label: "City / Village", value: profile.city || profile.village },
    { label: "Panchayat / Ward", value: profile.panchayat || profile.ward },
    { label: "PIN Code", value: profile.pinCode || profile.pincode },
    { label: "Address", value: profile.address || profile.houseNo },
    { label: "Role", value: profile.role || "User" },
  ].filter(r => r.value);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold text-gray-900">My Profile</h3>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.label} className="text-sm">
            <div className="text-gray-500">{r.label}</div>
            <div className="font-medium text-gray-900">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
