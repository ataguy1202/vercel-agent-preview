'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="h-14 border-b border-border-default flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                <path d="M4.5 2.5l3.5 3.5-3.5 3.5" />
              </svg>
            )}
            {crumb.href ? (
              <Link href={crumb.href} className="text-text-secondary hover:text-text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text-primary">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-bg-100 border border-border-default rounded-md px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
            <circle cx="6" cy="6" r="4.5" />
            <path d="M9.5 9.5L13 13" />
          </svg>
          <span className="text-sm text-text-tertiary">Search previews...</span>
          <span className="text-[10px] text-text-tertiary border border-border-default rounded px-1 ml-4">⌘K</span>
        </div>

        {/* Notification bell */}
        <button className="relative p-1.5 text-text-secondary hover:text-text-primary transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1.5a4 4 0 0 0-4 4v3l-1.5 2h11L12 8.5v-3a4 4 0 0 0-4-4z" />
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-blue rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-bg-300 border border-border-default" />
      </div>
    </header>
  );
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === '/') return [{ label: 'Previews' }];
  if (pathname === '/agents') return [{ label: 'Agents' }];
  if (pathname.startsWith('/preview/')) {
    return [
      { label: 'Previews', href: '/' },
      { label: 'Preview Detail' },
    ];
  }
  return [{ label: 'Previews' }];
}
