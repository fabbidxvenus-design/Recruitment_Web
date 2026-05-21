import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdminPage } from '@/lib/auth/server'

export default async function AdminSettingsPage() {
  await requireAdminPage()

  return (
    <AdminShell>
      <section className="admin-page-shell">
        <div className="admin-page-heading"><p>Settings</p><h1>Cài đặt hệ thống</h1></div>
        <form className="admin-editor admin-settings-form">
          <label>Site name<input defaultValue="Fabbi Careers" name="siteName" /></label>
          <label>HR notification email<input defaultValue="hr@example.com" name="hrNotificationEmail" /></label>
          <label>Default language<select defaultValue="vi" name="defaultLocale"><option value="vi">Tiếng Việt</option><option value="jp">日本語</option></select></label>
          <label>SEO title<input defaultValue="Tuyển dụng Fabbi" name="seoTitle" /></label>
          <label>CV policy<textarea defaultValue="CV được lưu trữ riêng tư và chỉ Admin/HR được truy cập." name="cvPolicyTextVi" /></label>
          <p className="admin-error-state">Settings validation error appears here when fields are invalid.</p>
          <button type="submit">Save settings</button>
        </form>
      </section>
    </AdminShell>
  )
}
