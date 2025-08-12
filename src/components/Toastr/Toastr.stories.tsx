import React from "react";
import type { Meta, StoryObj } from '@storybook/react-vite';
import Toastr, { ToastrRef } from "./Toastr";
import { Button, Flex } from "antd";
import { expect } from '@storybook/test';
import { userEvent, within, waitFor } from "@storybook/test";
import ThemeManager from "../ThemeManager/ThemeManager";

const meta: Meta<typeof Toastr> = {
  title: "Components/Toastr",
  component: Toastr,
  decorators: [
    (Story) => (
      <ThemeManager>
        <Story />
      </ThemeManager>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **Toastr** component is a global notification system used for displaying brief messages (toasts) to users about the status of an action or system event.

        Features:
        - Supports 4 Notification Types: \`success\`, \`info\`, \`warning\`, and \`error\`.
        - Positioning: Can render notifications at various screen positions (e.g., \`topRight\`, \`bottomLeft\`).
        - Customizable Content: Supports optional *title*, *description*, and *custom close icon visibility*.
        - Auto Dismiss: Duration-based auto-dismissal with optional configuration.
        - Imperative Trigger: Uses a *ref method* (\`childFunction\`) for manual triggering.
        - Multiple Instances: Can show multiple independent toasts at once.`,
      },
    },
  },
  argTypes: {
    data: {
      control: {
        type: "object",
      },
      description: "Configuration object for the toast notification",
      table: {
        type: {
          summary: `{
            type: 'success' | 'info' | 'warning' | 'error',
            position: NotificationPlacement,
            title?: string,
            description?: string,
            closeIcon?: boolean,
            duration?: number,
            className?: string
          }`,
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toastr>;

const Template: Story = {
  render: (args) => {
    const toastRef = React.useRef<ToastrRef>(null);

    const showToast = () => {
      toastRef.current?.childFunction();
    };

    return (
      <div data-testid="toastr-container">
        <Toastr ref={toastRef} {...args} />
        <Flex gap="small" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={showToast}
            data-testid="show-toast-button"
          >
            Show Toast
          </Button>
        </Flex>
      </div>
    );
  },
};

export const SuccessToast: Story = {
  ...Template,
  args: {
    data: {
      type: "success",
      position: "topRight",
      title: "Success!",
      description: "Your action was completed successfully.",
      closeIcon: true,
      duration: 4.5,
    },
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Click the show toast button
    const button = await canvas.findByTestId("show-toast-button");
    await userEvent.click(button);
    
    // Wait for toast container
    await waitFor(() => {
      expect(document.querySelector('.ant-notification')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verify success toast content
    await waitFor(() => {
      const toast = document.querySelector('.ant-notification-notice-success');
      expect(toast).toBeInTheDocument();
      
      if (!toast) return;
      
      const toastCanvas = within(toast as HTMLElement);
      expect(toastCanvas.getByText("Success!")).toBeInTheDocument();
      expect(toastCanvas.getByText("Your action was completed successfully.")).toBeInTheDocument();
      expect(toastCanvas.queryByRole("button", { name: /close/i })).toBeNull();
    }, { timeout: 5000 });
  }
};

export const ErrorToast: Story = {
  ...Template,
  parameters: {
    test: {
      timeout: 30000 // Story-specific timeout
    }
  },
  args: {
    data: {
      type: "error",
      position: "topRight",
      title: "Error!",
      description: "Something went wrong. Please try again.",
      closeIcon: false,
      duration: 10,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Wait for and click the button
    const button = await canvas.findByTestId("show-toast-button");
    await userEvent.click(button);
    
    // Wait for toast container to exist first
    await waitFor(() => {
      expect(document.querySelector('.ant-notification')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Then check for specific toast
    await waitFor(() => {
      const toast = document.querySelector('.ant-notification-notice-error');
      expect(toast).toBeInTheDocument();
      
      if (!toast) return;
      
      const toastCanvas = within(toast as HTMLElement);
      if(args.data.title) expect(toastCanvas.getByText(args.data.title)).toBeInTheDocument();
      if(args.data.description) expect(toastCanvas.getByText(args.data.description)).toBeInTheDocument();
      expect(toastCanvas.queryByRole("button", { name: /close/i })).toBeNull();
    }, { timeout: 5000 });
  },
};

export const ToastWithCustomPosition: Story = {
  ...Template,
  args: {
    data: {
      type: "info",
      position: "bottomLeft",
      title: "Custom Position",
      description: "This appears at the bottom left",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByTestId("show-toast-button"));

    await waitFor(
      async () => {
        const container = await document.querySelector(
          ".ant-notification-bottomLeft"
        );
        await expect(container).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const ToastWithoutDescription: Story = {
  ...Template,
  args: {
    data: {
      type: "warning",
      position: "topRight",
      title: "Warning without description",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByTestId("show-toast-button"));

    await waitFor(
      async () => {
        const toast = await document.querySelector(
          ".ant-notification-notice-warning"
        );
        await expect(toast).toBeInTheDocument();

        if (!toast) return;

        const toastCanvas = within(toast as HTMLElement);

        if (args.data.title) {
          await expect(
            await toastCanvas.findByText(args.data.title)
          ).toBeInTheDocument();
        }

        await expect(toastCanvas.queryByTestId("toast-description")).toBeNull();
      },
      { timeout: 5000 }
    );
  },
};

export const MultipleToasts: Story = {
  render: () => {
    const successRef = React.useRef<ToastrRef>(null);
    const errorRef = React.useRef<ToastrRef>(null);

    const showSuccess = () => successRef.current?.childFunction();
    const showError = () => errorRef.current?.childFunction();

    return (
      <div data-testid="multiple-toasts-container">
        <Toastr
          ref={successRef}
          data={{
            type: "success",
            position: "topRight",
            title: "Success Toast",
            description: "Ready to show",
          }}
        />
        <Toastr
          ref={errorRef}
          data={{
            type: "error",
            position: "topRight",
            title: "Error Toast",
            description: "Ready to show",
          }}
        />
        <Flex gap="small" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={showSuccess}
            data-testid="show-success-button"
          >
            Show Success
          </Button>
          <Button danger onClick={showError} data-testid="show-error-button">
            Show Error
          </Button>
        </Flex>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Show success toast
    await userEvent.click(await canvas.findByTestId("show-success-button"));
    await waitFor(
      async () => {
        await expect(
          document.querySelector(".ant-notification-notice-success")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Show error toast
    await userEvent.click(await canvas.findByTestId("show-error-button"));
    await waitFor(
      async () => {
        await expect(
          document.querySelector(".ant-notification-notice-error")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify both toasts exist
    const notices = await document.querySelectorAll(".ant-notification-notice");
    await expect(notices).toHaveLength(2);
  },
};
