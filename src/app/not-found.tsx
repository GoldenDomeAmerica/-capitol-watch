import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl text-navy">Page not found</h1>
      <p className="text-sm">That address is not on this site.</p>
      <Link href="/" className="font-semibold text-crimson underline">
        Back to Georgia bills
      </Link>
    </div>
  );
}
