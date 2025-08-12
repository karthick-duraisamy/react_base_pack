import type { Meta, StoryObj } from "@storybook/react";
import DescriptionHeader, { ItineraryHeaderProps } from "./DescriptionHeader";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/stores/User.store";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Typography } from "antd";
import { withNotifications } from "../../../.storybook/mockNotification";
const { Text, Title } = Typography;

const authenticatedUser = {
  firstName: "John",
  lastName: "Doe",
  groups: ["fdms_admin_role"],
  email: "johndoe@email.com",
  id: 1,
  name: "John Doe",
};

const mockStore = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      user: authenticatedUser,
      isAuthenticated: true,
    },
  },
});

const mockHeaderData: ItineraryHeaderProps["data"] = {
  title: "Flight Itinerary",
  description: "Detailed view of your selected flight",
  breadcrumbProps: [
    { path: "/", title: "Home", breadcrumbName: "home", key: "home" },
    { path: "/about", title: "About", breadcrumbName: "about", key: "about" },
    {
      path: "/contact",
      title: "Contact",
      breadcrumbName: "contact",
      key: "contact",
    },
  ],
};

const meta: Meta<typeof DescriptionHeader> = {
  title: "Components/DescriptionHeader",
  component: DescriptionHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **DescriptionHeader** component provides a consistent page header section with support for title, description, breadcrumb navigation, and optional primary and secondary detail fields (like PNR, Date of booking, etc).

        Key Features:
        - Displays customizable page titles and descriptions.
        - Accepts breadcrumb data to render navigational breadcrumbs at the top.
        - Allows showing key-value highlights (like PNR, Date of booking) below the title.
        - User-Aware Rendering: Can adjust display based on user authentication (example: showing more info for unauthenticated users).
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DescriptionHeader>;

export const Default: Story = {
  args: {
    data: mockHeaderData,
  },
  decorators: [
    withNotifications,
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <div style={{ padding: 15 }}>
                <Story />
              </div>
            </ThemeManager>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Flight Itinerary/i)).toBeInTheDocument();
    // Get the hover icon element
    const hoverElement: HTMLSpanElement | null =
      document.querySelector(".Infi-15_Info");
    if (hoverElement) {
      // Simulate hover using mouseEnter/mouseLeave
      await userEvent.hover(hoverElement);

      // Verify hover effects
      await waitFor(
        () => {
          expect(hoverElement).toHaveClass("ant-tooltip-open");
        },
        { timeout: 1000 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    (window as any).notification.info({
      message: <Title level={5}>Page Description</Title>,
      description: <Text>Hovering shows page description in detail.</Text>,
      placement: "topRight",
      duration: 5,
    });
  },
};

const unauthenticatedUser = {
  firstName: "",
  lastName: "",
  groups: [],
  email: "",
  id: 0,
  name: "",
};

const unauthMockStore = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      user: unauthenticatedUser,
      isAuthenticated: true,
    },
  },
});

const unauthMockHeaderData: ItineraryHeaderProps["data"] = {
  title: "Flight Itinerary",
  description: "Detailed view of your selected flight",
  primaryHeading: "PNR",
  primaryValue: "ABC123",
  secondaryHeading: "Date of booking",
  secondaryValue: "July 01, 2025",
  breadcrumbProps: [
    { path: "/", title: "Home", breadcrumbName: "home", key: "home" },
    { path: "/about", title: "About", breadcrumbName: "about", key: "about" },
    {
      path: "/contact",
      title: "Contact",
      breadcrumbName: "contact",
      key: "contact",
    },
  ],
};

export const Unauthenticated: Story = {
  args: {
    data: unauthMockHeaderData,
  },
  decorators: [
    withNotifications,
    (Story) => (
      <Provider store={unauthMockStore}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <div style={{ padding: 15 }}>
                <Story />
              </div>
            </ThemeManager>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Flight Itinerary/i)).toBeInTheDocument();
    await expect(canvas.getByText(/ABC123/i)).toBeInTheDocument();
    await expect(canvas.getByText(/July 01, 2025/i)).toBeInTheDocument();
  },
};
