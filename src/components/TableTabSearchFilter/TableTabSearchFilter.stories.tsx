import { useState } from "react";
import type { Meta, StoryObj } from '@storybook/react-vite';
import TableTabSearchFilter from "./TableTabSearchFilter";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next"; // Replace with your actual i18n config
import ThemeManager from "../ThemeManager/ThemeManager";
import { MemoryRouter } from "react-router-dom";
import { expect, userEvent, waitFor, within } from "@storybook/test";

// Mock Redux store
const store = configureStore({
  reducer: {
    General: (state = {}, _action) => state,
  },
});

// Mock data
const mockData = [
  { id: 1, type: "A", name: "Apple", desc: "Red fruit" },
  { id: 2, type: "B", name: "Banana", desc: "Yellow fruit" },
  { id: 3, type: "A", name: "Avocado", desc: "Green fruit" },
  { id: 4, type: "B", name: "Blueberry", desc: "Blue fruit" },
];

// Table data preparation handler
const tableDataPreparationHandler = (item: any) => ({
  ...item,
  display: `${item.name} - ${item.desc}`,
});

const meta: Meta<typeof TableTabSearchFilter> = {
  title: "Components/TableTabSearchFilter",
  component: TableTabSearchFilter,
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
  argTypes: {
    currentTab: {
      options: ["all", "A", "B"],
      control: { type: "select" },
      defaultValue: "all",
    },
    placeholder: {
      control: "text",
      defaultValue: "Search fruits...",
    },
  },
  parameters: {
    docs: {
  description: {
    component: `The **TableTabSearchFilter** component is a reusable UI control that provides a combined **Tab Filter**, **Search Input**, and **Data Transformation Handler** for managing table data display.

    Key Features:
    - Dynamic Tab Filtering: Automatically filters data based on selected tab categories using the \`tabDataKey\`.
    - Search Across Fields: Supports multi-field search using the \`searchFields\` prop (Example: search by both "name" and "desc").
    - Custom Data Mapping: Uses a \`tableDataPreparationHandler\` callback to format or map data before rendering.
    - External State Management: Exposes filtered and transformed results to a parent via \`setTableData\` for flexible rendering.
    `,
  },
},

  }
};

export default meta;

type Story = StoryObj<typeof TableTabSearchFilter>;

const Template = (args: any) => {
  const [tableData, setTableData] = useState<any[]>([]);
  return (
    <div>
      <TableTabSearchFilter
        {...args}
        setTableData={setTableData}
        tableDataPreparationHandler={tableDataPreparationHandler}
      />
      <ul data-testid="table-list">
        {tableData.map((item) => (
          <li key={item.id}>{item.display}</li>
        ))}
      </ul>
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    data: mockData,
    tabDataKey: "type",
    currentTab: "all",
    searchFields: ["name", "desc"],
    placeholder: "Search fruits...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByPlaceholderText("Search fruits...");
    expect(input).toBeInTheDocument();
  },
};

export const Searching: Story = {
  render: Template,
  args: {
    data: mockData,
    tabDataKey: "type",
    currentTab: "all",
    searchFields: ["name", "desc"],
    placeholder: "Search fruits...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Type "blue" in the search box
    const input = await canvas.findByPlaceholderText("Search fruits...");
    await userEvent.type(input, "blue");
    // Wait for filtered result
    await waitFor(async () => {
      await expect(await canvas.findByText(/Blueberry/i)).toBeInTheDocument();
    });
  },
};