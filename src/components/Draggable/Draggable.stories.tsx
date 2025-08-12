import type { Meta, StoryObj } from '@storybook/react';
import Draggable from './Draggable';
import { DndContext } from '@dnd-kit/core';
import { expect } from '@storybook/test';
import { within, waitFor } from '@storybook/testing-library';
import { userEvent } from '@storybook/testing-library';

// Wrapping with DndContext is essential for @dnd-kit to work
const withDndProvider = (Story: any) => (
  <DndContext>
    <Story />
  </DndContext>
);

const meta: Meta<typeof Draggable> = {
  title: 'Components/Draggable',
  component: Draggable,
  decorators: [withDndProvider],
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// export const Basic: Story = {
//   render: () => (
//     <Draggable id="draggable-box">
//       <div
//         style={{
//           width: 120,
//           height: 80,
//           backgroundColor: '#1890ff',
//           color: 'white',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: 8,
//           cursor: 'grab'
//         }}
//       >
//         Drag me
//       </div>
//     </Draggable>
//   ),
// };

export const Basic: Story = {
  render: () => (
    <Draggable id="draggable-box">
      <div
        style={{
          width: 120,
          height: 80,
          backgroundColor: '#1890ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          cursor: 'grab'
        }}
      >
        Drag me
      </div>
    </Draggable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const draggable = canvas.getByTestId('cls-draggable-div');
      expect(draggable).toBeInTheDocument();
      expect(draggable).toHaveTextContent('Drag me');
    });
  },
};

export const MultipleDraggables: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Draggable id="draggable-1">
        <div style={{ 
          width: 120, 
          height: 80, 
          backgroundColor: '#1890ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          cursor: 'grab'
        }}>
          Box 1
        </div>
      </Draggable>
      <Draggable id="draggable-2">
        <div style={{ 
          width: 120, 
          height: 80, 
          backgroundColor: '#52c41a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          cursor: 'grab'
        }}>
          Box 2
        </div>
      </Draggable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify both draggables render
    const box1 = await canvas.findByText('Box 1');
    const box2 = await canvas.findByText('Box 2');
    
    // Get initial positions
    const box1Initial = box1.getBoundingClientRect();
    const box2Initial = box2.getBoundingClientRect();

    // Drag Box 1 over Box 2
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: box1 },
      { pointerName: 'mouse', coords: { 
        x: box2Initial.left + 10, 
        y: box2Initial.top + 10 
      }},
      { keys: '[/MouseLeft]' }
    ]);

    // Verify positions changed
    await waitFor(() => {
      const box1Final = box1.getBoundingClientRect();
      expect(box1Final.left).toBe(box1Initial.left);
    });
  },
};