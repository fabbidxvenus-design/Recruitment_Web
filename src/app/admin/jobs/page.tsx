import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdminPage } from '@/lib/auth/server'

const jobs = [
  ['Full Stack Engineer', 'Engineering', 'Published', 'Hà Nội'],
  ['Frontend Engineer', 'Frontend', 'Draft', 'Đà Nẵng'],
  ['Bridge Engineer', 'Delivery', 'Archived', 'Tokyo']
]

export default async function AdminJobsPage() {
  await requireAdminPage()

  return (
    <AdminShell>
      <section className="admin-page-shell">
        <div className="admin-page-heading"><p>Jobs Management</p><h1>Quản lý tin tuyển dụng</h1></div>
        <section className="admin-panel">
          <div className="admin-panel-header"><h2>Danh sách jobs</h2><button>+ Create Job</button></div>
          <table className="admin-table"><thead><tr><th>Title</th><th>Department</th><th>Status</th><th>Location</th><th>Actions</th></tr></thead><tbody>{jobs.map((job) => <tr key={job[0]}><td>{job[0]}</td><td>{job[1]}</td><td><span className="admin-status">{job[2]}</span></td><td>{job[3]}</td><td>Edit · Publish · Archive</td></tr>)}</tbody></table>
        </section>
        <form className="admin-editor"><h2>Editor form</h2><label>Title VI<input defaultValue="Full Stack Engineer" /></label><label>Slug<input defaultValue="full-stack-engineer" /></label><label>Description<textarea defaultValue="Mô tả công việc" /></label></form>
      </section>
    </AdminShell>
  )
}
