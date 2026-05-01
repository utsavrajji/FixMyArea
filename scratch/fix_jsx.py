import os

path = "/Users/utsavraj/Desktop/FixMyArea/new/src/pages/IssueDetailPage.jsx"
with open(path, "r") as f:
    lines = f.readlines()

# Line 118 (index 117)
lines[117] = '          <span className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${currentSc.active || "bg-gray-100 text-gray-600"}`}>\n'

# Line 148 (index 147)
lines[147] = '            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${sc.color}`}>\n'

with open(path, "w") as f:
    f.writelines(lines)
