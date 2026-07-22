import { render, screen } from '@testing-library/react';
import VehicleCard from './VehicleCard';
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
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('Porsche')).toBeInTheDocument();
    expect(screen.getByText('911 GT3')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('$185,000')).toBeInTheDocument();
    expect(screen.getByText('1,500 mi')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
    expect(screen.getByText(/Low Stock \(2\)/i)).toBeInTheDocument();
  });
});
