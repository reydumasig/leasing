import Link from 'next/link';
import { Building2, FileText, Home, LayoutGrid, Receipt, Users2, TrendingUp, Map, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/malls', label: 'Malls', icon: Building2 },
  { href: '/units', label: 'Units', icon: LayoutGrid },
  { href: '/units/map', label: 'Unit Map', icon: Map },
  { href: '/tenants', label: 'Tenants', icon: Users2 },
  { href: '/renewals', label: 'Renewals', icon: TrendingUp },
  { href: '/leases', label: 'Leases', icon: FileText },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/payments', label: 'Payments', icon: Receipt },
  { href: '/reports/ar-aging', label: 'AR Aging', icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-[260px_1fr]">
        <aside className="border-r border-border bg-card px-6 py-8">
          <div className="text-lg font-semibold text-primary">MLMS Demo</div>
          <p className="text-sm text-muted-foreground mb-6">Mall Alpha Prototype</p>
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="container-page">
          {children}
        </main>
      </div>
    </div>
  );
}
