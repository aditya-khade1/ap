import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="font-serif text-6xl">404</h1>
      <p className="mt-4 text-lg text-black/55">Page not found</p>
      <p className="mt-2 text-sm text-black/40">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
      >
        Back to Home
      </Link>
    </div>
  );
}
