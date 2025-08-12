import type { Meta, StoryObj } from '@storybook/react-vite';
import ComingSoon from "./ComingSoon";
import ThemeManager from "../ThemeManager/ThemeManager";
import { expect } from '@storybook/test';
import { within, waitFor } from '@storybook/testing-library';

const meta: Meta<typeof ComingSoon> = {
  title: "Components/ComingSoon",
  component: ComingSoon,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **ComingSoon** component serves as a full-page placeholder...`,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeManager>
        <Story />
      </ThemeManager>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ComingSoon>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for the component to be fully rendered
    await waitFor(async () => {
      // Verify the main text
      const comingSoonText = await canvas.findByText("Coming Soon.....");
      await expect(comingSoonText).toBeInTheDocument();
      
      // Verify the smile icon exists
      const smileIcon = document.querySelector(".anticon-smile");
      await expect(smileIcon).toBeInTheDocument();
      
      // Alternative way to verify container
      const container = canvas.getByTestId("comingsoon");
      await expect(container).toBeInTheDocument();
    }, { timeout: 2000 });
  },
};