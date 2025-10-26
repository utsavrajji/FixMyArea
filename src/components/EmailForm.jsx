import { useState } from "react";

export default function EmailForm({ issue, onClose }) {
  const [to, setTo] = useState(issue.responsibleEmail || "");
  const [subject, setSubject] = useState(`Local Issue Reported: ${issue.title}`);
  const [body, setBody] = useState(`Dear Officer,

A local citizen has reported an issue in your area that requires attention.
Please review and take necessary action.

Issue Details:
- Title: ${issue.title}
- Description: ${issue.description}
- Category: ${issue.category}
- Location: ${Object.values(issue.location || {}).join(", ")}
- Reported By: ${issue.userName || "Anonymous"}
- Reported On: ${issue.createdAt?.toDate?.()?.toLocaleString() || ""}

View and update the issue here: [Link to admin dashboard]

Thanks,
LokIssue Team`);

  const handleSend = async () => {
    // Backend/cloud function SMTP/fetch here; placeholder:
    alert("Email send simulated!\n\n" + `To: ${to}\nSubject: ${subject}\n\n${body}`);
    onClose();
  };

  return (
    <div className="bg-white border rounded p-4 mt-3">
      <div className="mb-2 font-semibold">Email Concerned Officer</div>
      <input type="email" className="w-full border p-2 rounded mb-2" placeholder="Recipient Email" value={to} onChange={e => setTo(e.target.value)} />
      <input type="text" className="w-full border p-2 rounded mb-2" value={subject} onChange={e => setSubject(e.target.value)} />
      <textarea rows={5} className="w-full border p-2 rounded mb-2" value={body} onChange={e => setBody(e.target.value)} />
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="px-3 py-1 rounded border bg-gray-100">Cancel</button>
        <button onClick={handleSend} className="px-3 py-1 rounded bg-green-600 text-white">Send</button>
      </div>
    </div>
  );
}
