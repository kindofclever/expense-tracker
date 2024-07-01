import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import {
  Category,
  Gender,
  PaymentType,
  Transaction,
  User,
} from '../../../interfaces/interfaces';
import { mocks } from '../../../testing/mockData';

const mockTransaction: Transaction = {
  id: 1,
  amount: 100,
  location: 'Test Location',
  date: '2023-07-01',
  paymentType: PaymentType.cash,
  description: 'Test Description',
  category: Category.saving,
};

const mockUser: User = {
  id: 1,
  name: 'Test User',
  profilePicture: 'https://via.placeholder.com/150',
  username: 'kindofclever',
  password: 'somehting',
  gender: Gender.Male,
  transactions: [],
};

describe('Card Component', () => {
  it('renders card with transaction details', () => {
    render(
      <MockedProvider
        mocks={mocks}
        addTypename={false}>
        <BrowserRouter>
          <Card
            cardType={Category.saving}
            transaction={mockTransaction}
            authUser={mockUser}
          />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Description: Test Description/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Payment Type: cash/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount: 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Location: Test Location/i)).toBeInTheDocument();
    expect(screen.getByText(/01.07.2023/i)).toBeInTheDocument();
  });
});
