import { Meta, StoryObj } from "@storybook/react";
import CustomFilter, {
  generateOptions,
  CustomFiltersType,
} from "./CustomFilter";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { expect } from "@storybook/test";
import { within, waitFor } from "@storybook/testing-library";
import { userEvent } from "@storybook/testing-library";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Typography } from "antd";
import { withNotifications } from "../../../.storybook/mockNotification";
const { Text, Title } = Typography;


const meta: Meta<typeof CustomFilter> = {
  title: "Components/CustomFilter",
  component: CustomFilter,
  decorators: [
    withNotifications,
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div style={{ height: "100%", width: "100%", padding: "30px 20px" }}>
            <Story />
          </div>
        </ThemeManager>
      </I18nextProvider>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **CustomFilter** component provides a dynamic, reusable filtering interface for table data based on multiple criteria.

        Key Features:
        🎛️ Multi-field Filtering: Supports input fields, number fields, and multi-select dropdowns for filtering.
        ⚙️ Dynamic Options Generation: Uses a helper function \`generateOptions\` to auto-generate filter dropdown options from the table data.
        ✅ Flexible Filter Types: Supports exact match or partial match (controlled by each filter config).
        🧱 Visible Columns Control: Allows restricting which columns appear in the filter view (via \`visibleColumns\` prop).
        📈 Custom Table Data Handling: Provides callback props like \`setTableData\` and \`tableDataPreparationHandler\` to handle filtered results externally.
        `,
      },
    },
  },
  argTypes: {
    tableData: { control: "object" },
    filters: { control: "object" },
    visibleColumns: { control: "object" },
  },
};

export default meta;

type Story = StoryObj<typeof CustomFilter>;

// Sample data for stories
const sampleTableData = [
  {
    id: 1,
    name: "John Doe",
    age: 32,
    department: "Engineering",
    status: "active",
    salary: 85000,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 28,
    department: "Marketing",
    status: "active",
    salary: 75000,
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 45,
    department: "Engineering",
    status: "inactive",
    salary: 95000,
  },
  {
    id: 4,
    name: "Alice Williams",
    age: 35,
    department: "HR",
    status: "active",
    salary: 65000,
  },
  {
    id: 5,
    name: "Charlie Brown",
    age: 40,
    department: "Finance",
    status: "inactive",
    salary: 110000,
  },
];

const departmentOptions = generateOptions(sampleTableData, [
  { key: "department" },
]).department;

const statusOptions = generateOptions(sampleTableData, [
  { key: "status", labelFunc: (value) => value.toUpperCase() },
]).status;

const basicFilters: CustomFiltersType = [
  {
    key: "name",
    label: "Name",
    exact: false,
    field: {
      type: "input",
      inputType: "string",
      placeholder: "Search by name",
    },
  },
  {
    key: "age",
    label: "Age",
    exact: true,
    field: {
      type: "input",
      inputType: "number",
      placeholder: "Search by exact age",
    },
  },
  {
    key: "department",
    label: "Department",
    exact: false,
    field: {
      type: "multiSelect",
      options: departmentOptions,
      placeholder: "Select departments",
    },
  },
  {
    key: "status",
    label: "Status",
    exact: false,
    field: {
      type: "multiSelect",
      options: statusOptions,
      placeholder: "Select status",
    },
  },
];

// With Visible Dropdown
export const BasicUsage: Story = {
  args: {
    tableData: sampleTableData,
    filters: basicFilters,
    visibleColumns: [{ key: "name" }, { key: "age" }],
    setTableData: (data: any) => console.log("Filtered data:", data),
    tableDataPreparationHandler: (item: any) => item,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await waitFor(() => {
      expect(canvas.getByTestId("customFilter")).toBeInTheDocument();
    });

    const filterButton = await canvas.findByRole("button");
    await userEvent.click(filterButton);
  },
};

