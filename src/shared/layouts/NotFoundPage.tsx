import { Link } from '@tanstack/react-router'
import { Navbar } from '@/shared/components'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[radial-gradient(1200px_420px_at_50%_-120px,rgba(47,143,151,0.18),transparent_65%),linear-gradient(to_bottom,#f7faf9,#eef4f3)]">
      <Navbar />

      <main className="page-wrap flex flex-1 items-center justify-center px-4 py-8">
        <section className="island-shell w-full max-w-xl rounded-3xl border border-(--line) bg-primary/90 p-8 text-center shadow-[0_20px_60px_rgba(21,53,63,0.12)] backdrop-blur-sm sm:p-10">
          <p className="island-kicker mb-2">404</p>
          <h1 className="display-title mb-3 text-(--sea-ink)">Page not found</h1>
          <p className="m-0 text-(--sea-ink-soft)">
            The page you requested does not exist or has moved.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-5 py-2.5 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:bg-(--link-bg-hover)"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
