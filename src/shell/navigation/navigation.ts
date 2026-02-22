import {
  AlertTriangle,
  Bell,
  Building2,
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
  Shield,
  Users,
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
    items: [
      { title: 'COI Dashboard', path: '/certificate-of-insurance/dashboard', icon: Shield },
      { title: 'Vendors', path: '/certificate-of-insurance/vendors', icon: Users },
      { title: 'COI Tracking', path: '/certificate-of-insurance/tracking', icon: FileCheck },
      { title: 'Buildings', path: '/certificate-of-insurance/buildings', icon: Building2 },
      { title: 'Reports', path: '/certificate-of-insurance/reports', icon: FileBarChart },
      { title: 'Notifications', path: '/certificate-of-insurance/notifications', icon: Bell },
      { title: 'COI Settings', path: '/certificate-of-insurance/settings', icon: Settings },
    ],
  },
  {
    label: 'Tools',
    items: [
      { title: 'Error Checking', path: '/error-checking', icon: AlertTriangle },
      { title: 'Report Options', path: '/report-options', icon: FileBarChart },
    ],
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
