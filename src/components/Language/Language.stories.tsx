import type { Meta, StoryObj } from '@storybook/react';
import Language from './Language';
import ThemeManager from '../ThemeManager/ThemeManager';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { within, expect, userEvent } from '@storybook/test';

const meta: Meta<typeof Language> = {
  title: 'Components/Language',
  component: Language,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `The **Language** component provides a language selector for switching the application's display language.

        Key Features:
        - i18n Integration: Works with i18next for managing translations.
        - Dropdown Language Options: Allows users to switch between available languages (e.g., English, French, etc.).
        - Event Handling: On selecting a new language, it updates the global i18n language state instantly.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Language>;

export const Default: Story = {
  render: () => (
    <I18nextProvider i18n={i18n}>
        <ThemeManager>
        <Language />
        </ThemeManager>
    </I18nextProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Adjust the text below to match what your Language component renders
    await expect(canvas.getByText(/English/i)).toBeInTheDocument();
    // If your component renders language options, check for one:
    const image = document.querySelector(".cls-flag-img");
    await expect(image).toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 1000));
    if(image) {
      await userEvent.click(image);
    }
  },
};
