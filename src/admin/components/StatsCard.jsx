export default function StatsCard({ icon: Icon, label, value, color = 'text-nexus-red', bgColor = 'bg-nexus-red/10' }) {
  return (
    <div className="bg-nexus-card border border-nexus-border rounded-xl p-5 hover:border-nexus-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-nexus-muted text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${bgColor}`}><Icon className={`w-5 h-5 ${color}`} /></div>
      </div>
    </div>
  )
}