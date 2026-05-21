import Link from 'next/link'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: '◆' },
  { href: '/admin/jobs', label: 'Jobs Management', icon: '■' },
  { href: '/admin/news', label: 'News Management', icon: '▣' },
  { href: '/admin/applications', label: 'Applications', icon: '▤' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' }
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-body">
      <aside className="admin-sidebar">
        <div className="admin-logo"><span>F</span><div><strong>Recruitment CMS</strong><small>Admin Portal</small></div></div>
        <Link className="admin-primary-action" href="/admin/jobs">+ Post New Job</Link>
        <nav className="admin-nav" aria-label="CMS navigation">
          {adminNav.map((item) => <Link href={item.href} key={item.href}><span>{item.icon}</span>{item.label}</Link>)}
        </nav>
        <Link className="admin-logout" href="/admin/login">Logout</Link>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><input aria-label="Search CMS" placeholder="Search..." /><div className="admin-avatar">AD</div></header>
        {children}
      </main>
    </div>
  )
}
