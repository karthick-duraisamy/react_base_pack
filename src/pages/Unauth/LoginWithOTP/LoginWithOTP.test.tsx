import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import LoginWithOTP from './LoginWithOTP';

it('renders LoginWithOTP', () => {
  render(
    <CommonTestWrapper>
      <LoginWithOTP />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('loginWithOTP')).toBeInTheDocument();
});
