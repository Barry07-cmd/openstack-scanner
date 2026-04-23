import { useMemo, useState } from 'react'

const mockStats = [
  { title: 'Total VMs', value: '12', change: '+2', note: 'since last scan' },
  { title: 'Security Groups', value: '8', change: '-1', note: 'misconfigured group fixed' },
  { title: 'Volumes Checked', value: '5', change: '+1', note: 'new volume added' },
  { title: 'Risk Score', value: '72/100', change: '+4', note: 'higher than previous run' },
]

const mockFindings = [
  {
    id: 1,
    severity: 'CRITICAL',
    title: 'Database Port Open',
    resource: 'db-server-01',
    category: 'Network',
    description: 'PostgreSQL port 5432 is exposed to the public internet.',
    status: 'Open',
  },
  {
    id: 2,
    severity: 'HIGH',
    title: 'Public SSH Exposure',
    resource: 'web-server-01',
    category: 'Compute',
    description: 'SSH port 22 is open to 0.0.0.0/0.',
    status: 'Open',
  },
  {
    id: 3,
    severity: 'MEDIUM',
    title: 'Unencrypted Volume',
    resource: 'vol-02',
    category: 'Storage',
    description: 'A block storage volume is not encrypted.',
    status: 'Review',
  },
  {
    id: 4,
    severity: 'LOW',
    title: 'Orphaned Floating IP',
    resource: '192.168.1.55',
    category: 'Network',
    description: 'Floating IP is allocated but not attached to any instance.',
    status: 'Monitor',
  },
]

const mockReports = [
  { name: 'report_2026_04_23.json', date: '23 Apr 2026', type: 'JSON', size: '245 KB' },
  { name: 'report_2026_04_22.pdf', date: '22 Apr 2026', type: 'PDF', size: '1.2 MB' },
  { name: 'report_2026_04_20.json', date: '20 Apr 2026', type: 'JSON', size: '198 KB' },
]

const chartBars = [68, 52, 84, 43, 76, 61, 89]

function badgeClass(severity) {
  if (severity === 'CRITICAL') return 'border-red-500/30 bg-red-500/15 text-red-300'
  if (severity === 'HIGH') return 'border-orange-500/30 bg-orange-500/15 text-orange-300'
  if (severity === 'MEDIUM') return 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300'
  return 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300'
}

function statusDotClass(severity) {
  if (severity === 'CRITICAL') return 'bg-red-400'
  if (severity === 'HIGH') return 'bg-orange-400'
  if (severity === 'MEDIUM') return 'bg-yellow-400'
  return 'bg-cyan-400'
}

function navButtonClass(active) {
  return active
    ? 'w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-left font-semibold text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08)]'
    : 'w-full rounded-2xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-white/5 hover:text-white'
}

function MiniBars() {
  return (
    <div className="flex h-40 items-end gap-3">
      {chartBars.map((value, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-400 shadow-[0_8px_30px_rgba(34,211,238,0.2)]"
            style={{ height: `${value}%` }}
          />
          <span className="text-xs text-slate-500">D{index + 1}</span>
        </div>
      ))}
    </div>
  )
}

