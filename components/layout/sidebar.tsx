'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Previews',
    href: '/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Agents',
    href: '/agents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen bg-bg-000 border-r border-border-default flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center gap-3 border-b border-border-default">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 76 65" fill="white">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="font-semibold text-sm text-text-primary">Agent Preview</span>
        </Link>
        <span className="text-[10px] font-medium bg-accent-blue/15 text-accent-blue-light px-1.5 py-0.5 rounded">
          BETA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 mb-1',
                isActive
                  ? 'bg-bg-200 text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-200'
              )}
            >
              <span className={cn(isActive ? 'text-text-primary' : 'text-text-tertiary')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user section */}
      <div className="px-4 py-3 border-t border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-xs font-medium text-white">
            AP
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-text-primary">Agent Platform</span>
            <span className="text-xs text-text-tertiary">Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
