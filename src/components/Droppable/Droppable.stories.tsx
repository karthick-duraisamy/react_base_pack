import type { Meta, StoryObj } from '@storybook/react';
import Droppable from './Droppable';
import Draggable from '../Draggable/Draggable'; // assuming you have a Draggable component
import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import { expect } from '@storybook/test';
import { within, waitFor } from '@storybook/testing-library';

const meta: Meta<typeof Droppable> = {
  title: 'Components/Droppable',
  component: Droppable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const DndExample = () => {
  const [draggedOver, setDraggedOver] = useState<string>('');

  const handleDragOver = (event: any) => {
    setDraggedOver(event.over?.id || '');
  };

  return (
    <DndContext onDragOver={handleDragOver}>
      <div style={{ display: 'flex', gap: 20 }}>
        <Droppable
          id="drop-zone-1"
          draggedOver={draggedOver}
          droppableClass="droppable-active"
          nonDroppableClass="droppable-inactive"
        >
          <div
            style={{
              width: 150,
              height: 100,
              border: '2px dashed #999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Drop Zone 1
          </div>
        </Droppable>

        <Draggable id="draggable-1">
          <div
            style={{
              width: 100,
              height: 50,
              backgroundColor: '#1890ff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              cursor: 'grab',
            }}
          >
            Drag me
          </div>
        </Draggable>
      </div>
    </DndContext>
  );
};

export const Default: Story = {
  render: () => <DndExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify the render
    await waitFor(() => {
      const dropZone = canvas.getByText('Drop Zone 1');
      const draggable = canvas.getByText('Drag me');
      expect(dropZone).toBeInTheDocument();
      expect(draggable).toBeInTheDocument();
    });
  },
};
