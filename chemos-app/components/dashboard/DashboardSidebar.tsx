'use client';

import Link from 'next/link';

export type DashboardModule = 'overview' | 'procurement' | 'scm' | 'finance' | 'research';

interface DashboardSidebarProps {
  activeModule: DashboardModule;
  onModuleChange: (m: DashboardModule) => void;
}

const NAV_MAIN: { id: DashboardModule; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'procurement',
    label: 'Procurement',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: 'scm',
    label: 'SCM Intelligence',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const NAV_INTEL: { id: DashboardModule; label: string; icon: React.ReactNode }[] = [
  {
    id: 'finance',
    label: 'Finance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    id: 'research',
    label: 'Research & Analysis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ activeModule, onModuleChange }: DashboardSidebarProps) {
  return (
    <aside className="db-sidebar">
      {/* Main nav */}
      <div className="db-sb-section">
        <div className="db-sb-label">Main</div>
        {NAV_MAIN.map((item) => (
          <button
            key={item.id}
            className={`db-sb-item${activeModule === item.id ? ' active' : ''}`}
            onClick={() => onModuleChange(item.id)}
          >
            <span className="db-sb-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Intelligence nav */}
      <div className="db-sb-section">
        <div className="db-sb-label">Intelligence</div>
        {NAV_INTEL.map((item) => (
          <button
            key={item.id}
            className={`db-sb-item${activeModule === item.id ? ' active' : ''}`}
            onClick={() => onModuleChange(item.id)}
          >
            <span className="db-sb-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Form shortcuts */}
      <div className="db-sb-section">
        <div className="db-sb-label">Forms</div>
        <Link href="/" className="db-sb-item" style={{ display:'flex', textDecoration:'none' }}>
          <span className="db-sb-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </span>
          Purchase Form
        </Link>
        <Link href="/sales" className="db-sb-item" style={{ display:'flex', textDecoration:'none' }}>
          <span className="db-sb-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </span>
          Sale Form
        </Link>
      </div>

      <div className="db-sb-spacer" />

      <div className="db-sb-footer">
        <div className="db-sb-footer-text">Sumairo ChemOS™ v3.2<br />© 2026 Sumairo</div>
      </div>
    </aside>
  );
}
