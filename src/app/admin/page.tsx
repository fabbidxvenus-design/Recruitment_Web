import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdminPage } from '@/lib/auth/server'

const metrics = [
  ['Open Jobs', '18', '+3 this week'],
  ['Applications', '246', '+28 new'],
  ['Published News', '42', '6 drafts'],
  ['CV Pending Review', '31', 'Admin only']
]

export default async function AdminDashboardPage() {
  await requireAdminPage()

  return (
    <AdminShell>
      <section className="admin-page-shell">
        <div className="admin-page-heading"><p>Dashboard</p><h1>Recruitment CMS overview</h1></div>
        <div className="admin-metric-grid">
          {metrics.map(([label, value, hint]) => <article className="admin-card" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>)}
        </div>
        <section className="admin-panel">
          <div><h2>Hiring pipeline</h2><p>Applications move from new to reviewing, shortlisted, rejected, or archived.</p></div>
          <div className="admin-chart"><span style={{ height: '38%' }} /><span style={{ height: '72%' }} /><span style={{ height: '52%' }} /><span style={{ height: '84%' }} /></div>
        </section>
      </section>
    </AdminShell>
  )
}
