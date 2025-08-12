import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeChanger } from "./ThemeChanger";
import ThemeManager from "../ThemeManager/ThemeManager";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/stores/Store";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { within, expect, userEvent, waitFor, screen } from '@storybook/test';

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: (key: string) => {
    const storage: Record<string, string> = {
      theme: "default",
      layout: "HomeLayout",
    };
    return storage[key] || null;
  },
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

const mockSessionStorage = {
  getItem: (key: string) => {
    const storage: Record<string, string> = {
      airlineCode: "VA",
    };
    return storage[key] || null;
  },
  setItem: (_key: string, _value: string) => {},
};

const meta: Meta<typeof ThemeChanger> = {
  title: "Components/ThemeChanger",
  component: ThemeChanger,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ThemeManager>
                <div style={{ padding: "20px" }}>
                  <Story />
                </div>
              </ThemeManager>
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      );
    },
  ],
  parameters: {
    mockData: {
      localStorage: mockLocalStorage,
      sessionStorage: mockSessionStorage,
    },
    docs: {
      description: {
        component: `The **ThemeChanger** component provides a centralized UI for users to customize the look and feel of the application. It allows users to switch between **themes**, **layouts**, and **airline-specific styles**.

        Key Features:
        - Theme Selection: Choose between different UI themes like Default and Dark mode.
        - Layout Selection: Allows switching between layout types like Horizontal and Vertical.
        - Airline Theme Selection: Supports airline branding (e.g., Voyageraid, Gulf Air) for multi-airline deployments.
        - Drawer-Based UI: Opens a sliding panel (Drawer) for easy access to theme and layout controls.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeChanger>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify theme button exists
    const themeButton = await canvas.findByTestId("ThemeButton");
    expect(themeButton).toBeInTheDocument();

  },
};

export const WithDrawerOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the drawer by clicking the theme button in the canvas
    const themeButton = await canvas.findByTestId("ThemeButton");
    await userEvent.click(themeButton);

    // Wait for drawer content to appear from the portal
    await waitFor(() => {
      expect(screen.getByText("Theme")).toBeInTheDocument();
    });

    // check for layout options
    await expect(screen.getByText("Select Layout")).toBeInTheDocument();
    await expect(screen.getByLabelText("Horizontal layout")).toBeInTheDocument();
    await expect(screen.getByLabelText("Vertical layout")).toBeInTheDocument();

    // check for airline theme
    await expect(screen.getByText("Airline theme")).toBeInTheDocument();
  },
};