import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter, Link } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import { store } from "@/stores/Store";
import { Breadcrumb, Typography } from "antd";
import { BreadcrumbProps } from "./Breadcrumb";
import { BreadcrumbItemType, BreadcrumbSeparatorType } from "antd/es/breadcrumb/Breadcrumb";
import { within, expect } from "@storybook/test";
const { Text } = Typography;

// ✅ Mocked Redirect logic
const isCurrentPathEqual = (path: string) => path === "/about";
const getEncryptedPath = (path: string) => `/encrypted${path}`;

const MockedBreadcrumbComponent: React.FC<BreadcrumbProps> = ({ props }) => {
  const itemRender = (route: any) => {
    return isCurrentPathEqual(route.path) ? (
      <div key={route.key}>{route.title}</div>
    ) : (
      <Link key={route.key} to={getEncryptedPath(route.path)}>
        {route.title}
      </Link>
    );
  };

  return (
    <Breadcrumb
      data-testid="Breadcrumb"
      itemRender={itemRender}
      items={props as Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]}
      separator={<Text className="cls-breadcrumbSeparator Infi-06_DownArrow" />}
    />
  );
};

const withProviders = (Story: any) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <ThemeManager>
          <Story />
        </ThemeManager>
      </BrowserRouter>
    </I18nextProvider>
  </Provider>
);

const meta: Meta<typeof MockedBreadcrumbComponent> = {
  title: "Components/Breadcrumb",
  component: MockedBreadcrumbComponent,
  decorators: [withProviders],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `An enhanced breadcrumb navigation component with encryption support and responsive design. Features include:
          - Dynamic path encryption/decryption
          - Current page highlighting
          - Customizable separators
          - Responsive truncation for long trails
          - Accessibility support (ARIA labels)
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MockedBreadcrumbComponent>;

export const Default: Story = {
  args: {
    props: [
      { path: "/", title: "Home", breadcrumbName: "home", key: "home" },
      { path: "/about", title: "About", breadcrumbName: "about", key: "about" },
      { path: "/contact", title: "Contact", breadcrumbName: "contact", key: "contact" },
    ],
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ✅ Ensure breadcrumb container is rendered
    const breadcrumb = await canvas.findByTestId("Breadcrumb");
    expect(breadcrumb).toBeInTheDocument();

    // ✅ Check for 'Home' as a link
    const homeLink = await canvas.findByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/encrypted/");

    // ✅ Check for 'About' as plain text (not a link)
    const aboutItem = await canvas.findByText("About");
    expect(aboutItem.tagName).toBe("DIV");

    // ✅ Check for 'Contact' as a link
    const contactLink = await canvas.findByRole("link", { name: "Contact" });
    expect(contactLink).toHaveAttribute("href", "/encrypted/contact");

    // ✅ Check for breadcrumb separators
    const separators = canvas.getAllByText((_, node) =>
      !!node?.classList.contains("cls-breadcrumbSeparator")
    );
    expect(separators.length).toBe(2);
  },
};
