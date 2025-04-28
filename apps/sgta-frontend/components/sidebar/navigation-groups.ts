import { navigationItems, NavigationItem } from "./navigation-items";

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export function getNavigationGroups(userRoles: string[]): NavigationGroup[] {
  const groups: NavigationGroup[] = [];

  if (navigationItems.common && navigationItems.common.length > 0) {
    groups.push({
      label: "General",
      items: navigationItems.common,
    });
  }

  userRoles.forEach((role) => {
    const roleItems = navigationItems[role as keyof typeof navigationItems];
    if (roleItems && roleItems.length > 0) {
      groups.push({
        label: `Como ${role}`,
        items: roleItems,
      });
    }
  });

  return groups;
}
