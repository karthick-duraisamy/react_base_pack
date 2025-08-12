import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import AdhocPnrList from "./AdhocPNRList";
import "../../pages/Auth/Reaccommodation/Reaccommodation.scss";
import ThemeManager from "../ThemeManager/ThemeManager";
import { FdFlightClosePending, FdPNRPending } from "../Icons/Icons";
import "../../pages/Auth/AdhocDisruptionList/AdhocDisruptionList.scss";
import { store } from '@/stores/Store';
import { within, expect } from '@storybook/test';

// 🌐 Wrap Story with necessary providers
const withProviders = (Story: any) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <ThemeManager>
        <div style={{ height: "100%", width: "100%", padding: "30px 20px" }}>
          <Story />
        </div>
      </ThemeManager>
    </I18nextProvider>
  </Provider>
);

// 📘 Storybook Meta
const meta: Meta<typeof AdhocPnrList> = {
  title: "Components/AdhocPnrList",
  component: AdhocPnrList,
  decorators: [withProviders],
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **AdhocPnrList** component is used to display a list of disrupted flight clusters along with their corresponding **PNR summary statistics**.

        Key Features:
        - Displays flight segment info, number of stops, passenger types, and PNR counts for each cluster.
        - Shows status cards like *Pending* and *Critical* with respective icons, counts, reasons, and percentages.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdhocPnrList>;

// 🧪 Sample props
const mockClusterData = [
  {
    segment: "DEL - BOM",
    stops: 1,
    paxCount: 5,
    pnrCount: 3,
    info: [
      { type: "Adult", count: 3 },
      { type: "Senior citizen", count: 1 },
      { type: "VIP", count: 1 },
    ],
  },
  {
    segment: "BLR - HYD",
    stops: 0,
    paxCount: 2,
    pnrCount: 1,
    info: [{ type: "Adult", count: 2 }],
  },
];

const cardsData: any = [
  {
    status: "Pending",
    icon: <FdPNRPending />,
    pendingCount: "6",
    reason: "Reaccommodation pending",
    percent: 30,
  },
  {
    status: "Critical",
    icon: <FdFlightClosePending />,
    pendingCount: "22",
    reason: "Acknowledgement pending",
    percent: 32,
  },
];

// ✅ Default Story
export const Default: Story = {
  args: {
    clusterData: mockClusterData,
    cardsData: cardsData,
    clusterIndex: 0,
    filterCluster: "Y",
    handlePNRData: (data: any) => console.log("PNR selected:", data),
    handleFilterData: (val: any) => console.log("Filter applied:", val),
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify segments are rendered
    expect(await canvas.findByText("DEL - BOM")).toBeInTheDocument();
    expect(await canvas.findByText("BLR - HYD")).toBeInTheDocument();

    // Verify status cards
    expect(await canvas.findByText("Pending")).toBeInTheDocument();
    expect(await canvas.findByText("Critical")).toBeInTheDocument();

    // Check card reasons
    expect(await canvas.findByText("Reaccommodation pending")).toBeInTheDocument();
    expect(await canvas.findByText("Acknowledgement pending")).toBeInTheDocument();

    // Check pending counts
    expect(await canvas.findByText("6")).toBeInTheDocument();
    expect(await canvas.findByText("22")).toBeInTheDocument();

  },
};

export const OptionChangedForCluster: Story = {
  args: {
    clusterData: mockClusterData,
    cardsData: cardsData,
    clusterIndex: 1,
    filterCluster: "Y",
    handlePNRData: (data: any) => console.log("PNR selected:", data),
    handleFilterData: (val: any) => console.log("Filter applied:", val),
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify segments are rendered
    expect(await canvas.findByText("DEL - BOM")).toBeInTheDocument();
    expect(await canvas.findByText("BLR - HYD")).toBeInTheDocument();

    // Verify status cards
    expect(await canvas.findByText("Pending")).toBeInTheDocument();
    expect(await canvas.findByText("Critical")).toBeInTheDocument();

    // Check card reasons
    expect(await canvas.findByText("Reaccommodation pending")).toBeInTheDocument();
    expect(await canvas.findByText("Acknowledgement pending")).toBeInTheDocument();

    // Check pending counts
    expect(await canvas.findByText("6")).toBeInTheDocument();
    expect(await canvas.findByText("22")).toBeInTheDocument();

    // Verify radio button - checked initial state
    const radioWrapper = canvas.getByText('Yes').closest('.ant-radio-wrapper');
    const radioInput = radioWrapper?.querySelector('input[type="radio"]');
    await expect(radioInput).toBeChecked();
  
  },
};

export const NotFilteredByClusterType: Story = {
  args: {
    clusterData: mockClusterData,
    cardsData: cardsData,
    clusterIndex: 0,
    filterCluster: "N",
    handlePNRData: (data: any) => console.log("PNR selected:", data),
    handleFilterData: (val: any) => console.log("Filter applied:", val),
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify status cards
    expect(await canvas.findByText("Pending")).toBeInTheDocument();
    expect(await canvas.findByText("Critical")).toBeInTheDocument();

    // Check card reasons
    expect(await canvas.findByText("Reaccommodation pending")).toBeInTheDocument();
    expect(await canvas.findByText("Acknowledgement pending")).toBeInTheDocument();

    // Check pending counts
    expect(await canvas.findByText("6")).toBeInTheDocument();
    expect(await canvas.findByText("22")).toBeInTheDocument();

    // Verify radio button - checked initial state
    const radioWrapper = canvas.getByText('No').closest('.ant-radio-wrapper');
    const radioInput = radioWrapper?.querySelector('input[type="radio"]');
    await expect(radioInput).toBeChecked();
  },
};
