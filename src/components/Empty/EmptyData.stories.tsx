import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from '@storybook/test';
import EmptyData from "./EmptyData";

const meta: Meta<typeof EmptyData> = {
  title: "Components/EmptyData",
  component: EmptyData,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **EmptyData** component is a reusable UI placeholder for displaying empty states when there is no available data.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyData>;

export const Default: Story = {
  args: {
    content: "No data available at the moment.",
  },
};

export const CustomContent: Story = {
  args: {
    content: "This is a very long empty state message that should wrap properly within the container without overflowing or breaking the layout.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyState = await canvas.findByText(/This is a very long empty state message/);
    expect(emptyState).toBeInTheDocument();
    // Check that the text wraps properly (visual check)
    expect(emptyState.clientWidth).toBeLessThan(canvasElement.clientWidth);
  },
};
