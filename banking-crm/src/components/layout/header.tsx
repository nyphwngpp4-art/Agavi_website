'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/prospects': 'Prospects',
  '/prospects/new': 'New Prospect',
  '/prospects/import': 'Import Prospects',
  '/pipeline': 'Pipeline',
  '/cadences': 'Cadences',
  '/cadences/new': 'New Cadence',
  '/rollout': 'Weekly Rollout',
  '/exports': 'Exports',
}

export function Header() {
  const pathname = usePathname()

  // Match exact or closest parent path
  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles)
      .reverse()
      .find(([path]) => pathname.startsWith(path) && path !== '/')?.[1] ||
    'Prospect CRM'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-dark-border bg-dark-bg/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </header>
  )
}
