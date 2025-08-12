import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "antd";
import { AutoComplete } from "./AutoComplete";
import { userEvent, within, waitFor, expect } from "@storybook/test";

// Wrap the AutoComplete in a Form to satisfy Ant Design's Form.Item requirements
const Template = (args: any) => (
  <Form layout="vertical" initialValues={{ exampleField: undefined }}>
    <AutoComplete {...args} />
  </Form>
);

const meta: Meta<typeof AutoComplete> = {
  title: "Components/AutoComplete",
  component: AutoComplete,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **AutoComplete** component provides a searchable dropdown input, integrated with **Ant Design's Form.Item** for form validation and layout.

      Key Features:
      ✅Form Support: Easily works inside Ant Design forms with validation rules.
      🔎Searchable Dropdown: Users can search and select from predefined options.
      `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "250px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AutoComplete>;

export const Default: Story = {
  render: Template,
  args: {
    name: "exampleField",
    title: "Select a value",
    formItemLabel: "Example AutoComplete",
    formItemName: "exampleField",
    formItemRequired: true,
    formItemMessage: "This field is required",
    option: [
      { value: "react", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue" },
    ],
    type: "static",
    value: undefined,
    onSelect: (name: string, value: string) =>
      console.log("Selected:", name, value),
    onChange: (name: string, value: string) =>
      console.log("Changed:", name, value),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText("Example AutoComplete")).toBeInTheDocument();
  }
};

export const SearchingAndSelecting: Story = {
  render: Template,
  args: {
    name: "exampleField",
    title: "Select a value",
    formItemLabel: "Example AutoComplete",
    formItemName: "exampleField",
    formItemRequired: true,
    formItemMessage: "This field is required",
    option: [
      { value: "react", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue" },
    ],
    type: "static",
    value: undefined,
    onSelect: (name: string, value: string) =>
      console.log("Selected:", name, value),
    onChange: (name: string, value: string) =>
      console.log("Changed:", name, value),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the Select to open dropdown
    const autoComplete = await canvas.findByTestId("autoComplete");
    await userEvent.click(autoComplete);

    // Wait a bit for animations to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Type in the combobox input
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "rea").then( () => new Promise((resolve) => setTimeout(resolve, 1000)));

    // 🔍 Wait for dropdown to render and find "React" option
    await waitFor(() => {
      const options = Array.from(
        document.querySelectorAll(".ant-select-item-option-content")
      );
      const reactOption = options.find(
        (el) => el.textContent?.trim() === "React"
      );

      if (!reactOption) {
        throw new Error("React option not found in dropdown.");
      }

      userEvent.click(reactOption);
    });

    // Assert value has updated
    await waitFor(() => {
      const selection = document.querySelector('.ant-select-selection-item');
      expect(selection).toBeTruthy();
      expect(selection?.textContent).toBe('React');
    });
  }
};
