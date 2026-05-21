import '../admin.css'

export default function AdminLoginPage() {
  return (
    <main className="admin-login-body">
      <section className="admin-login-card">
        <div className="admin-brand-mark">F</div>
        <p className="admin-eyebrow">Recruitment CMS</p>
        <h1>Đăng nhập CMS</h1>
        <p>Admin Login</p>
        <form action="/api/admin/auth/login" className="admin-form" method="post">
          <label>Email<input name="email" required type="email" /></label>
          <label>Password<input name="password" required type="password" /></label>
          <button type="submit">Đăng nhập</button>
        </form>
      </section>
    </main>
  )
}
