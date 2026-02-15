/**
 * @module shell
 *
 * Application Shell — owns the chrome that wraps every page:
 *  - Layout (Sidebar, Topbar, AdminLayout)
 *  - Providers (Redux, React Query, Theme)
 *  - Navigation configuration
 *  - Theme definitions
 *  - Global store (layout slice)
 *  - Brand constants
 *
 * Rules:
 *  - Shell may import from `@shared`.
 *  - Shell must NEVER import from `@modules`.
 *  - Only route pages (`src/app/`) compose shell + modules together.
 */
export { AdminLayout, Sidebar, Topbar } from './layout';
export { Providers } from './providers';
export { navigation } from './navigation';
export type { NavItem, NavSection } from './navigation';
export { lightTheme, darkTheme } from './theme';
export {
  store,
  useAppDispatch,
  useAppSelector,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setSidebarCollapsed,
} from './store';
export type { RootState, AppDispatch } from './store';
export {
  AOE_BRAND,
  SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  TOPBAR_HEIGHT,
} from './constants';
