import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      <p className="font-data text-7xl font-bold tabular-nums text-foreground">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
        If you believe this is an error, please contact our support team.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
      >
        Back to home
      </Link>
    </section>
  )
}
