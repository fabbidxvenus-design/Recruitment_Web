import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdminPage } from '@/lib/auth/server'

const applications = [
  ['Nguyen Van A', 'Full Stack Engineer', 'new', 'pending'],
  ['Tran Thi B', 'Frontend Engineer', 'reviewing', 'sent'],
  ['Sato Ken', 'Bridge Engineer', 'shortlisted', 'failed']
]

export default async function AdminApplicationsPage() {
  await requireAdminPage()

  return (
    <AdminShell>
      <section className="admin-page-shell">
        <div className="admin-page-heading"><p>Applications</p><h1>Quản lý ứng tuyển</h1></div>
        <section className="admin-panel admin-split-panel">
          <div><h2>Candidate list</h2><table className="admin-table"><thead><tr><th>Candidate</th><th>Position</th><th>Status</th><th>Notification</th></tr></thead><tbody>{applications.map((item) => <tr key={item[0]}><td>{item[0]}</td><td>{item[1]}</td><td><span className="admin-status">{item[2]}</span></td><td>{item[3]}</td></tr>)}</tbody></table></div>
          <aside className="admin-detail-card"><h2>Application detail</h2><p>Candidate metadata, target position, submitted date, and review status.</p><form action="/api/admin/cv/00000000-0000-0000-0000-000000000000" method="get"><button type="submit">Protected CV action</button></form></aside>
        </section>
      </section>
    </AdminShell>
  )
}
