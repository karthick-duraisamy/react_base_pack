import type { Meta, StoryObj } from '@storybook/react-vite';
import { Theme } from "./Theme";
import ThemeManager from "../ThemeManager/ThemeManager";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { screen, waitFor, expect } from '@storybook/test';

// Mock implementations
const mockUseTheming = () => ({
  changeTheme: (theme: string) => console.log(`Theme changed to ${theme}`),
});

const mockUseLocalStorage = (key: string) => {
  const storage: Record<string, string> = {
    theme: "default",
  };
  return [storage[key], () => {}];
};

const meta: Meta<typeof Theme> = {
  title: "Components/Theme",
  component: Theme,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div
            style={{ padding: "20px", background: "var(--t-body-background)" }}
          >
            <Story />
          </div>
        </ThemeManager>
      </I18nextProvider>
    ),
  ],
  parameters: {
    mocks: {
      useTheming: mockUseTheming,
      useLocalStorage: mockUseLocalStorage,
    },
    docs: {
      description: {
        component: `The **Theme** component allows users to switch between different UI themes, such as **Light** and **Dark** modes.

        Key Features:
        - Theme Switching UI: Displays theme options as radio buttons (e.g., Light, Dark).
        - Uses local storage (or a similar mechanism) to remember the user's last selected theme.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Theme>;

export const Default: Story = {
  parameters: {
    mocks: {
      useLocalStorage: () => ["default", () => {}],
    },
  },
  play: async () => {
    // Wait for the Light theme radio button to appear
    const lightLabel = await screen.findByText("Light");
    const lightRadio = lightLabel.closest("label")?.querySelector('input[type="radio"]') as HTMLInputElement;

    // Wait for the Dark theme radio button
    const darkLabel = await screen.findByText("Dark");
    const darkRadio = darkLabel.closest("label")?.querySelector('input[type="radio"]') as HTMLInputElement;

    // 🧪 Assertions
    await waitFor(() => {
      expect(lightRadio).toBeInTheDocument();
      expect(lightRadio).toBeChecked();

      expect(darkRadio).toBeInTheDocument();
      expect(darkRadio).not.toBeChecked();
    });
  },

};
