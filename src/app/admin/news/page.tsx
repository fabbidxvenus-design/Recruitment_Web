import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdminPage } from '@/lib/auth/server'

const news = [
  ['Fabbi Strong Up', 'Published', 'Culture'],
  ['Văn hóa kỹ thuật tại Fabbi', 'Draft', 'Engineering'],
  ['Office Tour', 'Archived', 'Company']
]

export default async function AdminNewsPage() {
  await requireAdminPage()

  return (
    <AdminShell>
      <section className="admin-page-shell">
        <div className="admin-page-heading"><p>News Management</p><h1>Quản lý tin tức</h1></div>
        <section className="admin-panel">
          <div className="admin-panel-header"><h2>Bài viết</h2><button>+ Create News</button></div>
          <table className="admin-table"><thead><tr><th>Title</th><th>Status</th><th>Category</th><th>Actions</th></tr></thead><tbody>{news.map((item) => <tr key={item[0]}><td>{item[0]}</td><td><span className="admin-status">{item[1]}</span></td><td>{item[2]}</td><td>Edit · Publish · Archive</td></tr>)}</tbody></table>
        </section>
        <form className="admin-editor"><h2>News editor form</h2><label>Title VI<input defaultValue="Fabbi Strong Up" /></label><label>Slug<input defaultValue="fabbi-strong-up" /></label><label>Body<textarea defaultValue="Nội dung tin tức" /></label></form>
      </section>
    </AdminShell>
  )
}
