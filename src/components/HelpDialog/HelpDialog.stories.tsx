import type { Meta, StoryObj } from '@storybook/react-vite';
import HelpDialog from "./HelpDialog";
import ThemeManager from "../ThemeManager/ThemeManager";
import { MemoryRouter } from "react-router-dom";
import { expect, userEvent, within } from '@storybook/test';

const meta: Meta<typeof HelpDialog> = {
  title: "Components/HelpDialog",
  component: HelpDialog,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeManager>
          <div
            style={{ padding: 32, background: "#f9f9f9", minHeight: "100vh" }}
          >
            <Story />
          </div>
        </ThemeManager>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `The **HelpDialog** component displays a dialog for providing contextual help or support guidance to users.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text", defaultValue: "How can we assist you today?" },
    type: {
      control: 'select',
      options: ["info", "success", "error", "warning"],
      description: 'Type of dialog box to be shown'
    },
  },
};

export default meta;

type Story = StoryObj<typeof HelpDialog>;
const Template = (args: any) => <HelpDialog {...args} />;

export const Default: Story = {
  render: Template,
  args: {
    type: "info",
    message: "Welcome! Please begin by selecting an option from the menu to proceed.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify dialog is open by default
    const dialog = await canvas.findByTestId('HelpDialog');
    expect(dialog).toBeInTheDocument();
    
    // Verify content
    expect(canvas.getByText("Welcome! Please begin by selecting an option from the menu to proceed.")).toBeInTheDocument();
    
    // Verify close button exists
    const closeButton = document.querySelector('.anticon-close');
    expect(closeButton).toBeInTheDocument();
  }
};

export const SuccessDialog: Story = {
  render: Template,
  args: {
    type: "success",
    message: "Operation completed successfully! Your changes have been saved.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  
    // Verify content
    expect(canvas.getByText("Operation completed successfully! Your changes have been saved.")).toBeInTheDocument();
  }
};

export const WarningDialogWithClose: Story = {
  render: Template,
  args: {
    type: "warning",
    message: "Warning: This action cannot be undone. Please confirm your decision.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);  
    // Verify content
    expect(canvas.getByText("Warning: This action cannot be undone. Please confirm your decision.")).toBeInTheDocument();

    // Test closing behavior
    const closeButton = document.querySelector('.anticon-close');
    expect(closeButton).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await userEvent.click(closeButton!);
  }
};

export const DangerDialog: Story = {
  render: Template,
  args: {
    type: "error",
    message: "This is an informational message. Please review the details carefully.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify dialog is open
    const dialog = await canvas.findByTestId('HelpDialog');
    expect(dialog).toBeInTheDocument();
    
    // Verify content
    expect(canvas.getByText("This is an informational message. Please review the details carefully.")).toBeInTheDocument();
  }
};