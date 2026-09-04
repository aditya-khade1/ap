export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-dark text-lg font-bold text-white">
        AP
      </div>
      <div className="mt-4 h-6 w-6 animate-spin rounded-full border-2 border-brand/30 border-t-brand-dark" />
      <p className="mt-4 text-sm text-ink/60">Loading AP Fashion Mart…</p>
    </div>
  );
}
