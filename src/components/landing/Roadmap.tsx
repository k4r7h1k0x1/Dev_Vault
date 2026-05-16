const stages = [
  {
    num: '01',
    title: 'MVP',
    status: 'Shipping',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Auth · folders · markdown editor · CRUD',
  },
  {
    num: '02',
    title: 'Polish',
    status: 'Next',
    statusColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    desc: 'Public share links · image uploads · global search',
  },
  {
    num: '03',
    title: 'Real-time',
    status: 'Later',
    statusColor: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    desc: 'Live collaboration · presence cursors · comments',
  },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Roadmap</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          From personal tool to portfolio piece.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-16">
        {stages.map((s) => (
          <div
            key={s.num}
            className="bg-white/3 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-3xl font-bold text-white/10">{s.num}</span>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${s.statusColor}`}>
                {s.status}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="/signup"
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-md text-sm font-medium transition-colors"
        >
          Start your vault →
        </a>
      </div>
    </section>
  )
}