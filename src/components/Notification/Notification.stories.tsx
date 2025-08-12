import type { Meta, StoryObj } from "@storybook/react-vite";
import { Notification } from "./Notification";
import ThemeManager from "../ThemeManager/ThemeManager";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { MemoryRouter } from "react-router-dom";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { Flex } from "antd";

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "New Message",
    body: "You have a new message from John",
    other: JSON.stringify({ icon: "https://example.com/avatar1.png" }),
    sent_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    read_at: null,
    status_name: "Unread",
  },
  {
    id: 2,
    title: "System Update",
    body: "System maintenance scheduled for tomorrow",
    other: JSON.stringify({ icon: "https://example.com/avatar2.png" }),
    sent_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read_at: new Date().toISOString(),
    status_name: "Read",
  },
];

// Mock RTK Query API
const mockNotificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getMessage: builder.query({
      queryFn: () => ({
        data: {
          responseCode: 0,
          response: {
            data: {
              results: mockNotifications,
              links: { next: null },
            },
          },
        },
      }),
    }),
    updateMessageStatus: builder.mutation({
      queryFn: () => ({
        data: { responseCode: 0 },
      }),
    }),
  }),
});

// Configure store with RTK Query middleware
const store = configureStore({
  reducer: {
    General: (state = {}) => state,
    [mockNotificationApi.reducerPath]: mockNotificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mockNotificationApi.middleware),
});

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  component: Notification,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeManager>
              <Story />
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
        component: `The **Notification** component displays a list of user notifications in a centralized panel or dropdown.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Notification>;

// Default state story
export const Default: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/notifications",
        method: "GET",
        status: 200,
        response: {
          responseCode: 0,
          response: {
            data: {
              results: [],
              links: { next: null },
            },
          },
        },
      },
    ],
  },
};

// With notifications story
export const WithNotificationOpen: Story = {
  render: () => (
    <Flex justify="end">
      <Notification />
    </Flex>
  ),
  parameters: {
    mockData: [
      {
        url: "/api/notifications",
        method: "GET",
        status: 200,
        response: {
          responseCode: 0,
          response: {
            data: {
              results: mockNotifications,
              links: { next: null },
            },
          },
        },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // 1. Verify notification icon is present
    const notificationBtn = canvas.getByRole("button");
    expect(notificationBtn).toBeInTheDocument();
    // expect(screen.getByTestId("Notification")).toBeInTheDocument();

    // 2. Open notification modal
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await userEvent.click(notificationBtn);

    // 3. Verify modal opens with notifications
    await waitFor(() => {
      expect(body.getByText("Notification")).toBeInTheDocument();
    });
  },
};
