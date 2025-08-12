import React from "react";
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from "@storybook/test";
import Advertisement from "./Advertisement";
import { Card, Carousel, Col, Row, Image, Typography } from "antd";
import ad from "@/assets/images/common/advertisement.webp";

const { Title, Text } = Typography;

const mockUpcomingEvents = [
  {
    day: "15",
    month: "June 2023",
    text: "Summer Travel Sale",
    time: "10:00 AM - 6:00 PM",
  },
  {
    day: "22",
    month: "July 2023",
    text: "International Flight Discounts",
    time: "All Day",
  },
];

const meta: Meta<typeof Advertisement> = {
  title: "Components/Advertisement",
  component: Advertisement,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **Advertisement** component displays a promotional banner image along with a carousel of upcoming events.

          Key Features:
          📢 Advertisement Banner: Displays a static advertisement image at the top.
          🗓️ Upcoming Events Carousel:
            - Auto-playing carousel that cycles through upcoming event data fetched from an API.
            - Each slide shows:
              - Event date
              - Description text
              - Time
          `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Advertisement>;

const AdvertisementWithMockData = ({ mockData }: { mockData: any[] }) => {
  const [upcomingEventData] = React.useState(mockData);

  return (
    <div data-testid="Advertisement" style={{ width: "40%" }}>
      <Row>
        <Col span={24}>
          <Image
            src={ad}
            width="100%"
            height="215px"
            className="cls-ad-img"
            data-testid="advertisement-image"
            alt="Advertisement"
            preview={false}
          />
        </Col>
      </Row>
      <Row className="pt-2 mt-4 cls-upcoming-event-container">
        <Col span={24}>
          <Card data-testid="upcoming-events-card">
            <Title level={5} className="fs-18 cls-upcoming-event-title">
              Upcoming Events
            </Title>
            <Col span={24} className="cls-upcoming-event-carousel">
              {upcomingEventData.length > 0 ? (
                <Carousel
                  autoplay
                  dots={true}
                  dotPosition="bottom"
                  className="custom-carousel"
                  data-testid="events-carousel"
                >
                  {upcomingEventData?.map((value, index) => (
                    <Row
                      key={index}
                      data-testid={`upcoming-event-${index}`}
                      className="pt-1 pb-5 pl-3 cls-db-event-ele"
                    >
                      <Col span={24}>
                        <h1 className="fs-30 f-sbold cls-db-date">
                          {value.day}
                        </h1>
                      </Col>
                      <Col span={24}>
                        <p className="fs-12 pb-4">{value.month}</p>
                      </Col>
                      <Col span={24}>
                        <p className="mt-1 fs-13">{value.text}</p>
                      </Col>
                      <Col span={24}>
                        <Text className="fs-12 f-sbold">{value.time}</Text>
                      </Col>
                    </Row>
                  ))}
                </Carousel>
              ) : (
                <div data-testid="no-events-message">No upcoming events</div>
              )}
            </Col>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const Default: Story = {
  render: () => <AdvertisementWithMockData mockData={mockUpcomingEvents} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify advertisement container and image", async () => {
      await expect(canvas.getByTestId("Advertisement")).toBeInTheDocument();
      const adImage = canvas.getByTestId("advertisement-image");
      await expect(adImage).toBeInTheDocument();
    });

    await step("Verify upcoming events section", async () => {
      const card = canvas.getByTestId("upcoming-events-card");
      await expect(card).toBeInTheDocument();
      await expect(canvas.getByText("Upcoming Events")).toBeInTheDocument();
    });
  },
};

export const WithSingleEvent: Story = {
  render: () => (
    <AdvertisementWithMockData
      mockData={[
        {
          day: "01",
          month: "January 2024",
          text: "New Year Special",
          time: "All Day",
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify only one event exists
    const events = await canvas.findAllByTestId(/upcoming-event-/);
    expect(events.length).toBe(1);

    // Verify event content
    await expect(within(events[0]).getByText("01")).toBeInTheDocument();
    await expect(
      within(events[0]).getByText("January 2024")
    ).toBeInTheDocument();
    await expect(
      within(events[0]).getByText("New Year Special")
    ).toBeInTheDocument();
    await expect(within(events[0]).getByText("All Day")).toBeInTheDocument();

  },
};

export const WithNoEvents: Story = {
  render: () => <AdvertisementWithMockData mockData={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify no events are displayed
    await expect(
      canvas.queryByTestId(/upcoming-event-/)
    ).not.toBeInTheDocument();
    await expect(canvas.getByText("Upcoming Events")).toBeInTheDocument();

    // Verify empty state message
    await expect(canvas.getByTestId("no-events-message")).toBeInTheDocument();
    await expect(canvas.getByText("No upcoming events")).toBeInTheDocument();
  },
};

export const WithCarouselAutoplay: Story = {
  render: () => <AdvertisementWithMockData mockData={mockUpcomingEvents} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify heading is visible
    await expect(await canvas.findByText('Upcoming Events')).toBeInTheDocument();
    const events = await canvas.findAllByTestId(/upcoming-event-/);
    expect(events.length).toBe(5);

    // Verify 1st event content
    await expect(within(events[0]).getByText("22")).toBeInTheDocument();
    await expect(within(events[0]).getByText("July 2023")).toBeInTheDocument();
    await expect(within(events[0]).getByText("International Flight Discounts")).toBeInTheDocument();
    await expect(within(events[0]).getByText("All Day")).toBeInTheDocument();

    // Verify 2nd event content
    await expect(within(events[1]).getByText("15")).toBeInTheDocument();
    await expect(within(events[1]).getByText("June 2023")).toBeInTheDocument();
    await expect(within(events[1]).getByText("Summer Travel Sale")).toBeInTheDocument();
    await expect(within(events[1]).getByText("10:00 AM - 6:00 PM")).toBeInTheDocument();

  },
};

export const WithImageError: Story = {
  render: () => {
    // Force image error by providing invalid src
    return (
      <div data-testid="Advertisement" style={{ width: "40%" }}>
        <Row>
          <Col span={24}>
            <Image
              src="invalid-image-src"
              width="100%"
              height="215px"
              className="cls-ad-img"
              data-testid="advertisement-image"
              alt="Advertisement"
              preview={false}
            />
          </Col>
        </Row>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image: HTMLImageElement | null = await canvas.getByTestId('advertisement-image').querySelector("img");

    if(image) {
      // Assert it's still using the broken src
      await expect(image).toHaveAttribute('src', 'invalid-image-src');
    }
  },
};
