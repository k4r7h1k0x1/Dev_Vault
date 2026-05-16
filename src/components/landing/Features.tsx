const features = [
  {
    icon: '✦',
    title: 'Markdown native',
    desc: 'Write in plain markdown. Code fences with syntax highlighting for 100+ languages.',
  },
  {
    icon: '⬡',
    title: 'Folders & tags',
    desc: 'Organize by folder and tag. Nest as deep as you need — your knowledge, your structure.',
  },
  {
    icon: '⌕',
    title: 'Instant search',
    desc: 'Full-text search across every note title and body. Find that snippet in milliseconds.',
  },
  {
    icon: '⚿',
    title: 'Private by default',
    desc: 'Every note is yours. JWT auth via HttpOnly cookies, encrypted at rest.',
  },
  {
    icon: '⇗',
    title: 'Public share links',
    desc: 'Flip a switch and turn any note into a read-only public page. Perfect for portfolios.',
  },
  {
    icon: '⌨',
    title: 'Keyboard-first',
    desc: 'Quick-open with ⌘K, save with ⌘S. Built for the speed you expect from a dev tool.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Features</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Built like a tool you'd actually use.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white/3 border border-white/10 rounded-xl p-6 hover:border-violet-500/40 hover:bg-white/5 transition-all group"
          >
            <div className="text-violet-400 text-2xl mb-4">{f.icon}</div>
            <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}