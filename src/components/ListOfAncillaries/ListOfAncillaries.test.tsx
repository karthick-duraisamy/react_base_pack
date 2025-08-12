import { render, screen } from '@testing-library/react';
import ListOfAncillaries from './ListOfAncillaries';

describe('<ListOfAncillaries />', () => {
  test('it should mount', () => {
    render(<ListOfAncillaries page={''} />);
    
    const listOfAncillaries = screen.getByTestId('ListOfAncillaries');

    expect(listOfAncillaries).toBeInTheDocument();
  });
});