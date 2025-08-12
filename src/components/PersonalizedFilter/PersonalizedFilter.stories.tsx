import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import PersonalizedFilter, { CustomFilterType } from './PersonalizedFilter';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { store } from '@/stores/Store';
import ThemeManager from '../ThemeManager/ThemeManager';
import { expect, within, waitFor, userEvent } from "@storybook/test";

// Mock data
const mockTableData = [
  { id: 1, name: 'John Doe', status: 'active', department: 'IT', date: '2023-01-15' },
  { id: 2, name: 'Jane Smith', status: 'inactive', department: 'HR', date: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', status: 'active', department: 'Finance', date: '2023-03-10' },
];

const mockFilters: CustomFilterType[] = [
  {
    key: 'status',
    label: 'Status',
    option: {
      key: 'status',
      type: 'default'
    }
  },
  {
    key: 'department',
    label: 'Department',
    option: {
      key: 'department',
      type: 'default'
    }
  },
  {
    key: 'date',
    label: 'Date Range',
    option: {
      key: 'date',
      type: 'date'
    },
    date: true
  },
  {
    key: 'name__department',
    label: 'Name or Department',
    option: {
      key: 'name__department',
      type: 'split'
    }
  }
];

// Mock hooks
(window as any).useRedirect = () => ({
  currentPath: '/example'
});

(window as any).useResize = () => ({
  isSmallScreen: false
});

const meta: Meta<typeof PersonalizedFilter> = {
  title: 'Components/PersonalizedFilter',
  component: PersonalizedFilter,
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
    )
  ],
  tags: ["autodocs"],
  argTypes: {
    tableData: { control: 'object' },
    filters: { control: 'object' },
    visibleColumns: { control: 'object' },
    setTableData: { action: 'setTableData' },
    tableDataPreparationHandler: { action: 'tableDataPreparationHandler' }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   args: {
//     tableData: mockTableData,
//     filters: mockFilters,
//     setTableData: fn(),
//     tableDataPreparationHandler: fn()
//   }
// };

export const Default: Story = {
  args: {
    tableData: mockTableData,
    filters: mockFilters,
    setTableData: fn(),
    tableDataPreparationHandler: fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify initial render
    const filterButton = canvas.getByRole('button');
    expect(filterButton).toBeInTheDocument();
  }
};

export const FilterOpened: Story = {
  args: {
    tableData: mockTableData,
    filters: mockFilters,
    setTableData: fn(),
    tableDataPreparationHandler: fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // 1. Verify initial render
    const filterButton = canvas.getByRole('button');
    expect(filterButton).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // 2. Open filter drawer
    await userEvent.click(filterButton);
    
    // 3. Verify drawer contents
    await waitFor(() => {
      expect(body.getByText('Filters')).toBeInTheDocument();
      expect(body.getByText('Reset All')).toBeInTheDocument();
      expect(body.getByText('Saved Filters')).toBeInTheDocument();
    });

    // 4. Verify filter fields
    const statusField = body.getByLabelText('Status');
    const deptField = body.getByLabelText('Department');
    const dateField = body.getByPlaceholderText('Select date');
    
    expect(statusField).toBeInTheDocument();
    expect(deptField).toBeInTheDocument();
    expect(dateField).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 5. Interact with filter fields
    await userEvent.click(statusField);
  }
};