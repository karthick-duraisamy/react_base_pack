import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, waitFor } from "@storybook/testing-library";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import PrePlannedDisruptionList from "./PrePlannedDisruptionList";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "@/components/ThemeManager/ThemeManager";
import { store } from "@/stores/Store";
// import { withNotifications } from "@/storybook/mockNotification";
// const { Text, Title } = Typography;

// Mock Redux store
// const store = configureStore({
//   reducer: {
//     flightSearch: () => ({}),
//   },
// });

export default {
  title: "Pages/Auth/PrePlannedDisruption",
  component: PrePlannedDisruptionList,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeManager>
            <MemoryRouter>
              <Story />
            </MemoryRouter>
          </ThemeManager>
        </I18nextProvider>
      </Provider>
    ),
  ],
} as Meta;

export const Default: StoryObj = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial state
    await expect(canvas.getByText("Pre-Planned Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Please select a disruption type")).toBeInTheDocument();

    // Select disruption type
    const disruptionTypeSelect = await canvas.findByLabelText("Disruption Type");
    await userEvent.selectOptions(disruptionTypeSelect, "flight");

    // Check flight disruption fields
    await expect(canvas.getByText("Flight Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Affected Flight Number")).toBeInTheDocument();
    await expect(canvas.getByText("Original Departure Date")).toBeInTheDocument();
    await expect(canvas.getByText("Original Arrival Date")).toBeInTheDocument();
    await expect(canvas.getByText("Reason for Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Compensation Amount")).toBeInTheDocument();

    // Fill in flight disruption fields
    const flightNumberInput = await canvas.findByLabelText("Affected Flight Number");
    await userEvent.type(flightNumberInput, "AI123");

    const originalDepartureDateInput = await canvas.findByLabelText("Original Departure Date");
    await userEvent.type(originalDepartureDateInput, "2022-01-01");

    const originalArrivalDateInput = await canvas.findByLabelText("Original Arrival Date");
    await userEvent.type(originalArrivalDateInput, "2022-01-02");

    const reasonForDisruptionInput = await canvas.findByLabelText("Reason for Disruption");
    await userEvent.type(reasonForDisruptionInput, "Mechanical failure");

    const compensationAmountInput = await canvas.findByLabelText("Compensation Amount");
    await userEvent.type(compensationAmountInput, "1000");

    // Submit form
    const submitButton = await canvas.findByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);

    // Check success message
    await waitFor(() => expect(canvas.getByText("Form submitted successfully")).toBeInTheDocument());
  },
};

export const NoDisruptionTypeSelected: StoryObj = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial state
    await expect(canvas.getByText("Pre-Planned Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Please select a disruption type")).toBeInTheDocument();

    // Try submitting form without selecting disruption type
    const submitButton = await canvas.findByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);

    // Check error message
    await waitFor(() => expect(canvas.getByText("Please select a disruption type")).toBeInTheDocument());
  },
};

export const InvalidFlightDisruptionFields: StoryObj = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial state
    await expect(canvas.getByText("Pre-Planned Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Please select a disruption type")).toBeInTheDocument();

    // Select disruption type
    const disruptionTypeSelect = await canvas.findByLabelText("Disruption Type");
    await userEvent.selectOptions(disruptionTypeSelect, "flight");

    // Check flight disruption fields
    await expect(canvas.getByText("Flight Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Affected Flight Number")).toBeInTheDocument();
    await expect(canvas.getByText("Original Departure Date")).toBeInTheDocument();
    await expect(canvas.getByText("Original Arrival Date")).toBeInTheDocument();
    await expect(canvas.getByText("Reason for Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Compensation Amount")).toBeInTheDocument();

    // Fill in flight disruption fields with invalid data
    const flightNumberInput = await canvas.findByLabelText("Affected Flight Number");
    await userEvent.type(flightNumberInput, "123");

    const originalDepartureDateInput = await canvas.findByLabelText("Original Departure Date");
    await userEvent.type(originalDepartureDateInput, "abc");

    const originalArrivalDateInput = await canvas.findByLabelText("Original Arrival Date");
    await userEvent.type(originalArrivalDateInput, "def");

    const reasonForDisruptionInput = await canvas.findByLabelText("Reason for Disruption");
    await userEvent.type(reasonForDisruptionInput, "ghi");

    const compensationAmountInput = await canvas.findByLabelText("Compensation Amount");
    await userEvent.type(compensationAmountInput, "jkl");

    // Submit form
    const submitButton = await canvas.findByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);

    // Check error messages
    await waitFor(() =>
      expect(canvas.getByText("Invalid flight number")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(canvas.getByText("Invalid original departure date")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(canvas.getByText("Invalid original arrival date")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(canvas.getByText("Invalid reason for disruption")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(canvas.getByText("Invalid compensation amount")).toBeInTheDocument()
    );
  },
};

export const InvalidOtherDisruptionFields: StoryObj = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial state
    await expect(canvas.getByText("Pre-Planned Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Please select a disruption type")).toBeInTheDocument();

    // Select disruption type
    const disruptionTypeSelect = await canvas.findByLabelText("Disruption Type");
    await userEvent.selectOptions(disruptionTypeSelect, "other");

    // Check other disruption fields
    await expect(canvas.getByText("Other Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Reason for Disruption")).toBeInTheDocument();
    await expect(canvas.getByText("Compensation Amount")).toBeInTheDocument();

    // Fill in other disruption fields with invalid data
    const reasonForDisruptionInput = await canvas.findByLabelText("Reason for Disruption");
    await userEvent.type(reasonForDisruptionInput, "abc");

    const compensationAmountInput = await canvas.findByLabelText("Compensation Amount");
    await userEvent.type(compensationAmountInput, "def");

    // Submit form
    const submitButton = await canvas.findByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);

    // Check error messages
    await waitFor(() =>
      expect(canvas.getByText("Invalid reason for disruption")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(canvas.getByText("Invalid compensation amount")).toBeInTheDocument()
    );
  },
};

