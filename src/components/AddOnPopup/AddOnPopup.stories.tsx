import type { Meta, StoryObj } from '@storybook/react-vite';
import AddOnPopup from "./AddOnPopup";
import { MemoryRouter } from "react-router-dom";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { userEvent, waitFor, within, expect } from '@storybook/test';
import { Typography } from 'antd';
import { withNotifications } from "../../../.storybook/mockNotification";
const { Text, Title } = Typography;

// Mock Redux store
const store = configureStore({
  reducer: {
    ReviewFlightReducer: (
      state = {
        original_flight_data: [{}, {}],
        nextPage: "reviewflight",
      }
    ) => state,
  },
});

// Mock data
const mockPnrData = [
  {
    paxInfo: [
      {
        type: "Adult",
        rebookSsrData: [
          {
            ssrData: [
              {
                seatDetail: { price: 100, selected: true },
                baggageDetail: { price: 50, selected: true, item: "20kg" },
                mealsDetail: { price: 30, selected: true },
                isSeatChecked: true,
                isBaggageChecked: true,
                isMealsChecked: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

const mockFlights = [
  {
    stops: 0,
    flightNumber: "XY123",
    originAirportCode: "DEL",
    destinationAirportCode: "BOM",
  },
  {
    stops: 1,
    flightNumber: "XY456",
    originAirportCode: "BOM",
    destinationAirportCode: "BLR",
  },
];

const meta: Meta<typeof AddOnPopup> = {
  title: "Components/AddOnPopup",
  component: AddOnPopup,
  decorators: [
    withNotifications,
    (StoryFn) => (
      <MemoryRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <div style={{ paddingBlock: 25, height: 90, width: "100%" }}>
                <StoryFn />
              </div>
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
        component: `AddOnPopup shows data about **Modified flight-related** add-ons and SSR add-ons like **Seats**, **Baggage**, and **Meals**.`,
      },
    },
  },
  argTypes: {
    currentTab: {
      options: ["modify", "Seat", "Baggage", "Meals"],
      control: { type: "select" },
      description: "Current tab for AddOnPopup",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "modify" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddOnPopup>;

export const FlightSelectedList: Story = {
  args: {
    currentTab: "modify",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify flight information is displayed
    await waitFor(async () => {
      const flightNumber = await canvas.findByText("XY123");
      expect(flightNumber).toBeInTheDocument();
      
      const route = await canvas.findByText("DEL");
      expect(route).toBeInTheDocument();
      
      const stop = await canvas.findByText("BLR");
      expect(stop).toBeInTheDocument();
    });
  },
};

// Stories with properly triggered notifications
export const FlightListSubmitted: Story = {
  args: {
    currentTab: "modify",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = await canvas.findByText("Submit");
    await userEvent.click(submitButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Trigger notification through window object
    (window as any).notification.success({
      message: <Title level={5}>Flight Submitted</Title>,
      description: <Text>You will be redirected to the flight review page.</Text>,
      placement: 'topRight',
      duration: 3,
    });
  },
};

export const AddSSRNavigation: Story = {
  args: {
    currentTab: "modify",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const addSsrButton = await canvas.findByText("Add SSR");
    await userEvent.click(addSsrButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    (window as any).notification.info({
      message: <Title level={5}>Add SSR Selected</Title>,
      description: <Text>You will be redirected to the Add SSR page.</Text>,
      placement: 'topRight',
      duration: 3,
    });
  },
};

export const SSRSelectedList: Story = {
  args: {
    currentTab: "Seat",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify flight information is displayed
    await waitFor(async () => {
      const tabData = await canvas.findByText("seats");
      expect(tabData).toBeInTheDocument();
      
      const addOnAmount = await canvas.findByText("Total add-ons amount");
      expect(addOnAmount).toBeInTheDocument();
      
    });
  },
};

export const SelectedSSRListDetails: Story = {
  args: {
    currentTab: "Baggage",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify flight information is displayed
    await waitFor(async () => {
      const tabData = await canvas.findByText("Baggage");
      expect(tabData).toBeInTheDocument();
      
      const addOnAmount = await canvas.findByText("Total add-ons amount");
      expect(addOnAmount).toBeInTheDocument();
      
    });

    // Get the hover icon element
    const hoverElement:HTMLSpanElement | null = document.querySelector('.cls-infoIcon');
    if(hoverElement) {
      // Simulate hover using mouseEnter/mouseLeave
      await userEvent.hover(hoverElement);
  
      // Verify hover effects
      await waitFor(() => {
        expect(hoverElement).toHaveClass('ant-popover-open');
      }, { timeout: 1000 });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    (window as any).notification.info({
      message: <Title level={5}>SSR Details</Title>,
      description: <Text>Hovering shows selected SSR details.</Text>,
      placement: 'topRight',
      duration: 3,
    });
  },
};

export const SSRListSubmitted: Story = {
  args: {
    currentTab: "Meals",
    pnrData: mockPnrData,
    tripIndex: [0, 0],
    selectedFlights: mockFlights,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.findByText("Next");
    await userEvent.click(nextButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    (window as any).notification.success({
      message: <Title level={5}>SSR Submitted</Title>,
      description: <Text>You will be redirected to the flight review page.</Text>,
      placement: 'topRight',
      duration: 3,
    });
  },
};