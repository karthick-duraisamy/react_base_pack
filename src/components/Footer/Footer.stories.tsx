import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from "./Footer";
import { expect, within } from "@storybook/test";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Provider } from "react-redux";
import { store } from "@/stores/Store";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **Footer** component provides a consistent application-wide footer section typically placed at the bottom of every page.

        Key Features:
        - Company Branding: Displays a default message like "Powered by Infiniti Software Solutions" along with copyright.
        - Designed to stick to the bottom even for short content pages.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div style={{ padding: "20px" }}>
            <Footer />
          </div>
        </ThemeManager>
      </I18nextProvider>
    </Provider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Properly await each assertion
    await expect(
      canvas.getByText(/Powered by Infiniti Software Solutions/i)
    ).toBeInTheDocument();
    await expect(canvas.getByText(/Copyright/i)).toBeInTheDocument();
  },
};

export const WithPageContent: Story = {
  render: () => (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div
            style={{ display: "flex", flexDirection: "column", minHeight: 300 }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ padding: "20px" }}>
                This is example page content above the footer
              </p>
            </div>
            <Footer />
          </div>
        </ThemeManager>
      </I18nextProvider>
    </Provider>
  ),
  name: "With Page Content",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Properly await each assertion
    await expect(canvas.getByText(/example page content/i)).toBeInTheDocument();
    await expect(
      canvas.getByText(/Powered by Infiniti Software Solutions/i)
    ).toBeInTheDocument();
  },
};
