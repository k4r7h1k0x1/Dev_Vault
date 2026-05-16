export default function Editor() {
  return (
    <section id="editor" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">The editor</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Split-pane.{' '}
          <span className="text-zinc-400">Type left, see right.</span>
        </h2>
        <p className="text-zinc-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
          A familiar dual-pane editor. Raw markdown on the left, live preview on the right — with
          first-class code blocks, tables, task lists, and footnotes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          {[
            'GitHub-flavored markdown',
            'Prism syntax highlighting',
            'Drag-and-drop image attachments',
            'Auto-save every keystroke',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex shrink-0" />
              <span className="text-zinc-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-2">
            <div style={{ backgroundColor: '#111111' }} className="p-4 border-r border-white/10">
              <p className="font-mono text-xs text-zinc-600 mb-3">markdown</p>
              <pre className="font-mono text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
              </pre>
            </div>
            <div style={{ backgroundColor: '#0f0f0f' }} className="p-4">
              <p className="font-mono text-xs text-zinc-600 mb-3">preview</p>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">System Design</h3>
                <h4 className="text-zinc-300 text-xs font-semibold mb-2">URL Shortener</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {['Base62 encode IDs', 'Cache hot URLs', 'Async analytics'].map((item, i) => (
                    <li key={i} className="text-zinc-400 text-xs">{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}