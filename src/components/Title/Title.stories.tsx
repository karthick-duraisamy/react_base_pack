import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormTitle } from "./Title";
import ThemeManager from "../ThemeManager/ThemeManager";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { within, expect } from "@storybook/test";
import { store } from '@/stores/Store';
import { Provider } from 'react-redux';

// Mock implementation for useRedirect
const mockUseRedirect = () => ({
  isCurrentPathEqual: (path: string) => path === "viewPnrInfo",
});

const meta: Meta<typeof FormTitle> = {
  title: "Components/FormTitle",
  component: FormTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **FormTitle** component is a reusable header section typically used at the top of forms, pages, or sections in the application. It supports displaying a **main title**, an optional **subtitle**, and allows applying different CSS class styles for size and emphasis.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <div style={{ padding: "20px" }}>
                <Story />
              </div>
            </ThemeManager>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
  argTypes: {
    title: {
      control: "text",
      description: "Main title text",
    },
    subTitle: {
      control: "text",
      description: "Subtitle text",
    },
    clsName: {
      control: "select",
      options: ["title", "large-title", "small-title"],
      description: "CSS class name for styling",
    },
    testId: {
      control: "text",
      description: "Test ID for testing purposes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormTitle>;

export const Default: Story = {
  args: {
    title: "Main title text",
    subTitle: "Subtitle text",
  },
  parameters: {
    // Mock the useRedirect hook
    reactRouter: {
      routePath: "/",
    },
    hooks: {
      useRedirect: mockUseRedirect,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading")).toBeInTheDocument();
    await expect(canvas.getByText("Main title text")).toBeInTheDocument();
    await expect(canvas.getByText("Subtitle text")).toBeInTheDocument();
  },
};
