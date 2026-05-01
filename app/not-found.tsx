import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-8 gap-3">
      <div className="text-7xl font-extrabold text-purple-600 italic">404</div>
      <p className="text-lg font-semibold text-gray-700">That spot isn&apos;t on the map.</p>
      <Link
        href="/home"
        className="mt-4 inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-magenta-500 text-white font-bold"
      >
        Back to Home
      </Link>
    </div>
  );
}