export const MultiSelectFilterTest: Story = {
  args: {
    tableData: sampleTableData,
    filters: basicFilters,
    visibleColumns: [{ key: "name" }, { key: "age" }],
    setTableData: (data: any) => console.log("Filtered data:", data),
    tableDataPreparationHandler: (item: any) => item,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 1. Verify initial render
    await waitFor(() => {
      expect(canvas.getByTestId("customFilter")).toBeInTheDocument();
    });

    // 2. Test filter dropdown
    const filterButton = await canvas.findByRole("button");
    await userEvent.click(filterButton);

    // Verify dropdown items
    const listItems = document?.querySelectorAll(".ant-checkbox-label");
    await expect(listItems?.length).toBe(2);
    await expect(listItems?.[0]).toHaveTextContent("Name");
    await expect(listItems?.[1]).toHaveTextContent("Age");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Select name filter
    await userEvent.click(listItems?.[0]);

    // Verify name input appears
    const nameInput = await canvas.findByPlaceholderText("Search by name");
    expect(nameInput).toBeInTheDocument();

    // 4. Test text filtering
    await userEvent.type(nameInput, "John");
    await waitFor(() => {
      expect(nameInput).toHaveValue("John");
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Select age filter
    await userEvent.click(filterButton);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify age input appears
    await userEvent.click(listItems?.[1]);
    const ageInput = await canvas.findByPlaceholderText("Search by exact age");
    expect(ageInput).toBeInTheDocument();

    // 6. Test number filtering
    await userEvent.type(ageInput, "32");
    await waitFor(() => {
      expect(ageInput).toHaveValue(32);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 7. Test apply button
    const applyButton = await canvas.findByText("Apply filter");
    await userEvent.click(applyButton);

    // Trigger notification through window object
    (window as any).notification.success({
      message: <Title level={5}>Filter Applied</Title>,
      description: <Text>You will see the data with applied filters.</Text>,
      placement: 'bottomRight',
      duration: 3,
    });
  },
};

export const ClearFiltersTest: Story = {
  args: {
    tableData: sampleTableData,
    filters: basicFilters,
    visibleColumns: [{ key: "name" }, { key: "status" }],
    setTableData: (data: any) => console.log("Filtered data:", data),
    tableDataPreparationHandler: (item: any) => item,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 1. Verify initial render
    await waitFor(() => {
      expect(canvas.getByTestId("customFilter")).toBeInTheDocument();
    });

    // 2. Test filter dropdown
    const filterButton = await canvas.findByRole("button");
    await userEvent.click(filterButton);

    // Verify dropdown items
    const listItems = document?.querySelectorAll(".ant-checkbox-label");
    await expect(listItems?.length).toBe(2);
    await expect(listItems?.[0]).toHaveTextContent("Name");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Select name filter
    await userEvent.click(listItems?.[0]);

    // Verify name input appears
    const nameInput = await canvas.findByPlaceholderText("Search by name");
    expect(nameInput).toBeInTheDocument();

    // 4. Test text filtering
    await userEvent.type(nameInput, "John");
    await waitFor(() => {
      expect(nameInput).toHaveValue("John");
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Test clear options
    const clearButton = await canvas.findByText("Clear filter");
    await userEvent.click(clearButton).then(() => new Promise(resolve => setTimeout(resolve, 2000)));

    // 6. Select clear option from dropdown
    await waitFor(async () => {
      const dropdownItems = document.querySelectorAll(
        ".ant-dropdown-menu-item"
      );
      expect(dropdownItems.length).toBeGreaterThan(0);

      // Find the "Clear option" item
      const clearOption = Array.from(dropdownItems).find((item) =>
        item.textContent?.includes("Clear option")
      );

      if (clearOption) {
        await userEvent.click(clearOption);
      } else {
        throw new Error("Clear option not found in dropdown");
      }
    });

    // 7. Verify filter is cleared
    await waitFor(() => {
      expect(nameInput).not.toBeInTheDocument();
    });

    // Trigger notification through window object
    (window as any).notification.info({
      message: <Title level={5}>Filter options cleared</Title>,
      description: <Text>You will see the filter without selecting any option.</Text>,
      placement: 'bottomRight',
      duration: 3,
    });
  },
};
