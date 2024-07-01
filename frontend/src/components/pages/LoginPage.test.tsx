import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import LoginPage from './LoginPage';
import toast from 'react-hot-toast';
import { describe, it, expect, vi } from 'vitest';
import { loginMocks, errorLoginMocks } from '../../testing/mockData';

vi.mock('react-hot-toast');

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(
      <MockedProvider
        mocks={[]}
        addTypename={false}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('displays error message if fields are empty', async () => {
    render(
      <MockedProvider
        mocks={[]}
        addTypename={false}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
    });
  });

  it('submits the form successfully', async () => {
    render(
      <MockedProvider
        mocks={loginMocks}
        addTypename={false}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalledWith('Login failed');
    });
  });

  it('displays error message on login failure', async () => {
    render(
      <MockedProvider
        mocks={errorLoginMocks}
        addTypename={false}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });
});
