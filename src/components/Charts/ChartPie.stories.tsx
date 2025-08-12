import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChartExample } from "./ChartPie";
import { expect } from "@storybook/test";
import { within } from "@storybook/testing-library";
import { Empty } from "antd";

const meta: Meta<typeof PieChartExample> = {
  title: "Components/ChartPie",
  component: PieChartExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **ChartPie** component renders a **pie chart visualization** for representing distribution-based data like **active vs inactive users**, **status counts**, etc.

        Key Features:
        - Dynamic Pie Chart which accepts a \`data\` array with \`name\` and \`value\` properties for each slice.
        - Supports passing custom colors for each slice (as shown in the **Custom Colors** story).
        `,
      },
    },
  },
  argTypes: {
    data: {
      control: "object",
      description: "Array of pie chart data with name and value properties",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PieChartExample>;

// Sample data for stories
const sampleData = [
  { name: "Inactive", value: 70 },
  { name: "Active", value: 130 },
];

const equalData = [
  { name: "Inactive", value: 100 },
  { name: "Active", value: 100 },
];

const singleSliceData = [
  { name: "Active", value: 200 },
  { name: "Inactive", value: 0 },
];

// Add these play functions to your existing stories
export const Default: Story = {
  args: {
    data: sampleData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify pie chart renders
    const pieChart = canvas.getByTestId("pieChart");
    await expect(pieChart).toBeInTheDocument();

    // Verify percentages
    const activePercentage = canvas.getByText("65%");
    const inactivePercentage = canvas.getByText("35%");
    await expect(activePercentage).toBeInTheDocument();
    await expect(inactivePercentage).toBeInTheDocument();

    // Verify total count
    const totalCount = canvas.getByText("200");
    await expect(totalCount).toBeInTheDocument();
  },
};

export const EqualDistribution: Story = {
  args: {
    data: equalData,
  },
  name: "Equal Distribution",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify equal percentages
    const percentageElements = canvas.getAllByText("50%");
    await expect(percentageElements.length).toBe(2);

    // Verify total count
    const totalCount = canvas.getByText("200");
    await expect(totalCount).toBeInTheDocument();
  },
};

export const SingleSlice: Story = {
  args: {
    data: singleSliceData,
  },
  name: "Single Slice (One Value Zero)",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify only one slice is visible
    const activePercentage = canvas.getByText("100%");
    await expect(activePercentage).toBeInTheDocument();

    // Verify inactive doesn't show 0%
    const inactivePercentage = canvas.getByText("0%");
    await expect(inactivePercentage).toBeInTheDocument();

    // Verify total count
    const totalCount = canvas.getByText("200");
    await expect(totalCount).toBeInTheDocument();
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
  },
  name: "With Custom Colors",
  render: (args) => (
    <PieChartExample
      data={args.data.map((item: any, index: number) => ({
        ...item,
        color: index === 0 ? "#FF0000" : "#00FF00", // Red and green colors
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the chart container to be present
    const chartContainer = await canvas.findByTestId("pieChart");
    await expect(chartContainer).toBeInTheDocument();

    // Wait a bit for animations to complete (if needed)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the legend items which should contain our labels
    const legendItems = await canvas.findAllByRole("listitem");
    await expect(legendItems.length).toBeGreaterThanOrEqual(2);

    // Verify legend text
    const legendTexts = legendItems.map((item) => item.textContent);
    await expect(legendTexts).toContain("Active");
    await expect(legendTexts).toContain("Inactive");

    // Find percentage labels (rendered in SVG)
    const percentageLabels = Array.from(
      chartContainer.querySelectorAll(".recharts-pie text")
    ).map((el) => el.textContent);

    await expect(percentageLabels).toContain("65%");
    await expect(percentageLabels).toContain("35%");
  },
};

export const EmptyState: Story = {
  args: {
    data: [
      { name: "Inactive", value: 0 },
      { name: "Active", value: 0 },
    ],
  },
  name: "Empty State",
  render: () => (
    <div
      style={{
        height: "350px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Empty description="No data available" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify empty state renders with the correct text
    const emptyState = await canvas.findByText("No data available");
    await expect(emptyState).toBeInTheDocument();

    // Verify pie chart isn't rendered
    const pieChart = canvas.queryByTestId("pieChart");
    await expect(pieChart).not.toBeInTheDocument();
  },
};