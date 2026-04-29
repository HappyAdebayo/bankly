'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Send,
  Download,
  PiggyBank,
  History,
  FileCheck,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Transfer',
    href: '/dashboard/transfer',
    icon: <Send className="w-5 h-5" />,
  },
  {
    label: 'Withdraw',
    href: '/dashboard/withdraw',
    icon: <Download className="w-5 h-5" />,
  },
  {
    label: 'Savings',
    href: '/dashboard/savings',
    icon: <PiggyBank className="w-5 h-5" />,
  },
  {
    label: 'Transactions',
    href: '/dashboard/transactions',
    icon: <History className="w-5 h-5" />,
  },
  {
    label: 'KYC',
    href: '/dashboard/kyc',
    icon: <FileCheck className="w-5 h-5" />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-primary text-primary-foreground min-h-screen flex flex-col border-b md:border-b-0 md:border-r">
      {/* Logo / Branding */}
      <div className="p-6 border-b border-primary-foreground/20">
        <h1 className="text-2xl font-bold">Bankly</h1>
        <p className="text-sm opacity-80">Banking Demo</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-foreground/20 text-primary-foreground font-medium'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-foreground/20">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
