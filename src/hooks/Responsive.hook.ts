import { Grid } from "antd";
import type { Breakpoint } from "antd";

/**
 * Custom hook to get the current active screen size breakpoint from Ant Design's Grid system
 * @returns {Breakpoint | undefined} The active screen size breakpoint or `undefined` if none is active
 */
export const useMediaSize = (): Breakpoint | undefined => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  // Get all breakpoints in order from smallest to largest
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  // Find the last active breakpoint in the ordered list
  const activeBreakpoint = breakpointOrder.reduce<Breakpoint | undefined>(
    (lastActive, breakpoint) => screens[breakpoint] ? breakpoint : lastActive,
    undefined
  );

  return activeBreakpoint;
};