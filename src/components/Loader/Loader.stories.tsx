import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";
import { Loader } from "./Loader";
import { I18nextProvider } from "react-i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import i18n from "i18next";

// Wrapper component to apply global providers (i18n, etc.)
const withWrapper = (StoryComponent: any) => (
  <I18nextProvider i18n={i18n}>
    <ThemeManager>
      <div style={{ height: 125 }}>
        <StoryComponent />
      </div>
    </ThemeManager>
  </I18nextProvider>
);

const meta: Meta<typeof Loader> = {
  title: "Components/Loader",
  component: Loader,
  decorators: [withWrapper],
  args: {
    fallback: true,
  },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **Loader** component displays a loading indicator, typically shown during asynchronous data fetching or when waiting for user actions to complete.

        Key Features:
        - Controlled via the \`fallback\` prop. If \`fallback=true\`, the loader is visible; if false, it hides.
        - Displays a loading message such as "Please wait..." below the loader icon or GIF.

        Common Use Cases:
        - Showing a spinner while fetching API data
        - Indicating loading state during page transitions
        - Wrapping lazy-loaded components
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Loader>;

// Default story (Loader visible)
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = await canvas.findByTestId("loader");
    await expect(loader).toBeInTheDocument();

    const img = await canvas.findByAltText("Loader");
    await expect(img).toBeInTheDocument();

    const text = await canvas.findByText(
      (content) =>
        content.toLowerCase().includes("please wait") ||
        content.includes("please_wait")
    );
    await expect(text).toBeInTheDocument();
  },
};
