import { render, screen } from '@testing-library/react';
import AdhocPnrList from './AdhocPNRList';

describe('<AdhocPNRList />', () => {
  test('it should mount', () => {
    render(<AdhocPnrList />);
    
    const adhocPnrList = screen.getByTestId('AdhocPNRList');

    expect(adhocPnrList).toBeInTheDocument();
  });
});