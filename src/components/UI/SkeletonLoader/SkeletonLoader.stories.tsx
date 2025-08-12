import { Meta, StoryObj } from "@storybook/react";
import { SkeletonLoaderMenuItem } from "./SkeletonLoader";
import { expect, waitFor } from "@storybook/test";

const meta: Meta<typeof SkeletonLoaderMenuItem> = {
  title: "Components/MenuSkeleton",
  component: SkeletonLoaderMenuItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
  description: {
    component: `The **SkeletonLoaderMenuItem** component provides a lightweight placeholder skeleton UI for menu items while actual content is loading.

    Features:
    - Image Placeholder: Renders a skeleton for the menu icon (using the \`cls-menuImg\` CSS class).
    - Label Placeholder: Renders a skeleton for the menu label (using the \`cls-menuLabel\` CSS class).
    - CSS-Driven Animations: Uses CSS classes for shimmer or placeholder animation effects.
    `,
  },
},

  }
};

export default meta;
type Story = StoryObj<typeof SkeletonLoaderMenuItem>;

export const Default: Story = {
  render: () => <SkeletonLoaderMenuItem />,
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const imageSkeleton = canvasElement.querySelector(".cls-menuImg");
      const labelSkeleton = canvasElement.querySelector(".cls-menuLabel");

      expect(imageSkeleton).toBeInTheDocument();
      expect(labelSkeleton).toBeInTheDocument();
    });
  },
};
