import React, { useState } from "react";
import "./Menu.scss";
import { Icons } from "../Icons/MenuIcon";
import { MenuProps } from "antd";
import { Menu } from "antd";
import { setActiveRoute, setRoutePath } from "@/stores/Menu.store";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/App.hook";
import { useResize } from "@/utils/resize";
import Icon from "@ant-design/icons";
import { useRedirect } from "@/hooks/Redirect.hook";
type MenuItem = Required<MenuProps>["items"][number];

interface MenuBarProps {
  position: MenuProps["mode"] | undefined;
  menuData?: any;
  onData?: (data: any) => void;
}

/**
 * Sidebar component renders the application's sidebar menu.
 * It uses the Ant Design Menu component and connects to Redux for state management.
 * It dispatches an action to set the active menu item when a menu item is clicked.
 *
 * @returns {JSX.Element} The sidebar JSX element.
 */
const MenuBar: React.FC<MenuBarProps> = ({ position, menuData, onData }) => {
  // const navigate = useNavigate();
  const { redirect } = useRedirect();
  const { routeStore, menuStore, routePath } = useAppSelector(
    (state) => state.MenuReducer
  );
  const menuItemsData = menuStore || menuData

  const dispatch = useDispatch();
  const { isSmallScreen } = useResize(767);

  /* Sends data to parent component */
  const sendDataToParent = (condition: any) => {
    if (onData) {
      onData(condition);
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    const currentRoute: any = routeStore?.find((route) => route.path === e.key);
    dispatch(setRoutePath(e.key));
    dispatch(setActiveRoute(currentRoute));
    isSmallScreen && sendDataToParent(false);
    redirect(e.key);
  };

   const items = menuItemsData
    ?.filter((menu:any) => menu.path || menu.menu_code)
    .map(
      (menu:any): MenuItem => {
        // Only show as submenu if path is empty and has subMenu
        const hasSubMenu = menu?.subMenu?.length > 0;
        const shouldBeGroup = hasSubMenu && !menu.path;
        
        return {
          key: menu.path || menu.menu_code,
          label: menu.menu_code,
          icon: Icons.get(menu.icon_name) ? (
            <Icon component={Icons.get(menu.icon_name)} />
          ) : (
            ""
          ),
          // Only include children if it's a group menu (no path)
          children: shouldBeGroup
            ? menu?.subMenu
                .filter((sub:any) => sub.path || sub.menu_code)
                .map(
                  (sub: any): MenuItem => ({
                    key: sub.path || `${menu.path}-${sub.id}` || sub.menu_code,
                    label: sub.menu_code,
                    icon: Icons.get(sub.icon_name) ? (
                      <Icon component={Icons.get(sub.icon_name)} />
                    ) : (
                      ""
                    ),
                  })
                )
            : undefined,
          // If it has a path but also submenus, don't make it a group
          type: shouldBeGroup ? undefined : 'item'
        };
      }
    );

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleOpenChange = (key: string[]) => {
    setOpenKeys(key);
  };

  return (
    <Menu
      className={`${position === "vertical" ? "cls-menu" : "cls-horizontal-menu"}`}
      mode={position || "vertical"}
      onClick={onClick}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      selectedKeys={routePath ? [routePath] : undefined}
      items={items}
    />
  );
};

export default MenuBar;
