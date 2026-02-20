import {
  AlertTriangle,
  CopyPlus,
  FileBarChart,
  FileCheck,
  Footprints,
  HelpCircle,
  LayoutDashboard,
  type LucideIcon,
  Receipt,
  ScrollText,
  Settings,
  Table2,
} from 'lucide-react';

export interface NavItem {
  readonly title: string;
  readonly path: string;
  readonly icon: LucideIcon;
  readonly badge?: string;
  readonly children?: readonly NavItem[];
}

export interface NavSection {
  readonly label?: string;
  readonly items: readonly NavItem[];
}

export const navigation: readonly NavSection[] = [
  {
    label: 'Main',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { title: 'Walk Throughs', path: '/walk-throughs', icon: Footprints },
      { title: 'Expenses', path: '/expenses', icon: Receipt },
      { title: 'Rent Roll', path: '/rent-roll', icon: ScrollText },
    ],
  },
  {
    label: 'Certificate of Insurance',
    items: [{ title: 'COI Verification', path: '/certificate-of-insurance', icon: FileCheck }],
  },
  {
    label: 'Tools',
    items: [
      { title: 'Error Checking', path: '/error-checking', icon: AlertTriangle },
      { title: 'Report Options', path: '/report-options', icon: FileBarChart },
    ],
  },
  {
    label: 'Components',
    items: [{ title: 'Data Table', path: '/ui-components', icon: Table2 }],
  },
  {
    label: 'Administration',
    items: [
      { title: 'System Settings', path: '/system-settings', icon: Settings },
      { title: 'Copy / Import', path: '/copy-import', icon: CopyPlus },
      { title: 'Help Topics', path: '/help-topics', icon: HelpCircle },
    ],
  },
] as const;
