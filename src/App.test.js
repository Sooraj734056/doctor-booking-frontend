import { render, screen } from '@testing-library/react';
import App from './App';
import { CustomThemeProvider } from './context/ThemeContext';

jest.mock('socket.io-client', () => ({
  io: () => ({
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }),
}));

test('renders app header title', async () => {
  render(
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  );
  const linkElement = await screen.findByText(/healthconnect ai/i);
  expect(linkElement).toBeInTheDocument();
});
