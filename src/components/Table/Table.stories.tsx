import type { Meta, StoryObj } from '@storybook/react-vite';
import Table from "./Table";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next"; // Replace with your actual i18n config
import { MemoryRouter } from "react-router-dom";
import { within, expect } from "@storybook/test";

// Mock Redux store
const store = configureStore({
  reducer: {
    General: (state = {}, _action) => state,
  },
});

// Example columns and data
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const dataSource = [
  {
    key: "1",
    name: "John Doe",
    age: 32,
    address: "New York",
  },
  {
    key: "2",
    name: "Jane Smith",
    age: 28,
    address: "London",
  },
];

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <Story />
            </ThemeManager>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **Table** component is a customizable and reusable data table built on top of Ant Design's Table. It displays structured data in rows and columns, with support for dynamic column configuration and pagination.

        Key Features:
        - Accepts dynamic column definitions via the \`columns\` prop.
        - Renders tabular data from the \`data\` prop (array of objects).
        - Supports pagination and sorting.
        `,
      },
    },
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Table>;

const Template = (args: any) => (
  <div>
    <Table {...args} />
  </div>
);

export const Default: Story = {
  render: Template,
  args: {
    columns,
    data: dataSource, // Use the correct prop name if Table expects 'data' instead of 'dataSource'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check if a row with "John Doe" is rendered
    await expect(await canvas.findByText("John Doe")).toBeInTheDocument();
    // Check if a row with "Jane Smith" is rendered
    await expect(await canvas.findByText("Jane Smith")).toBeInTheDocument();
  },
};
