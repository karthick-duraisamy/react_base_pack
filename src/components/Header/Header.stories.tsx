import type { Meta, StoryObj } from "@storybook/react";
import { HeaderItems } from "./Header";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Flex } from "antd";
import ThemeManager from "../ThemeManager/ThemeManager";
import { userReducer } from "@/stores/User.store";
import { service } from "@/services/notification/Notification";
import { within, expect } from "@storybook/test";
import userEvent from "@testing-library/user-event";

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
    [service.reducerPath]: service.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(service.middleware),
  preloadedState: {
    user: {
      user: authenticatedUser,
      isAuthenticated: true,
    },
  },
});

const meta: Meta<typeof HeaderItems> = {
  title: "Components/Header",
  component: HeaderItems,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <Flex justify="end" style={{ height: 85, margin: "20px" }}>
                <Story />
              </Flex>
            </ThemeManager>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **HeaderItems** component renders the right-aligned section of the application header, typically displaying user-related actions and settings.
        Key Features:
        - User Profile Display: Shows logged-in user's name and roles (example: Admin, User).
        - Changes display based on authentication status:
            * If Authenticated: shows profile info and logout option.
            * If Unauthenticated: shows Sign In or Guest view.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeaderItems>;

export const Authenticated: Story = {
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(document.querySelector(".cls-logoImage")).toBeInTheDocument();
    const accessibilityBtn = await canvas.findByText("Accessibility");
    expect(accessibilityBtn).toBeInTheDocument();
    // await userEvent.click(accessibilityBtn);
    await expect(canvas.getByTestId("lang")).toBeInTheDocument();
    await expect(canvas.getByTestId("ThemeButton")).toBeInTheDocument();
    await expect(
      document.querySelector(".cls-notificationBtn")
    ).toBeInTheDocument();
    await expect(
      document.querySelector(".cls-user-dropdown")
    ).toBeInTheDocument();

    // Wait for the element to exist in the DOM
    const userProfileButton = document.querySelector(".cls-user-dropdown");
    expect(userProfileButton).not.toBeNull();

    // Type assertion to HTMLElement
    const buttonElement = userProfileButton as HTMLElement;
    expect(buttonElement).toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Click the button
    await userEvent.click(buttonElement);

    // Verify the dropdown opened
    const dropdownMenu = await document.querySelector('.ant-popover-content');
    expect(dropdownMenu).toBeInTheDocument();

    await expect(canvas.getByText("John Doe")).toBeInTheDocument();
    await expect(canvas.getByText("Admin role")).toBeInTheDocument();
  },
};

export const ThemeSelectorOpen: Story = {
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(document.querySelector(".cls-logoImage")).toBeInTheDocument();
    const accessibilityBtn = await canvas.findByText("Accessibility");
    expect(accessibilityBtn).toBeInTheDocument();
    // await userEvent.click(accessibilityBtn);
    await expect(canvas.getByTestId("lang")).toBeInTheDocument();


    const themeButton = await canvas.findByTestId("ThemeButton");
    expect(themeButton).toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(themeButton);

    await expect(
      document.querySelector(".cls-notificationBtn")
    ).toBeInTheDocument();
    await expect(
      document.querySelector(".cls-user-dropdown")
    ).toBeInTheDocument();

    // Wait for the element to exist in the DOM
    // const userProfileButton = document.querySelector(".cls-user-dropdown");
    // expect(userProfileButton).not.toBeNull();

    // Type assertion to HTMLElement
    // const buttonElement = userProfileButton as HTMLElement;
    // expect(buttonElement).toBeInTheDocument();

    // // Click the button
    // await userEvent.click(buttonElement);

  },
};

export const Unauthenticated: Story = {
  decorators: [
    (Story) => {
      const unauthenticatedStore = configureStore({
        reducer: {
          user: userReducer,
          [service.reducerPath]: service.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(service.middleware),
        preloadedState: {
          user: {
            user: {
              firstName: "",
              lastName: "",
              groups: [],
              email: "",
              id: 0,
              name: "",
            },
            isAuthenticated: false,
          },
        },
      });
      return (
        <Provider store={unauthenticatedStore}>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <Story />
            </ThemeManager>
          </I18nextProvider>
        </Provider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(document.querySelector(".cls-logoImage")).toBeInTheDocument();
    const accessibilityBtn = await canvas.findByText("Accessibility");
    expect(accessibilityBtn).toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(accessibilityBtn);
    await expect(canvas.getByTestId("lang")).toBeInTheDocument();
    await expect(
      document.querySelector(".cls-notificationBtn")
    ).not.toBeInTheDocument();
    await expect(
      document.querySelector(".cls-user-dropdown")
    ).not.toBeInTheDocument();
  },
};
