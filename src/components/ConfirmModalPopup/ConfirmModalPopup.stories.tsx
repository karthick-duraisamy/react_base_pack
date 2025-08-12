import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ConfirmModalPopup, { ConfirmModalPopupProps } from "./ConfirmModalPopup";
import { Button } from "antd";
import ThemeManager from "../ThemeManager/ThemeManager";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import "../../pages/Unauth/PageNotFound/PageNotFound.scss";
import { expect } from "@storybook/test";
import { within, waitFor } from "@storybook/testing-library";
import { userEvent } from "@storybook/testing-library";

// Define the base props with all required properties
const baseModalProps: ConfirmModalPopupProps["props"] = {
  modalName: "confirm",
  page: "sample-page",
  header: "Are you sure?",
  description: "This action cannot be undone.",
  modalToggle: false, // Default to false since we're using button trigger
  modalWidth: 500,
  primaryBtn: { text: "Cancel", value: false },
  secondaryBtn: { text: "Confirm", value: true },
  type: "default",
  // Include all optional props with default values
  list: undefined,
  modalClass: undefined,
  loading: undefined,
  position: undefined,
  placement: undefined,
};

// Wrapper component with proper typing
const ConfirmModalWithTrigger = ({
  modalProps,
  onData,
}: {
  modalProps: ConfirmModalPopupProps["props"];
  onData?: (value: boolean | string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Show Modal
      </Button>
      <ConfirmModalPopup
        props={{
          ...modalProps,
          modalToggle: isModalOpen,
        }}
        onData={(value) => {
          setIsModalOpen(false);
          onData?.(value);
        }}
      />
    </div>
  );
};

const meta: Meta<typeof ConfirmModalPopup> = {
  title: "Components/ConfirmModalPopup",
  component: ConfirmModalPopup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **ConfirmModalPopup** component displays a reusable confirmation modal for critical user actions like **delete**, **reset**, **cancel**, or **general confirmations**.

        Key Features:
        - ✅ Supports multiple modal types: \`confirm\`, \`delete\`, \`reset\`, \`cancel\`
        - 📝 Dynamic header and description for contextual messaging
        - 🎛️ Configurable primary and secondary buttons with custom labels and return values
        - ✏️ Optional textarea (for actions like **Cancel with Reason**)
        - 📐 Adjustable modal width via props
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div
            style={{
              padding: "2rem",
            }}
          >
            <Story />
          </div>
        </ThemeManager>
      </I18nextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfirmModalPopup>;

export const Confirm: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "confirm",
        header: "Confirm Action",
        description: "Are you sure you want to proceed?",
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        // Verify header
        const header = modal?.querySelector(".cls-popup-header");
        await expect(header).toBeInTheDocument();
        await expect(header).toHaveTextContent("Confirm Action");

        // Verify description
        const description = modal?.querySelector("p");
        await expect(description).toBeInTheDocument();
        await expect(description).toHaveTextContent(
          "Are you sure you want to proceed?"
        );

        // Verify icon
        const icon = modal?.querySelector(".cls-icon svg");
        await expect(icon).toBeInTheDocument();

        // Verify buttons
        const cancelBtn = modal?.querySelector(".cls-secondary-btn");
        await expect(cancelBtn).toBeInTheDocument();
        await expect(cancelBtn).toHaveTextContent("Cancel");

        const confirmBtn = modal?.querySelector(".ant-btn-primary");
        await expect(confirmBtn).toBeInTheDocument();
        await expect(confirmBtn).toHaveTextContent("Confirm");
      },
      { timeout: 2000 }
    );
  },
};

export const Delete: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "delete",
        header: "Delete Item",
        description: "This item will be permanently deleted.",
        secondaryBtn: { text: "Delete", value: true },
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        // Verify delete-specific content
        const deleteIcon = modal?.querySelector(".cls-icon svg");
        await expect(deleteIcon).toBeInTheDocument();

        const deleteBtn = modal?.querySelector(".ant-btn-primary");
        await expect(deleteBtn).toBeInTheDocument();
        await expect(deleteBtn).toHaveTextContent("Delete");

        // Verify header and description
        const header = modal?.querySelector(".cls-popup-header");
        await expect(header).toHaveTextContent("Delete Item");

        const description = modal?.querySelector("p");
        await expect(description).toHaveTextContent(
          "This item will be permanently deleted."
        );
      },
      { timeout: 2000 }
    );
  },
};

export const Reset: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "reset",
        header: "Reset Settings",
        description: "This will reset all your configurations.",
        secondaryBtn: { text: "Reset", value: true },
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        // Verify reset-specific content
        const resetIcon = modal?.querySelector(".cls-icon svg");
        await expect(resetIcon).toBeInTheDocument();

        const resetBtn = modal?.querySelector(".ant-btn-primary");
        await expect(resetBtn).toBeInTheDocument();
        await expect(resetBtn).toHaveTextContent("Reset");

      },
      { timeout: 2000 }
    );
  },
};

export const CancelWithTextarea: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "cancel",
        header: "Cancel Operation",
        description: "Please provide a reason for cancellation (min 40 chars).",
        type: "withTextarea",
        secondaryBtn: { text: "Submit", value: true },
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        // Verify textarea
        const textarea = modal?.querySelector("textarea");
        await expect(textarea).toBeInTheDocument();

        // Test textarea validation
        await userEvent.type(
          textarea!,
          "Cancelling because we've changed our plans about going there."
        );
        await expect(textarea).toHaveValue(
          "Cancelling because we've changed our plans about going there."
        );

        const submitBtn = modal?.querySelector(".ant-btn-primary");
        await expect(submitBtn).not.toHaveClass("disabled");

        // await userEvent.clear(textarea!);
        // await userEvent.type(textarea!, "Short");
        // await expect(submitBtn).toHaveClass("disabled");
      },
      { timeout: 3000 }
    );
  },
};

export const ModalWithList: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "delete",
        header: "Items to be deleted",
        description: "Are you confirm to delete the above items?",
        list: ["Item 1", "Item 2", "Item 3"],
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        // Verify list items
        const listItems = modal?.querySelectorAll(".cls-grey");
        await expect(listItems?.length).toBe(3);
        await expect(listItems?.[0]).toHaveTextContent("Item 1");
        await expect(listItems?.[1]).toHaveTextContent("Item 2");
        await expect(listItems?.[2]).toHaveTextContent("Item 3");
      },
      { timeout: 2000 }
    );
  },
};

export const LoadingState: Story = {
  render: (args) => (
    <ConfirmModalWithTrigger
      modalProps={{
        ...baseModalProps,
        modalName: "confirm",
        header: "Processing...",
        description: "Please wait while we process your request.",
        loading: true,
      }}
      onData={args.onData}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(await canvas.findByText("Show Modal"));

    await waitFor(
      async () => {
        const modal = document.querySelector(".ant-modal-content");
        await expect(modal).toBeInTheDocument();

        const confirmBtn = modal?.querySelector(".ant-btn-primary");
        await userEvent.click(confirmBtn!);
        await expect(confirmBtn).toHaveClass("ant-btn-loading");
      },
      { timeout: 20000 }
    );
  },
};
