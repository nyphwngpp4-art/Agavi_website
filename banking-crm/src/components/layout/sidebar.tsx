'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Kanban,
  Zap,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prospects', label: 'Prospects', icon: Building2 },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/cadences', label: 'Cadences', icon: Zap },
  { href: '/rollout', label: 'Rollout', icon: Users },
  { href: '/exports', label: 'Exports', icon: Download },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-dark-border bg-dark-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo / brand area */}
      <div className="flex h-14 items-center border-b border-dark-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-maroon text-xs font-bold text-white">
              CB
            </div>
            <span className="text-sm font-semibold text-white">
              Prospect CRM
            </span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded bg-maroon text-xs font-bold text-white">
            CB
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-maroon/15 text-maroon-300'
                  : 'text-gray-400 hover:bg-dark-hover hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 left-0 right-0 mx-auto flex h-6 w-6 items-center justify-center rounded border border-dark-border bg-dark-elevated text-gray-500 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  )
}
