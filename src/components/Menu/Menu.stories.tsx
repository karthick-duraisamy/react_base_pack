import type { Meta, StoryObj } from '@storybook/react-vite';
import MenuBar from "./Menu";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import React from "react";
import { expect, within, userEvent } from '@storybook/test';

// Mock menu data with submenus
const mockMenuServiceData = [
  {
    menu_code: "Dashboard",
    path: "/dashboard",
    icon_name: "FdDashboardIcon",
    subMenu: [],
  },
  {
    menu_code: "Disruption list",
    path: "",
    icon_name: "FdDisruptionList",
    subMenu: [
      {
        id: 20,
        menu_code: "Adhoc",
        parent_menu: "Disruption list",
        path: "/adhoc",
        icon_name: "FdAdhoc",
      },
      {
        id: 21,
        menu_code: "Pre-planned",
        parent_menu: "Disruption list",
        path: "/prePlanned",
        icon_name: "FdPreplanned",
      },
    ],
  },
  {
    menu_code: "Settings",
    path: "",
    icon_name: "FdSettings",
    subMenu: [
      {
        id: 13,
        menu_code: "Email",
        parent_menu: "Settings",
        path: "/mailer",
        icon_name: "FdEmail",
      },
      {
        id: 24,
        menu_code: "Score",
        parent_menu: "Settings",
        path: "/scoreList",
        icon_name: "FdScore",
      },
      {
        id: 25,
        menu_code: "Rules & Policy",
        parent_menu: "Settings",
        path: "/policy",
        icon_name: "FdRulesAndPolicy",
      },
      {
        id: 26,
        menu_code: "Auto reaccommodation",
        parent_menu: "Settings",
        path: "/comingSoon",
        icon_name: "FdAutoReaccommodation",
      },
      {
        id: 27,
        menu_code: "Queue",
        parent_menu: "Settings",
        path: "/queueList",
        icon_name: "FdQueue",
      },
    ],
  },
  {
    menu_code: "Report",
    path: "",
    icon_name: "FdPolicy",
    subMenu: [
      {
        id: 27,
        menu_code: "Custom report",
        parent_menu: "Report",
        path: "/customReport",
        icon_name: "FdCustomReport",
      },
      {
        id: 28,
        menu_code: "BI Dashboard",
        parent_menu: "Report",
        path: "/biDashboard",
        icon_name: "FdBIDashboard",
      },
    ],
  },
  {
    menu_code: "Users",
    path: "/users",
    icon_name: "FdUser",
    subMenu: [],
  },
  {
    menu_code: "Help",
    path: "",
    icon_name: "FdHelp",
    subMenu: [
      {
        id: 29,
        menu_code: "FAQ",
        parent_menu: "Help",
        path: "/faq",
        icon_name: "FdFAQ",
      },
      {
        id: 30,
        menu_code: "User Guide",
        parent_menu: "Help",
        path: "/comingSoon",
        icon_name: "FdUserGuide",
      },
    ],
  },
];

// Mock Icons.get
const Icons = {
  get: (name: string) => () => <span data-testid={`icon-${name}`} />,
};

// Mock useRedirect hook
const useRedirect = () => ({
  currentPath: "/dashboard",
  isCurrentPathEqual: (path: string) => path === "dashboard",
  getEncryptedPath: (path: string) => path,
});

// Mock useAppSelector hook
const useAppSelector = (selector: any) =>
  selector({ MenuReducer: { menuServiceData: mockMenuServiceData } });

// Mock useLocalStorage hook
const useLocalStorage = () => [null, () => {}, () => {}];

// Create a context for each custom hook
const IconsContext = React.createContext(Icons);
const RedirectContext = React.createContext(useRedirect());
const AppSelectorContext = React.createContext(useAppSelector);
const LocalStorageContext = React.createContext(useLocalStorage);

// Custom Providers to override hooks in the component tree
const CustomHooksProvider = ({ children }: { children: React.ReactNode }) => {
  // Patch the hooks onto window so your component can import and use them
  (window as any).Icons = Icons;
  (window as any).useRedirect = useRedirect;
  (window as any).useAppSelector = useAppSelector;
  (window as any).useLocalStorage = useLocalStorage;
  return (
    <IconsContext.Provider value={Icons}>
      <RedirectContext.Provider value={useRedirect()}>
        <AppSelectorContext.Provider value={useAppSelector}>
          <LocalStorageContext.Provider value={useLocalStorage}>
            {children}
          </LocalStorageContext.Provider>
        </AppSelectorContext.Provider>
      </RedirectContext.Provider>
    </IconsContext.Provider>
  );
};

