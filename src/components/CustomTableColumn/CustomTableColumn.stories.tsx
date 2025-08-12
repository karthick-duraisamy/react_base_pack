import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomTableColumn from "./CustomTableColumn";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Typography } from "antd";
import { expect, userEvent } from "@storybook/test";
import { withNotifications } from "../../../.storybook/mockNotification";
const { Text, Title } = Typography;

const meta: Meta<typeof CustomTableColumn> = {
  title: "Components/CustomTableColumn",
  component: CustomTableColumn,
  decorators: [
    withNotifications, // Add notification provider first
    (StoryFn) => (
      <I18nextProvider i18n={i18n}>
        <ThemeManager>
          <div style={{ padding: "20px" }}>
            <StoryFn />
          </div>
        </ThemeManager>
      </I18nextProvider>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **CustomTableColumn** component allows users to dynamically select which columns they want visible in a table.

        Key Features:
        ✅ Dynamic Column Selection: Lets users toggle table columns on or off based on available column keys.
        🛠️ Supports Hideable Columns: Allows specifying which columns can be hidden (via the \`hideableColumns\` prop).
        📥 Initial and Selected Columns: Takes an \`initialColumns\` array to define all possible columns with \`selected\` prop predefines which columns are visible by default.
        📤 Change Handler: Calls \`setVisibleColumns\` callback whenever user changes column visibility.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomTableColumn>;

const initialColumns = [
  { key: "name", title: "Name" },
  { key: "age", title: "Age" },
  { key: "email", title: "Email" },
  { key: "address", title: "Address" },
];

export const Default: Story = {
  args: {
    initialColumns,
    selected: ["name", "email"],
    hideableColumns: ["address"],
    setVisibleColumns: () => {},
  },
  play: async () => {
    // Test column selection
    const columnButton = await document.querySelector(".anticon");
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (columnButton) {
      await userEvent.click(columnButton);
    }
  },
};

export const AllColumnsSelected: Story = {
  args: {
    initialColumns,
    selected: ["name"],
    hideableColumns: [],
    setVisibleColumns: () => {},
  },
  play: async () => {
    // Test column selection
    const columnButton = await document.querySelector(".anticon");
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (columnButton) {
      await userEvent.click(columnButton);
    }

    // Verify dropdown items
    const listItems = document?.querySelectorAll(".ant-checkbox-label");
    await expect(listItems?.length).toBe(4);
    await expect(listItems?.[0]).toHaveTextContent("Name");
    await expect(listItems?.[1]).toHaveTextContent("Age");
    await expect(listItems?.[2]).toHaveTextContent("Email");
    await expect(listItems?.[3]).toHaveTextContent("Address");

    await userEvent.click(listItems?.[1]);
    await userEvent.click(listItems?.[2]);
    await userEvent.click(listItems?.[3]);

    await new Promise(resolve => setTimeout(resolve, 500));
    (window as any).notification.info({
      message: <Title level={5}>All columns selected</Title>,
      description: <Text>All the columns selected are now shown in the table.</Text>,
      placement: "topRight",
      duration: 5,
    });
  },
};

export const ParticularColumnsSelected: Story = {
  args: {
    initialColumns,
    selected: ["name"],
    hideableColumns: [],
    setVisibleColumns: () => {},
  },
  play: async () => {
    // Test column selection
    const columnButton = await document.querySelector(".anticon");
    await new Promise(resolve => setTimeout(resolve, 500));
    if (columnButton) {
      await userEvent.click(columnButton);
    }

    // Verify dropdown items
    const listItems = document?.querySelectorAll(".ant-checkbox-label");
    await expect(listItems?.length).toBe(4);
    await expect(listItems?.[0]).toHaveTextContent("Name");
    await expect(listItems?.[1]).toHaveTextContent("Age");
    await expect(listItems?.[2]).toHaveTextContent("Email");
    await expect(listItems?.[3]).toHaveTextContent("Address");

    await userEvent.click(listItems?.[0]);
    await userEvent.click(listItems?.[2]);
    await userEvent.click(listItems?.[3]);

    await new Promise(resolve => setTimeout(resolve, 500));
    (window as any).notification.info({
      message: <Title level={5}>Particular columns selected</Title>,
      description: <Text>Only the Email and Address columns are displayed in the table.</Text>,
      placement: "topRight",
      duration: 5,
    });
  },
};
