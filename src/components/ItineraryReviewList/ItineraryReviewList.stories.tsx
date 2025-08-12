import type { Meta, StoryObj } from "@storybook/react";
import ItineraryReviewList from "./ItineraryReviewList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import "../../pages/Auth/ReviewFlight/ReviewFlight.scss";
import { within, expect } from "@storybook/test";

// Mock store configuration
const store = configureStore({
  reducer: {
    ReviewFlightReducer: (state = { reviewStatus: "Accept" }, _action) => state,
    PNRReducer: (state = { activePNR: [] }, _action) => state,
  },
});

const meta: Meta<typeof ItineraryReviewList> = {
  title: "Components/ItineraryReviewList",
  component: ItineraryReviewList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <Story />
            </ThemeManager>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
  argTypes: {
    isConfirmpage: {
      control: "boolean",
      description: "Whether to show confirmation page layout",
    },
    reviewStatus: {
      control: "select",
      options: ["Accept", "Modify", "Cancel", "Custom"],
      description: "Review status to determine display",
    },
    selectedFlightData: {
      control: "object",
      description: "Optional selected flight data to pass directly as prop",
    },
    finalViewPNRData: {
      control: "object",
      description: "Final view PNR data passed as prop",
    },
    finalReviewPNRData: {
      control: "object",
      description: "Final review PNR data passed as prop",
    },
    searchFlightPNRData: {
      control: "object",
      description: "Search flight PNR data passed as prop",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The **ItineraryReviewList** component displays a detailed view of flight itineraries for disruption handling workflows like Accept, Modify, Cancel, or Custom review stages.

    Key Features:
    - Dynamic Layouts Based on Review Status: Supports statuses like \`Accept\`, \`Modify\`, \`Cancel\`, and \`Custom\`, altering the view accordingly.
    - Confirmation Page Support: When \`isConfirmpage\` is true, it switches to a final confirmation layout showing reviewed data.
    - Flexible Data Sources: Accepts data either from props or session storage, making it suitable for both single-page and multi-step flows.
    - Selected Flights Display: For Modify/Custom statuses, displays user-selected rebooked flights.
    - Flight Status Highlighting: Visually differentiates between confirmed, modified, cancelled, and time-changed flight segments.
    - Redux & i18n Ready: Fully integrated with Redux store state and i18n for language translations.
    - Mobile Responsive: Optimized layout and styles for both desktop and mobile devices.
    `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ItineraryReviewList>;

// Enhanced mock data generator with proper structure
const generatePNRData = (status: string, _count: number = 1) => {
  return [
    {
      id: 1,
      PNR: "VAD001",
      flightNumber: "VA-0135",
      active: true,
      readAt: "-",
      policy: "Time change_23",
      pnrCheck: {
        issue: "Flight Cancellation",
        alert: "The flight has been cancelled due to operational reasons.",
      },
      score: "1.00",
      scoreStatus: "high",
      status: "Email sent",
      reason: "Due to technical issues",
      alertStatus: {
        whatsapp: "#",
        mail: "#",
        sms: "#",
      },
      firstName: "John",
      lastName: "Doe",
      emailId: "john.doe@example.com",
      dateOfBooking: "0,0,21, 11:05 (UTC+05:30)",
      totalPaxCount: 2,
      totalAdultPaxCount: 2,
      totalChildPaxCount: 0,
      totalInfantPaxCount: 0,
      totalAmount: 450,
      paidAmount: 450,
      balanceAmount: 0,
      scorePolicyName: "Voyager pax",
      scoreAttributes: [
        {
          type: "SSR",
          value: "-",
          label: "-",
        },
        {
          type: "Travel type",
          value: "business",
          label: "Business",
        },
        {
          type: "Cabin",
          value: "economy",
          label: "Economy",
        },
        {
          type: "Booking channel",
          value: "direct",
          label: "Direct",
        },
      ],
      paxInfo: [
        {
          id: 1,
          type: "Adult",
          passengerDetail: {
            firstName: "John",
            lastName: "Doe",
            age: "35 yrs",
            gender: "Male",
          },
          originalSsrData: [
            {
              trip: 1,
              ssrData: [],
            },
          ],
          rebookSsrData: [
            {
              trip: 1,
              ssrData: [],
            },
          ],
        },
      ],
      originalFlightDetails: [
        {
          trip: 1,
          date: "0,0,30, 11:05",
          origin: "Delhi",
          originAirportCode: "DEL",
          destination: "Mumbai",
          destinationAirportCode: "BOM",
          stops: 0,
          stopDetails: [],
          flightDetails: [
            {
              id: 1,
              origin: "Delhi",
              originAirportCode: "DEL",
              destination: "Mumbai",
              destinationAirportCode: "BOM",
              flightNumber: `AI${100}`,
              stops: 0,
              paxCount: 2,
              departDate: "0,0,30",
              depart: "10:00",
              arrivalDate: "0,0,30,",
              arrival: "12:15",
              departTimezone: "UTC+05:30",
              arrivalTimezone: "UTC+05:30",
              nextDayArrival: "",
              duration: "2h 15m",
              status:
                status === "HK"
                  ? "Confirmed"
                  : status === "SC"
                    ? "Schedule Change"
                    : status === "WK"
                      ? "Waitlisted"
                      : "Time Change",
              statusCode: status,
            },
          ],
        },
      ],
      rebookOptionalFlightDetails: [
        {
          trip: 1,
          date: "0,0,30, 11:05",
          origin: "Delhi",
          originAirportCode: "DEL",
          destination: "Mumbai",
          destinationAirportCode: "BOM",
          stops: 0,
          stopDetails: [],
          flightDetails: [
            {
              id: 1,
              origin: "Delhi",
              originAirportCode: "DEL",
              destination: "Mumbai",
              destinationAirportCode: "BOM",
              flightNumber: `AI${200}`,
              stops: 0,
              paxCount: 2,
              departDate: "0,0,30",
              depart: "14:00",
              arrivalDate: "0,0,30",
              arrival: "16:15",
              departTimezone: "UTC+05:30",
              arrivalTimezone: "UTC+05:30",
              nextDayArrival: "",
              duration: "2h 15m",
              status: "Confirmed",
              statusCode: "HK",
              ssrData: {
                seatData: [],
                seatList: [],
                baggageList: [],
                mealsList: [],
              },
            },
          ],
          itinerary_status:
            status === "HK"
              ? "accept"
              : status === "SC"
                ? "modify"
                : status === "WK"
                  ? "cancel"
                  : "accept",
        },
      ],
    },
  ];
};

const generateSelectedFlights = (count: number = 1) => {
  return Array(count)
    .fill(0)
    .map((_, idx) => ({
      trip: idx + 1,
      viaFlightDetails: [
        {
          originAirportCode: "DEL",
          destinationAirportCode: "BOM",
          flightNumber: `AI${200 + idx}`,
          departDate: "0,0,30",
          depart: "14:00",
          duration: "2h 15m",
          arrival: "16:15",
          arrivalDate: "0,0,30",
        },
      ],
      stops: 0,
      viaPoints: "",
      status: "Confirmed",
      statusCode: "HK",
    }));
};

// Enhanced session storage mock with proper initialization
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
});

// Base story configuration
const baseStory = (
  reviewStatus: string,
  isConfirmpage: boolean = false,
  dataSource: "props" | "sessionStorage" | "both" = "sessionStorage"
) => {
  const pnrData = generatePNRData(
    reviewStatus === "Accept"
      ? "HK"
      : reviewStatus === "Modify"
        ? "SC"
        : reviewStatus === "Cancel"
          ? "WK"
          : "HK",
    1
  );

  const selectedFlights = generateSelectedFlights(1);

  const args: any = {
    isConfirmpage,
    reviewStatus,
  };

  const parameters: any = {
    sessionStorage: {},
  };

  if (dataSource === "props" || dataSource === "both") {
    if (isConfirmpage) {
      args.finalReviewPNRData = pnrData;
    } else {
      args.finalViewPNRData = pnrData;
    }

    if (reviewStatus === "Modify" || reviewStatus === "Custom") {
      args.selectedFlightData = selectedFlights;
    }
  }

  if (dataSource === "sessionStorage" || dataSource === "both") {
    parameters.sessionStorage = {
      ...parameters.sessionStorage,
      reviewStatus,
      ...(isConfirmpage
        ? {
            finalReviewPNRData: JSON.stringify(pnrData),
          }
        : {
            finalViewPNRData: JSON.stringify(pnrData),
          }),
      ...(reviewStatus === "Modify" || reviewStatus === "Custom"
        ? {
            selectedFlights: JSON.stringify(selectedFlights),
          }
        : {}),
    };
  }

  return {
    args,
    parameters,
  };
};

// Story variants
// export const Empty: Story = baseStory('Accept');
// export const ModifiedFlights: Story = baseStory("Modify", false, "both");
// export const CustomSelection: Story = baseStory("Custom", false, "both");
// export const CancelledFlights: Story = baseStory("Cancel", false, "both");
// export const ConfirmationPage: Story = {
//   ...baseStory("Accept", true, "both"),
//   parameters: {
//     sessionStorage: {
//       finalReviewPNRData: JSON.stringify(generatePNRData("HK", 1)),
//       reviewStatus: "Accept",
//     },
//   },
// };

export const AcceptSelection: Story = {
  ...baseStory("Accept", false, "both"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify custom selection header
    await expect(canvas.getByText(/Accepted/i)).toBeInTheDocument();
    // Verify original and custom flight details
    expect(canvas.getAllByText(/DEL/i)).toHaveLength(1);
    expect(canvas.getAllByText(/BOM/i)).toHaveLength(1);
    expect(canvas.getByText(/AI200/i)).toBeInTheDocument();
    
  }
};

export const ModifiedFlights: Story = {
  ...baseStory("Modify", false, "both"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify modified flights header
    await expect(canvas.getByText(/Modified/i)).toBeInTheDocument();

    // Verify original flight details
    expect(canvas.getByText(/DEL/i)).toBeInTheDocument();
    expect(canvas.getByText(/BOM/i)).toBeInTheDocument();
    expect(canvas.getByText(/AI200/i)).toBeInTheDocument();
    expect(canvas.getByText(/Confirmed/i)).toBeInTheDocument();
  }
};

export const CancelledFlights: Story = {
  ...baseStory("Cancel", false, "both"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify custom selection header
    await expect(canvas.getByText(/Cancelled/i)).toBeInTheDocument();
    // Verify original and custom flight details
    expect(canvas.getAllByText(/DEL/i)).toHaveLength(1);
    expect(canvas.getAllByText(/BOM/i)).toHaveLength(1);
    expect(canvas.getByText(/AI200/i)).toBeInTheDocument();
    
  }
};

export const ConfirmationPage: Story = {
  ...baseStory("Accept", true, "both"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify confirmation header
    await expect(canvas.getByText(/Trip/i)).toBeInTheDocument();

    // Verify passenger details
    expect(canvas.getByText(/DEL/i)).toBeInTheDocument();
    expect(canvas.getByText(/BOM/i)).toBeInTheDocument();
    
    // Verify flight confirmation
    expect(canvas.getByText(/Confirmed/i)).toBeInTheDocument();
    expect(canvas.getByText(/AI200/i)).toBeInTheDocument();

  }
};