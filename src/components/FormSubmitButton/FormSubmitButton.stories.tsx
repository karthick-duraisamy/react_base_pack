import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, Input } from "antd";
import SubmitButton from "./FormSubmitButton";
import { within, userEvent, waitFor } from "@storybook/test";
import { expect } from "@storybook/test";

const meta: Meta<typeof SubmitButton> = {
  title: "Components/SubmitButton",
  component: SubmitButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `The **SubmitButton** component is a reusable form submit button integrated with Ant Design's **Form**. It automatically handles form validation and button state.

        Key Features:
        - Form Validation Aware: Button remains disabled until all required fields in the form are valid.
        - Custom Validation Logic: Optionally pass a \`customValidation\` prop for additional enabling/disabling logic (Example: business-specific checks).
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  render: () => {
    const [form] = Form.useForm();
    return (
      <Form form={form} layout="vertical" style={{ width: 300 }}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input aria-label="username-input" />
        </Form.Item>
        <SubmitButton
          form={form}
          customValidation={() => false}
        >
          Submit
        </SubmitButton>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByLabelText("username-input");
    const button = await canvas.findByTestId("FormSubmitButton");

    await expect(input).toBeInTheDocument;
    await expect(button).toBeInTheDocument;

  },
};

export const WithCustomValidation: Story = {
  render: () => {
    const [form] = Form.useForm();
    return (
      <Form form={form} layout="vertical" style={{ width: 300 }}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input aria-label="username-input" />
        </Form.Item>
        <SubmitButton form={form}>Submit</SubmitButton>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByLabelText("username-input");
    const button = await canvas.findByTestId("FormSubmitButton");

    // Initially should be disabled
    await expect(button).toBeDisabled();

    // Fill the field
    await userEvent.type(input, "testuser");

    // Button should be enabled
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  },
};