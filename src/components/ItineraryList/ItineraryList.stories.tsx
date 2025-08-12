import React, { Suspense } from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import "../../pages/Auth/ReviewFlight/PassengersList/PassengersList.scss";
import { within, expect } from '@storybook/test';
import { Loader } from '../Loader/Loader';

// Define async component loader
const ItineraryList = React.lazy(() => import('./ItineraryList'));

// Create a loading fallback
const LoadingFallback = () => <Loader />;

// Minimal mock store
const store = configureStore({
  reducer: {
    itinerary: (state = {}) => state,
  },
});

// Create a wrapper component for Suspense
const ItineraryListWrapper = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <ItineraryList {...props} />
  </Suspense>
);

const meta: Meta<typeof ItineraryListWrapper> = {
  title: "Components/ItineraryList",
  component: ItineraryListWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The **ItineraryList** component displays flight itineraries...`,
      },
    },
    // Enable viewing the source code
    storySource: {
      excludeDecorators: true,
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeManager>
            <BrowserRouter>
              <div style={{ height: 350 }}>
                <Story />
              </div>
            </BrowserRouter>
          </ThemeManager>
        </I18nextProvider>
      </Provider>
    ),
  ],
  argTypes: {
    sendDataToParent: { action: "dataSent" },
    action: { control: { type: "object" } },
    flight_details: { control: { type: "object" } },
  },
};

export default meta;
type Story = StoryObj<typeof ItineraryListWrapper>;

const generateFlightData = (status: string, count: number = 1) => {
  return Array(count).fill(0).map((_, idx) => ({
    trip: idx + 1,
    itinerary_status: "accept",
    date: "0,0,21, 11:05 (UTC+05:30)",
    flightDetails: [{
      originAirportCode: "DEL",
      destinationAirportCode: "BOM",
      flightNumber: `AI${100 + idx}`,
      departDate: "0,0,29",
      depart: "10:00",
      duration: "2h 15m",
      arrival: "12:15",
      nextDayArrival: "",
      status: status === "HK" ? "Confirmed" 
             : status === "SC" ? "Schedule Change" 
             : status === "WK" ? "Cancelled" 
             : "Time Change",
      statusCode: status,
      reason: status !== "HK" ? "Flight schedule has changed" : "",
    }],
    stops: "",
    stopDetails: [],
  }));
};

export const ConfirmedFlights: Story = {
  args: {
    sendDataToParent: () => {},
    action: { content: "Confirmed", class: "confirmed" },
    flight_details: generateFlightData("HK", 2),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Wait for component to load', async () => {
      // Wait longer if needed (default is 1000ms)
      await new Promise(resolve => setTimeout(resolve, 2000));
      await expect(canvas.findByTestId('ItineraryList')).resolves.toBeInTheDocument();
    });

    await step('Verify flight cards', async () => {
      const flightCards = await canvas.findAllByTestId('flightCard');
      expect(flightCards.length).toBe(2);
    });

    await step('Verify status badges', async () => {
      const statusBadges = await canvas.findAllByTestId('flightStatus');
      await Promise.all(
        statusBadges.map(async badge => {
          await expect(badge).toHaveTextContent(/Confirmed/i);
        })
      );
    });
  }
};

export const ModifiedFlights: Story = {
  args: {
    sendDataToParent: () => {},
    action: { content: "Modified", class: "modified" },
    flight_details: [
      ...generateFlightData("HK", 1),
      ...generateFlightData("SC", 1),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for component
    await canvas.findByTestId('ItineraryList');

    // Verify flight cards are rendered
    const flightCards = await canvas.findAllByTestId('flightCard');
    expect(flightCards.length).toBe(2);
    
    // Verify status using data-testid or more specific selectors
    const statusBadges = await canvas.findAllByTestId('flightStatus');
    expect(statusBadges?.[0]).toHaveTextContent(/Confirmed/i);
    expect(statusBadges?.[1]).toHaveTextContent(/Schedule Change/i);
    
    // Verify modification reason exists
    const reasons = await canvas.findAllByText(/Flight schedule has changed/i);
    expect(reasons.length).toBeGreaterThan(0);
  }
};

export const CancelledFlights: Story = {
  args: {
    sendDataToParent: () => {},
    action: { content: "Cancelled", class: "Cancelled" },
    flight_details: generateFlightData("WK", 1),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component
    await canvas.findByTestId('ItineraryList');
    // Verify flight cards are rendered
    const flightCards = await canvas.findAllByTestId('flightCard');
    expect(flightCards.length).toBe(1);
    
    // Verify status using data-testid or more specific selectors
    const statusBadges = await canvas.findAllByTestId('flightStatus');
    expect(statusBadges?.[0]).toHaveTextContent(/Cancelled/i);
  }
};

export const TimeChangedFlights: Story = {
  args: {
    sendDataToParent: () => {},
    action: { content: "Time Changed", class: "time-changed" },
    flight_details: generateFlightData("TC", 1),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component
    await canvas.findByTestId('ItineraryList');
    // Verify flight cards are rendered
    const flightCards = await canvas.findAllByTestId('flightCard');
    expect(flightCards.length).toBe(1);
    
    // Verify status using data-testid or more specific selectors
    const statusBadges = await canvas.findAllByTestId('flightStatus');
    expect(statusBadges?.[0]).toHaveTextContent(/Time change/i);
  }
};

export const Loading: Story = {
  args: {
    sendDataToParent: () => {},
    action: { content: "", class: "" },
    flight_details: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = await canvas.findByTestId('itineraryLoader');
    expect(loader).toBeInTheDocument();
  }
};