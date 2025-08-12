import React from "react";
import type { Meta, StoryObj } from '@storybook/react-vite';
import AccessibilityHeader from "./AccessibilityHeader";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Button, Flex, Popover } from "antd";
import { userEvent, within, waitFor } from "@storybook/testing-library";
import { expect } from "@storybook/test";

const meta: Meta<typeof AccessibilityHeader> = {
  title: "Components/AccessibilityHeader",
  component: AccessibilityHeader,
  decorators: [
    (Story) => (
      <ThemeManager>
        <div
          style={
            {
              "--FONTMAXINCREASE": "2",
              "--FONTMAXDECREASE": "2",
            } as React.CSSProperties
          }
        >
          <Story />
        </div>
      </ThemeManager>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `AccessibilityHeader allows users to quickly adjust theme contrast and font size for better accessibility.

          Features include:
          - Contrast themes (Default, Black & White, Blue & Yellow, Yellow & Black)
          - Font size controls (Increase, Decrease, Reset)
          `,
      },
    },
  },
  argTypes: {
    position: {
      options: ["vertical", "horizontal"],
      control: { type: "select" },
      description: "Controls the layout direction of the AccessibilityHeader.",
      table: {
        type: { summary: "horizontal | vertical" },
        defaultValue: { summary: "vertical" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccessibilityHeader>;

const Template: Story = {
  render: (args) => {
    return args.position === "vertical" ? (
      <Flex
        align="center"
        style={{ backgroundColor: "var(--t-header-background)", height: 45 }}
        data-testid="accessibility-container"
      >
        <Popover
          trigger="click"
          overlayClassName="cls-accessibility-popover"
          placement="bottom"
          content={<AccessibilityHeader {...args} />}
          title={null}
        >
          <Button
            type="link"
            className="cls-accessibility"
            style={{
              color: "var(--t-header-accessiblity-link)",
              fontFamily: "var(--font-semibold)",
            }}
            data-testid="accessibility-button"
          >
            Accessibility
          </Button>
        </Popover>
      </Flex>
    ) : (
      <div data-testid="accessibility-container">
        <AccessibilityHeader {...args} />
      </div>
    );
  },
};

export const Vertical: Story = {
  ...Template,
  args: {
    position: "vertical",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the popover
    const button = await canvas.findByTestId("accessibility-button");
    await userEvent.click(button);

    // Wait for popover content
    await waitFor(async () => {
      const popover = document.querySelector(".cls-accessibility-popover");
      await expect(popover).toBeInTheDocument();

      if (!popover) return;

      const popoverCanvas = within(popover as HTMLElement);

      // Get all contrast buttons
      const contrastButtons = await popoverCanvas.findAllByRole("button", {
        name: /^(Default|BW|BY|YB)$/i,
      });
      await expect(contrastButtons.length).toBeGreaterThanOrEqual(1);

      // Get all font size buttons
      const fontSizeButtons = await popoverCanvas.findAllByRole("button", {
        name: /^(A\+|A-|Default)$/i,
      });
      await expect(fontSizeButtons.length).toBeGreaterThanOrEqual(2);

      // // Test font size buttons
      // const [increaseBtn, decreaseBtn] = await Promise.all([
      //   popoverCanvas.findByRole("button", { name: /A\+/i }),
      //   popoverCanvas.findByRole("button", { name: /A-/i }),
      // ]);

      // await userEvent.click(increaseBtn);
      // await userEvent.click(decreaseBtn);
      
      // Click the first contrast button
      if (contrastButtons.length > 0) {
        await userEvent.click(contrastButtons[0]);
      }
    }, { timeout: 5000 });
  },
};

export const Horizontal: Story = {
  ...Template,
  args: {
    position: "horizontal",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = await canvas.findByTestId("accessibility-container");
    const header = await within(container).findByTestId("Accessibility");

    // Contrast buttons
    const contrastLabel = await within(header).findByText("Contrast :");
    const contrastContainer = contrastLabel.parentElement;
    if (!contrastContainer) throw new Error("Contrast container not found");

    // Get all contrast buttons with more specific query
    const contrastButtons = await within(contrastContainer).findAllByRole("button", {
      name: /^(Default|BW|BY|YB)$/i,
    });
    await expect(contrastButtons.length).toBeGreaterThanOrEqual(1);

    // Font size buttons
    const fontSizeLabel = await within(header).findByText("Font size :");
    const fontSizeContainer = fontSizeLabel.parentElement;
    if (!fontSizeContainer) throw new Error("Font size container not found");

    // Get all font size buttons with more specific query
    const fontSizeButtons = await within(fontSizeContainer).findAllByRole("button", {
      name: /^(A\+|A-|Default)$/i,
    });
    await expect(fontSizeButtons.length).toBeGreaterThanOrEqual(2);

    // Test all buttons
    // for (const button of contrastButtons) {
    //   await userEvent.click(button);
    // }

    // for (const button of fontSizeButtons) {
    //   await userEvent.click(button);
    // }

  },
};