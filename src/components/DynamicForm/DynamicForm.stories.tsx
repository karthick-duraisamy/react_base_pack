import { within, userEvent, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, Input, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import DynamicForm from './DynamicForm';

const meta: Meta<typeof DynamicForm> = {
  title: "Components/DynamicForm",
  component: DynamicForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `A reusable component for creating dynamic forms with add/remove functionality.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicForm>;

const Template: Story['render'] = (args) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} layout="vertical" style={{ width: 600 }}>
      <DynamicForm {...args}>
        {(field, _add, remove, index, fields) => (
          <div key={field.key} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <Form.Item
              {...field}
              name={[field.name, 'name']}
              rules={[{ required: true, message: 'Please enter a value' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input placeholder={`Item ${index + 1}`} />
            </Form.Item>
            {fields.length > 1 && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => remove(field.name)}
                style={{ marginLeft: 8 }}
              />
            )}
          </div>
        )}
      </DynamicForm>
    </Form>
  );
};

export const BasicUsage: Story = {
  render: Template,
  args: {
    name: 'items',
    initialValues: [{ name: 'Default Item' }],
    includeAddBtn: { text: 'Add Item', class: 'add-btn' },
  },
};

export const EmptyInitialState: Story = {
  render: Template,
  args: {
    name: 'items',
    initialValues: [],
    includeAddBtn: { text: 'Add First Item', class: 'add-btn' },
  },
};

// Visual test cases
export const FieldInteractions: Story = {
  render: Template,
  args: {
    name: 'items',
    initialValues: [],
    includeAddBtn: { text: 'Add Item', class: 'add-btn' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state verification
    const addButton = canvas.getByText('Add Item');
    expect(addButton).toBeInTheDocument();
    expect(canvas.queryAllByRole('textbox')).toHaveLength(0);

    // Test adding first field
    await new Promise(resolve => setTimeout(resolve, 500));
    await userEvent.click(addButton);
    const firstInput = await canvas.findByPlaceholderText('Item 1');
    expect(firstInput).toBeInTheDocument();

    // Test adding second field
    await new Promise(resolve => setTimeout(resolve, 500));
    await userEvent.click(addButton);
    const secondInput = await canvas.findByPlaceholderText('Item 2');
    expect(secondInput).toBeInTheDocument();
    expect(canvas.getAllByRole('textbox')).toHaveLength(2);

    // // Test removing a field
    // const deleteButtons = canvas.getAllByLabelText('delete');
    // await userEvent.click(deleteButtons[0]);
    // expect(canvas.getAllByRole('textbox')).toHaveLength(1);
    // expect(canvas.getByPlaceholderText('Item 1')).toBeInTheDocument();
  },
};

export const EnteringDataInFields: Story = {
  render: Template,
  args: {
    name: 'items',
    initialValues: [],
    includeAddBtn: { text: 'Add Item', class: 'add-btn' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add a field
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(canvas.getByText('Add Item'));
    const input = canvas.getByPlaceholderText('Item 1');

    // Trigger validation by focusing and blurring empty field
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(input).then(() => new Promise(resolve => setTimeout(resolve, 500)));
    await userEvent.type(input, "John");
    await userEvent.tab(); // Move focus away to trigger validation

    // const errorMessage = await canvas.findByText('Please enter a value');
    // expect(errorMessage).toBeInTheDocument();

    // Fix validation error
    // await userEvent.type(input, 'Test Value');
    // expect(errorMessage).not.toBeInTheDocument();
  },
};

export const InitialValuesHandling: Story = {
  render: Template,
  args: {
    name: 'items',
    initialValues: [{ name: 'First Item' }, { name: 'Second Item' }],
    includeAddBtn: { text: 'Add More', class: 'add-btn' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial values are rendered
    const inputs = canvas.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('First Item');
    expect(inputs[1]).toHaveValue('Second Item');

    // Verify delete buttons exist for all fields
    const deleteButtons = canvas.getAllByLabelText('delete');
    expect(deleteButtons).toHaveLength(2);
  },
};