// Mock Redux store
const store = configureStore({
  reducer: {
    MenuReducer: (state = {
      routeStore: [],
      menuStore: mockMenuServiceData,
      routePath: "",
    }) => state,
  },
});

// Storybook Meta
const meta: Meta<typeof MenuBar> = {
  title: "Components/MenuBar",
  component: MenuBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **SideBar** component renders the primary navigation menu for the application. It supports both vertical and horizontal layouts and dynamically builds its structure based on the menu configuration fetched from the store.

        Key Features:
        - Displays main menus and nested submenus based on the provided \`menuData\` or Redux store.
        - Icon Support: Integrates with the application's icon set using dynamic icon names like \`FdDashboardIcon\`, \`FdUser\`, etc.
        - Navigation Handling: Uses internal routing logic (via a custom \`useRedirect\` hook) to navigate between pages.
        - Stateful Menu Open/Collapse: Maintains expanded/collapsed state for menu sections with submenus.
        - Custom Positioning: Supports vertical (sidebar) or horizontal (top bar) layouts controlled via the \`position\` prop.
        - Custom Callbacks: The \`onData\` prop allows parent components to receive menu interaction data.

        Common Use Cases:
        - Application-wide sidebar or header navigation.
        - Admin panels with multi-level menu navigation.
        - Dashboards requiring role-based menu visibility.
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Position of the menu",
    },
    menuData: {
      control: {
        type: "object",
      },
      description: "Menu data passed as props",
    },
    onData: {
      action: "onData",
      description: "Callback when menu data is sent to parent",
    },
  },
};
export default meta;
type Story = StoryObj<typeof MenuBar>;

// Provider Wrapper
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
            <CustomHooksProvider>{children}</CustomHooksProvider>
        </ThemeManager>
      </I18nextProvider>
    </BrowserRouter>
  </Provider>
);

export const Vertical: Story = {
  render: (args) => (
    <AllProviders>
      <div style={{ height: 500, width: 88 }}>
        <MenuBar {...args} />
      </div>
    </AllProviders>
  ),
  args: {
    position: "vertical",
  },
  name: "Vertical",
};

export const Horizontal: Story = {
  render: (args) => (
    <AllProviders>
      <div style={{ height: 500, width: 900 }}>
        <MenuBar {...args} />
      </div>
    </AllProviders>
  ),
  args: {
    position: "horizontal",
  },
  name: "Horizontal",
};

export const VerticalMenuOpen: Story = {
  render: (args) => (
    <AllProviders>
      <div style={{ height: 500, width: 88 }}>
        <MenuBar {...args} />
      </div>
    </AllProviders>
  ),
  args: {
    position: "vertical",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test that top-level menu items are visible
    expect(canvas.getByText('Dashboard')).toBeInTheDocument();
    expect(canvas.getByText('Disruption list')).toBeInTheDocument();
    
    // Test submenu hover interaction
    const Settings = canvas.getByText('Settings');
    await userEvent.hover(Settings);
  }
};

export const HorizontalMenuOpen: Story = {
  render: (args) => (
    <AllProviders>
      <div style={{ height: 500, width: 900 }}>
        <MenuBar {...args} />
      </div>
    </AllProviders>
  ),
  args: {
    position: "horizontal",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test that top-level menu items are visible
    expect(canvas.getByText('Dashboard')).toBeInTheDocument();
    expect(canvas.getByText('Disruption list')).toBeInTheDocument();
    
    // Test submenu hover interaction
    const disruptionMenu = canvas.getByText('Disruption list');
    await userEvent.hover(disruptionMenu);
    
    // // Verify submenu items appear
    // await waitFor(() => {
    //   expect(canvas.getByText('Adhoc')).toBeInTheDocument();
    //   expect(canvas.getByText('Pre-planned')).toBeInTheDocument();
    // });
  }
};
