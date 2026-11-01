export default function SchedulePanel({ data, loading }) {
  return (
    <div className="min-h-[320px] rounded-2xl border border-navy bg-white/60 p-6">
      <h3 className="mb-3 font-bold">Planting &amp; Harvesting Schedule</h3>
      {loading ? <p>Loading…</p> : data ? (
        <dl className="space-y-2 text-sm">{Object.entries(data).map(([k, v]) => <div key={k}><dt className="font-bold capitalize">{k}</dt><dd>{Array.isArray(v) ? v.join(', ') : String(v)}</dd></div>)}</dl>
      ) : <p className="text-navy-600">Placeholder: your schedule from the backend will appear here.</p>}
    </div>
  )
}
