import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect } from 'vitest';

describe('VehicleCard Component', () => {
  const mockVehicle = {
    _id: 'v123',
    make: 'Porsche',
    model: '911 GT3',
    year: 2024,
    price: 185000,
    mileage: 1500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
    description: 'High performance sports car.',
  };

  it('renders vehicle card details correctly', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <VehicleCard vehicle={mockVehicle} />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Porsche')).toBeInTheDocument();
    expect(screen.getByText('911 GT3')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText(/₹1,85,000/i)).toBeInTheDocument();
    expect(screen.getByText('1,500 mi')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
    expect(screen.getByText(/Low Stock \(2\)/i)).toBeInTheDocument();
  });

  it('disables purchase button when vehicle stock is zero', () => {
    const zeroStockVehicle = { ...mockVehicle, stock: 0 };

    render(
      <AuthProvider>
        <BrowserRouter>
          <VehicleCard vehicle={zeroStockVehicle} />
        </BrowserRouter>
      </AuthProvider>
    );

    const purchaseButton = screen.getByRole('button', { name: /out of stock/i });
    expect(purchaseButton).toBeDisabled();
  });
});