function DonutRing() {
  return (
    <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#22d3ee_0_72%,#1e293b_72%_100%)] p-3 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-950 text-center">
        <span className="text-4xl font-bold text-white">72</span>
        <span className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">Risk</span>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')

  const filteredFindings = useMemo(() => {
    return mockFindings.filter((item) => {
      const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter
      const q = search.toLowerCase()
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.resource.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)

      return matchesSeverity && matchesSearch
    })
  }, [search, severityFilter])

  const Sidebar = () => (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
      <div className="mb-6 rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
            <span className="text-xl">◈</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Project</p>
            <h1 className="text-xl font-bold text-white">OpenStack Scanner</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Modern security dashboard for detecting risky OpenStack misconfigurations.
        </p>
      </div>

      <div className="space-y-2">
        <button className={navButtonClass(page === 'dashboard')} onClick={() => setPage('dashboard')}>
          Dashboard
        </button>
        <button className={navButtonClass(page === 'findings')} onClick={() => setPage('findings')}>
          Findings
        </button>
        <button className={navButtonClass(page === 'reports')} onClick={() => setPage('reports')}>
          Reports
        </button>
        <button className={navButtonClass(page === 'settings')} onClick={() => setPage('settings')}>
          Settings
        </button>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Last Scan</p>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Success
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-400">Completed successfully</p>
        <p className="mt-1 text-sm text-slate-500">23 Apr 2026 • 2m 14s</p>
        <button className="mt-4 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300">
          Run New Scan
        </button>
      </div>
    </div>
  )

  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Security Overview</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Cloud Risk Monitoring Dashboard
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              A polished prototype interface for the OpenStack Cloud Misconfiguration Scanner,
              built to visualize findings, reports, overall exposure, and cloud security status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300">
              Start Scan
            </button>
            <button className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur hover:bg-white/10">
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockStats.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{item.title}</p>
                <h3 className="mt-3 text-4xl font-black text-white">{item.value}</h3>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {item.change}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Threat Activity</h3>
              <p className="mt-1 text-sm text-slate-400">Recent scan intensity across the last 7 days.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              Weekly View
            </span>
          </div>
          <MiniBars />
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Overall Risk</h3>
              <p className="mt-1 text-sm text-slate-400">Current cloud posture summary.</p>
            </div>
            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300">
              High
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 lg:flex-row lg:justify-between">
            <DonutRing />
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-red-400" /> Critical: 1
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-orange-400" /> High: 1
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-yellow-400" /> Medium: 1
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-cyan-400" /> Low: 1
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Top Findings</h3>
              <p className="mt-1 text-sm text-slate-400">Highest-priority issues detected in the latest scan.</p>
            </div>
            <button
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => setPage('findings')}
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {mockFindings.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/25"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${statusDotClass(item.severity)}`} />
                      <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                    <p className="mt-2 text-sm text-slate-500">Resource: {item.resource}</p>
                  </div>
                  <button className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
            <h3 className="text-2xl font-bold text-white">Scanner Status</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span>Status</span>
                <span className="font-semibold text-emerald-300">Ready</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span>Environment</span>
                <span className="font-semibold text-white">OpenStack</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span>Scan Duration</span>
                <span className="font-semibold text-white">2m 14s</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Output</span>
                <span className="font-semibold text-white">JSON / PDF</span>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
            <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
            <div className="mt-5 space-y-3">
              <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-300">
                Start Scan
              </button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10">
                View History
              </button>
              <button
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10"
                onClick={() => setPage('settings')}
              >
                Open Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const FindingsPage = () => (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Findings</h2>
          <p className="mt-1 text-sm text-slate-400">Browse detected cloud misconfigurations.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, resource, category"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/30"
          />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400/30"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-sm text-slate-500">
              <th className="px-4">Severity</th>
              <th className="px-4">Title</th>
              <th className="px-4">Resource</th>
              <th className="px-4">Category</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFindings.map((item) => (
              <tr key={item.id} className="text-sm text-slate-300">
                <td className="rounded-l-2xl border-y border-l border-white/10 bg-slate-950/60 px-4 py-4">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeClass(item.severity)}`}>
                    {item.severity}
                  </span>
                </td>
                <td className="border-y border-white/10 bg-slate-950/60 px-4 py-4 font-semibold text-white">
                  {item.title}
                </td>
                <td className="border-y border-white/10 bg-slate-950/60 px-4 py-4">{item.resource}</td>
                <td className="border-y border-white/10 bg-slate-950/60 px-4 py-4">{item.category}</td>
                <td className="rounded-r-2xl border-y border-r border-white/10 bg-slate-950/60 px-4 py-4">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const ReportsPage = () => (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Reports</h2>
          <p className="mt-1 text-sm text-slate-400">Previously generated scanner outputs.</p>
        </div>
        <button className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
          Generate New Report
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {mockReports.map((report) => (
          <div
            key={report.name}
            className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/25"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {report.date} • {report.type} • {report.size}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  View
                </button>
                <button className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const SettingsPage = () => (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
      <h2 className="text-3xl font-bold text-white">Settings</h2>
      <p className="mt-1 text-sm text-slate-400">Design-stage configuration placeholders.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-white">Scanner Configuration</h3>
          <div className="mt-4 space-y-4">
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="OpenStack API Endpoint"
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Project Name"
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Username"
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-white">Output Preferences</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked /> Save JSON report
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked /> Save PDF report
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" /> Email alerts later
            </label>
          </div>
          <button className="mt-6 rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] p-4 text-white md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <Sidebar />
        <div>
          {page === 'dashboard' && <DashboardPage />}
          {page === 'findings' && <FindingsPage />}
          {page === 'reports' && <ReportsPage />}
          {page === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  )
}
