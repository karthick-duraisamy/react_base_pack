import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

it('renders Footer', () => {
  render(<Footer />);
  expect(screen.getByText("Powered by Infiniti Software Solutions")).toBeInTheDocument();
});
