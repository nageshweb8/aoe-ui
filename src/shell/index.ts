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
export { AOE_BRAND, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH, TOPBAR_HEIGHT } from './constants';
export { AdminLayout, Sidebar, Topbar } from './layout';
export type { NavItem, NavSection } from './navigation';
export { navigation } from './navigation';
export { Providers } from './providers';
export type { AppDispatch, RootState } from './store';
export {
  setSidebarCollapsed,
  setSidebarOpen,
  store,
  toggleSidebar,
  toggleSidebarCollapse,
  useAppDispatch,
  useAppSelector,
} from './store';
export { darkTheme, lightTheme } from './theme';
