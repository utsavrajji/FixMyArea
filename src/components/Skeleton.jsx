import { motion } from "framer-motion";

export function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
}

export function IssueCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-gray-50 rounded w-20" />
          <div className="h-3 bg-gray-50 rounded w-20" />
        </div>
        <div className="h-9 bg-gray-200 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}

export function IssueRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="hidden sm:block w-24 h-6 bg-gray-100 rounded-full" />
      <div className="hidden md:block w-24 h-4 bg-gray-50 rounded" />
      <div className="w-20 h-8 bg-gray-100 rounded-lg" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100" />
        <div className="h-8 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="h-2 bg-gray-50 rounded w-16 mt-2" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-32 bg-white rounded-2xl border border-gray-200" />
        <div className="h-32 bg-white rounded-2xl border border-gray-200" />
      </div>
    </div>
  );
}
