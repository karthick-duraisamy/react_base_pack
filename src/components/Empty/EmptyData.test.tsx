import { render, screen } from '@testing-library/react';
import EmptyData from './EmptyData';

describe('Checks Empty Data mount', () => {
  test('it should mount', () => {
    render(
      <EmptyData content={''} />
    );
    
    const EmptyDataElement = screen.getByTestId('EmptyData');
    expect(EmptyDataElement).toBeInTheDocument();
  });
});
