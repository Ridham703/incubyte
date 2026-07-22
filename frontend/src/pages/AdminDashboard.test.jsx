import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

describe('AdminDashboard Page', () => {
  const mockVehicles = [
    {
      _id: 'v1',
      make: 'Mercedes-Benz',
      model: 'AMG GT',
      year: 2024,
      price: 160000,
      stock: 3,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
    {
      _id: 'v2',
      make: 'Lucid',
      model: 'Air Sapphire',
      year: 2024,
      price: 240000,
      stock: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin dashboard statistics cards and vehicle inventory table', async () => {
    api.get.mockResolvedValue({
      data: { data: { vehicles: mockVehicles } },
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin management panel/i })).toBeInTheDocument();
      expect(screen.getByText('2 Models')).toBeInTheDocument(); // Total Models
      expect(screen.getByText('Mercedes-Benz AMG GT')).toBeInTheDocument();
      expect(screen.getByText('Lucid Air Sapphire')).toBeInTheDocument();
      expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });
  });
});
