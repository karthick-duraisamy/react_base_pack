import { fireEvent, render, screen } from "@testing-library/react";
import ItineraryList from "./ItineraryList";
import TestWrapper from "../CommonTestWrapper/CommonTestWrapper";

// Mock data for action and flight_details
const mockAction = {
  content: "Modify",
  class: "cls-action-modified",
};

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
             : status === "WK" ? "Waitlisted" 
             : "Time Change",
      statusCode: status,
      reason: status !== "HK" ? "Flight schedule has changed" : "",
    }],
    stops: "",
    stopDetails: [],
  }));
};

// Test case 1: Renders itinerary list
it("renders ItineraryList", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );
  
  // Assert that ItineraryList is rendered correctly
  expect(screen.getByTestId("ItineraryList")).toBeInTheDocument();
  
  // You can also add more assertions based on your content, e.g.:
  expect(screen.getByText("Trip 1")).toBeInTheDocument();
  expect(screen.getByText("AA123")).toBeInTheDocument();
  expect(screen.getByText("Confirmed (HK)")).toBeInTheDocument();
});

// Test case 2: Renders schedule change status
it("renders schedule change status", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );
  
  // Assert schedule change status is rendered
  expect(screen.getByText("Schedule Change (SC)")).toBeInTheDocument();
});

const mockCustomAction = {
  content: "Custom",
  class: "cls-action-custom",
};

// Test case 3: Handles date change
it("handles date change", () => {
  const mockSendDataToParent = jest.fn();

  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={mockSendDataToParent}
        action={mockCustomAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );

  const datePicker = screen.getByPlaceholderText("MMM DD, YYYY");
  fireEvent.mouseDown(datePicker);  // Open date picker
  fireEvent.click(screen.getByText("28"));  // Select a date
  
  expect(mockSendDataToParent).toHaveBeenCalled();  // Ensure the callback is triggered
});


// Test case 4: Handles radio button selection
it("handles radio button selection", () => {
  const mockSendDataToParent = jest.fn();

  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={mockSendDataToParent}
        action={mockCustomAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );

  const acceptRadio = screen.getByText(/Accept/i).closest("label");
  if(acceptRadio) {
    fireEvent.click(acceptRadio);
    expect(mockSendDataToParent).toHaveBeenCalledWith(0, "accept");  // Assert correct value is sent
  }
});

// Test case 5: Displays skeleton loader when no flight data
it("displays skeleton loader when no flight data", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={[]}
      />
    </TestWrapper>
  );

  // Assert skeleton loader is rendered
  expect(screen.getByTestId("ItineraryList")).toBeInTheDocument();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

// Test case 6: Renders correctly for custom action content

it("renders correctly for custom action content", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockCustomAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );

  // Assert that the action content is handled correctly for "Custom"
  expect(screen.queryByText("Custom")).not.toBeInTheDocument();
  expect(screen.getByText("Trip 1")).toBeInTheDocument();
});

// Test case 7: Disables DatePicker when required
it("disables DatePicker when required", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );

  const datePicker = screen.getByPlaceholderText("MMM DD, YYYY");
  expect(datePicker).toBeDisabled();  // Ensure the DatePicker is disabled as expected
});

// Test case 8: Renders flight stop information
it("renders flight stop information", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={generateFlightData("HK", 2)}
      />
    </TestWrapper>
  );
  
  // Assert flight stop information is rendered
  expect(screen.getByText("1 stop(s) - Chicago O'Hare (ORD)")).toBeInTheDocument();
});
