export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-600 text-sm font-mono">
          © 2026 DevVault — built by developers, for developers.
        </p>
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <a href="#" className="hover:text-zinc-400 transition-colors">github</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">docs</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">changelog</a>
        </div>
      </div>
    </footer>
  )
}