import type { Meta, StoryObj } from '@storybook/react-vite';
import XLSXUploader, { XLSXUploaderProps } from "./XLSXUploader";
import { expect } from "@storybook/test";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import ThemeManager from "../ThemeManager/ThemeManager";
import { store } from "@/stores/Store";

const meta: Meta<typeof XLSXUploader> = {
  title: "Components/XLSXUploader",
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
  component: XLSXUploader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `The **XLSXUploader** component provides a simple and reusable UI for uploading Excel (.xlsx) files. It uses **Ant Design's Upload component under the hood** and handles Excel file selection, preview, and data extraction (using libraries like \`xlsx\` in your implementation).

        Features:
        - Supports drag-and-drop and click-to-upload for '.xlsx' files.
        - Restricts file type to Excel (MIME: \`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\`).
        - Allows setting max upload count, multiple uploads and custom upload props via props.
        - Provides a callback: \`setUploadedData\` to return parsed Excel data to parent components.
        - Includes a nullify handler to clear uploaded data on file removal.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof XLSXUploader>;

const createMockXLSXFile = (): File => {
  const blob = new Blob(
    [
      `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        </head>
        <body>
          <table><tr><td>Mock</td><td>Data</td></tr></table>
        </body>
        </html>
      `,
    ],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );
  return new File([blob], "test.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

export const Default: Story = {
  args: {
    uploadProps: {
      name: "file",
      multiple: false,
      maxCount: 1,
    },
    nullifyOnDeleteHandler: () => {},
  } as XLSXUploaderProps,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropZone = canvas.getByText(/click/i).closest(".ant-upload");

    await expect(dropZone).toBeInTheDocument();

    const input = dropZone?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = createMockXLSXFile();

    await userEvent.upload(input, file);

    await waitFor(async () => {
      await expect(canvas.getByText("test.xlsx")).toBeInTheDocument();
    });
  },
};

export const MultipleFileUpload: Story = {
  args: {
    uploadProps: {
      name: "files",
      multiple: true,
      maxCount: 3,
    },
    nullifyOnDeleteHandler: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropZone = canvas.getByText(/click/i).closest(".ant-upload");
    
    // Verify multiple upload UI
    // await expect(canvas.getByText(/Upload multiple files/i)).toBeInTheDocument();
    
    // Upload multiple test files
    const input = dropZone?.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      createMockXLSXFile(),
      new File(['content'], 'test2.xlsx', { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    ];
    
    await userEvent.upload(input, files);
    
    await waitFor(async () => {
      await expect(canvas.getByText("test.xlsx")).toBeInTheDocument();
      await expect(canvas.getByText("test2.xlsx")).toBeInTheDocument();
    });
  }
};

export const FileTypeValidation: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropZone = canvas.getByText(/click/i).closest(".ant-upload");
    const input = dropZone?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Try uploading invalid file type
    const invalidFile = new File(['content'], 'test.txt', { type: "text/plain" });
    await userEvent.upload(input, invalidFile);
  }
};

export const FileRemoval: Story = {
  args: {
    ...Default.args,
    setUploadedData: () => {}, // Add mock function
    nullifyOnDeleteHandler: () => {}, // Ensure this is included
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropZone = canvas.getByText(/click/i).closest(".ant-upload");
    const input = dropZone?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Upload file
    await userEvent.upload(input, createMockXLSXFile());
    
    // Verify file appears
    await waitFor(async () => {
      await expect(canvas.getByText("test.xlsx")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Get the remove button
    const fileItems = document.querySelectorAll('.ant-upload-list-item');
    expect(fileItems.length).toBe(1);
    
    const removeButton = fileItems[0].querySelector('.anticon-delete')?.closest('button');
    expect(removeButton).toBeInTheDocument();
    
    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Click the remove button
    if (removeButton) {
      await userEvent.click(removeButton);
    }
    
    // Verify removal
    await waitFor(async () => {
      await expect(canvas.queryByText("test.xlsx")).not.toBeInTheDocument();
    }, { timeout: 3000 });
  }
};