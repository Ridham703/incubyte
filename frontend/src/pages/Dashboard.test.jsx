import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays vehicles list after successful API fetch', async () => {
    const mockVehicles = [
      {
        _id: '1',
        make: 'BMW',
        model: 'M4',
        year: 2023,
        price: 78000,
        mileage: 4500,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 5,
      },
    ];

    api.get.mockResolvedValue({
      data: { data: { vehicles: mockVehicles } },
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Explore Available Vehicles')).toBeInTheDocument();
      expect(screen.getByText('BMW')).toBeInTheDocument();
      expect(screen.getByText('M4')).toBeInTheDocument();
    });
  });

  it('displays error state when API request fails', async () => {
    api.get.mockRejectedValue({
      response: { data: { message: 'Network error occurred' } },
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to Fetch Inventory')).toBeInTheDocument();
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });
  });
});
