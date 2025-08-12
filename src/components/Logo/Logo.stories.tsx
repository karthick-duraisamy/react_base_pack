import type { Meta, StoryObj } from '@storybook/react-vite';
import Logo from "./Logo";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../stores/Store";
import { expect } from '@storybook/test';

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `The **Logo** component displays the company's brand logo, typically used in the application header, footer, or authentication screens.

        Key Features:
        - Routing Support: Often wrapped inside a \`<Link>\` to redirect users to the homepage when clicked.
        
        Common Use Cases:
        - Branding inside the application header
        - Login / Landing pages
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

export const Default: Story = {
  render: () => (
    <AllProviders>
      <Logo />
    </AllProviders>
  ),
  play: async () => {
    const image = document.querySelector(".cls-logoImage");
    await expect(image).toBeInTheDocument();
  },
};
