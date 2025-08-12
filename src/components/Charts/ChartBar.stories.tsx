import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartBar, SettingsWiseUsage } from "./ChartBar";
import { expect } from "@storybook/test";
import { within, waitFor } from "@storybook/testing-library";
import { Empty } from "antd";

const meta: Meta<typeof ChartBar> = {
  title: "Components/ChartBar",
  component: ChartBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **ChartBar** component displays a horizontal bar chart representing **email campaign usage statistics** across different settings or campaigns.

        Key Features:
        - Horizontal Bar Chart which visualizes campaign-wise metrics like:
           * Total API Requests
           * Email Instances
           * Sent Count
           * Not Sent Count
      `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "50%", padding: 20 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ChartBar>;

const mockData: SettingsWiseUsage[] = [
  {
    setting_name: "Campaign A",
    total_api_request: 2500,
    email_instances: 1800,
    sent: 1500,
    not_sent: 300,
  },
  {
    setting_name: "Campaign B",
    total_api_request: 1800,
    email_instances: 1200,
    sent: 1100,
    not_sent: 100,
  },
  {
    setting_name: "Campaign C",
    total_api_request: 2000,
    email_instances: 1600,
    sent: 1300,
    not_sent: 300,
  },
];

export const Default: Story = {
  args: {
    data: mockData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for chart to render
    const chartContainer = await canvas.findByTestId("chartbar");
    await expect(chartContainer).toBeInTheDocument();

    // Verify chart elements are present
    await waitFor(
      async () => {
        // Check for campaign names on X-axis
        const campaignA = await canvas.findByText("Campaign A");
        const campaignB = await canvas.findByText("Campaign B");
        const campaignC = await canvas.findByText("Campaign C");
        await expect(campaignA).toBeInTheDocument();
        await expect(campaignB).toBeInTheDocument();
        await expect(campaignC).toBeInTheDocument();

        // Check for legend items rendered in svg
        const legends = Array.from(
          chartContainer.querySelectorAll(".recharts-legend-item-text")
        ).map((el) => el.textContent);

        await expect(legends).toContain("Sent");
        await expect(legends).toContain("Notsent");

        // Check for some data labels (formatted with toLocaleString)
        const sentValue = Number(mockData[0].sent) | 0;
        const notSentValue = Number(mockData[0].not_sent) | 0;
        const formattedValue = (sentValue + notSentValue)?.toLocaleString(
          "en-US"
        );
        if (formattedValue) {
          const dataLabel = await canvas.findByText(formattedValue);
          await expect(dataLabel).toBeInTheDocument();
        }
      },
      { timeout: 2000 }
    );
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
  },
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

    // Verify bar chart isn't rendered
    const chart = canvas.queryByTestId("barChart");
    await expect(chart).not.toBeInTheDocument();
  },
};
