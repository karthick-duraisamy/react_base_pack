import { expect } from "@storybook/test";
import { within, userEvent } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import PlanB from "./PlanB";
import { withRouter } from "storybook-addon-react-router-v6";
import { Provider } from "react-redux";
import { store } from "@/stores/Store";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "@/components/ThemeManager/ThemeManager";
import { Typography } from "antd";
import { withNotifications } from "./../../../../.storybook/mockNotification";
const { Text, Title } = Typography;

const meta: Meta<typeof PlanB> = {
  title: "Pages/PlanB",
  component: PlanB,
  tags: ["autodocs"],
  decorators: [
    withRouter,
    withNotifications,
    (Story) => (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeManager>
            <Story />
          </ThemeManager>
        </I18nextProvider>
      </Provider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        // These ensure no stories or code snippets appear
        <>
          <Title level={2}>Plan B - Retrieve Itinerary</Title>
          <Text>The <strong>PlanB</strong> component allows users to retrieve their itinerary using PNR and email/last name.</Text>
          
          <Title level={4}>Key Features:</Title>
          <ul>
            <li>PNR/Booking Reference Input: Validates 6-character format</li>
            <li>Email/Last Name Input: Validates minimum 3 characters</li>
            <li>Form Submission: Handles both success and error states</li>
          </ul>
        </>
      )
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlanB>;

// Mock translations that match your actual i18n setup
const t = (key: string): string => {
  const translations: Record<string, string> = {
    planB_heading: "Retrieve itinerary using PNR",
    planB_help_text:
      "Change of plans? Change your booking to suit your travel needs. It's as simple as entering your PNR / booking reference number and email ID / last name",
    get_itinerary: "Get itinerary",
    email_id: "Email ID",
    last_name: "Last name",
    pnr: "PNR",
    booking_reference: "Booking reference",
    message: "Message",
    pnr_message: "Please enter the valid PNR",
    pnr_length_message: "Please enter 6 digits",
    pnr_lastname_length_message: "Please enter minimum 3 digits"
  };
  return translations[key] || key;
};

export const DefaultState: Story = {
  args: {},
  parameters: {
    sessionStorage: {
      airlineCode: "AI",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify initial render using translations
    await expect(canvas.getByText(t("planB_heading"))).toBeInTheDocument();
    await expect(canvas.getByText(t("planB_help_text"))).toBeInTheDocument();
    await expect(
      canvas.getByRole("textbox", {
        name: new RegExp(`${t("pnr")}|${t("booking_reference")}`, "i"),
      })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("textbox", {
        name: new RegExp(`${t("email_id")}|${t("last_name")}`, "i"),
      })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: t("get_itinerary") })
    ).toBeDisabled();
  },
};

export const InvalidPNRInput: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Short PNR and invalid email
    await userEvent.type(
      canvas.getByRole("textbox", {
        name: new RegExp(`${t("pnr")}|${t("booking_reference")}`, "i"),
      }),
      "123"
    );
    await userEvent.type(
      canvas.getByRole("textbox", {
        name: new RegExp(`${t("email_id")}|${t("last_name")}`, "i"),
      }),
      "in"
    );

    const submitBtn = canvas.getByRole("button", { name: t("get_itinerary") });
    await expect(submitBtn).toBeEnabled();
    await userEvent.click(submitBtn);

    // Verify validation messages
    await expect(canvas.getByText(t("pnr_message") + " / " + t("booking_reference").toLowerCase())).toBeInTheDocument();
    await expect(canvas.getByText(t("pnr_lastname_length_message"))).toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 500));
    (window as any).notification.error({
        message: <Title level={5}>Invalid PNR Submitted</Title>,
        description: <Text>Error message shown for invalid PNR and Email ID.</Text>,
        placement: 'topRight',
        duration: 5,
    });
  },
};

export const ValidSubmission: Story = {
  args: {},
  parameters: {
    sessionStorage: {
      airlineCode: "AI",
      pnr: JSON.stringify([
        {
          PNR: "ABC123",
          lastName: "TEST",
          emailId: "test@example.com",
        },
      ]),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pnrBox = new RegExp(`${t("pnr")}|${t("booking_reference")}`, "i");
    const emailBox = new RegExp(`${t("email_id")}|${t("last_name")}`, "i");

    // Type PNR and valid email
    await userEvent.type(
      canvas.getByRole("textbox", { name: pnrBox }), "ABC123"
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: emailBox }), "abc@gmail.com"
    );
    // Form submission
    const submitBtn = canvas.getByRole("button", { name: t("get_itinerary") });
    await expect(submitBtn).toBeEnabled();
    await userEvent.click(submitBtn);

    await new Promise(resolve => setTimeout(resolve, 500));
    (window as any).notification.success({
        message: <Title level={5}>PNR Submitted</Title>,
        description: <Text>Form submitted with valid PNR details, will redirect to view PNR page.</Text>,
        placement: 'topRight',
        duration: 5,
    });
    
  },
};

