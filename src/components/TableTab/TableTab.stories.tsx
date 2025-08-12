import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from "react";
import TableTab from "./TableTab";
import ThemeManager from "../ThemeManager/ThemeManager";
import { expect, within } from "@storybook/test";

const options = [
  { label: "Flight", value: "Flight" },
  { label: "Seat", value: "Seat" },
  { label: "Baggage", value: "Baggage" },
  { label: "Meals", value: "Meals" },
  { label: "Others", value: "Others" },
];

const meta: Meta<typeof TableTab> = {
  title: "Components/TableTab",
  decorators: [
    (Story) => (
      <ThemeManager>
        <div style={{ paddingBlock: 25, height: "100%", width: "100%" }}>
          <Story />
        </div>
      </ThemeManager>
    ),
  ],
  component: TableTab,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `The **TableTab** component renders a horizontal **Radio Group style tab selector** commonly used for filtering or categorizing table data.

        Key Features:
        - Tab Navigation: Allows users to quickly switch between multiple filter tabs (e.g., Flight, Seat, Baggage, etc.).
        - Dynamic Options: Accepts an \`options\` prop to control the available tabs, each defined with a \`label\` and a \`value\`.
        - Controlled Component: The currently active tab is managed externally via the \`currentTab\` prop.
        - Change Handler: Triggers the \`changeHandler\` callback whenever a tab is clicked, allowing parent components to react (e.g., re-filter data).
        - Responsive Layout: Automatically handles long tab lists with an ellipsis ("...") to indicate overflow or hidden tabs.
        `,
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of tab options (label/value pairs)",
      table: {
        type: { summary: "Array<{ label: string; value: string }>" },
        defaultValue: { summary: JSON.stringify(options) },
      },
      control: false,
    },
    currentTab: {
      description: "Currently selected tab",
      table: {
        type: { summary: "string" },
      },
    },
    changeHandler: {
      action: "tabChanged",
      description: "Handler for tab change",
      table: {
        type: { summary: "(value: string) => void" },
      },
      control: false,
    },
  },
};
export default meta;
type Story = StoryObj<typeof TableTab>;

export const Default: Story = {
  args: {
    options,
    currentTab: "Flight",
  },
  render: (args) => {
    const [currentTab, setCurrentTab] = useState(args.currentTab);
    return (
      <div style={{ maxWidth: 400 }}>
        <TableTab
          {...args}
          currentTab={currentTab}
          changeHandler={setCurrentTab}
        />
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.currentTab)).toBeInTheDocument();
    await expect(canvas.getByText("Seat")).toBeInTheDocument();
    await expect(canvas.getByText("Others")).toBeInTheDocument();
  },
};
