import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';
import {
  transactionDataMock,
  userMock,
  logoutErrorMock,
  mocks,
} from '../../testing/mockData';

vi.mock('react-chartjs-2', () => ({
  Pie: () => null,
}));

vi.mock('react-hot-toast');

describe('HomePage', () => {
  it('renders the home page', async () => {
    render(
      <MockedProvider
        mocks={mocks}
        addTypename={false}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Spend wisely, track wisely/i)
      ).toBeInTheDocument();
    });
  });

  it('handles logout successfully', async () => {
    render(
      <MockedProvider
        mocks={mocks}
        addTypename={false}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('logout-icon'));

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('displays error message on logout failure', async () => {
    const errorMocks = [
      transactionDataMock,
      userMock,
      logoutErrorMock,
      userMock,
    ];

    render(
      <MockedProvider
        mocks={errorMocks}
        addTypename={false}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('logout-icon'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Logout failed');
    });
  });
});
