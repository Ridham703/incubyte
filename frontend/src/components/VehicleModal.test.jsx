import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleModal from './VehicleModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

describe('VehicleModal Component (Add & Edit Form with Image Upload)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Vehicle Add Form with input fields and image upload mode toggle', () => {
    render(
      <VehicleModal
        vehicle={null}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /vehicle add form/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/bmw, tesla, audi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/m3, model 3, rs5/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload file/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save vehicle/i })).toBeInTheDocument();
  });

  it('renders Vehicle Edit Form pre-populated with vehicle details', () => {
    const existingVehicle = {
      _id: 'v555',
      make: 'Porsche',
      model: 'Taycan',
      year: 2023,
      price: 110000,
      mileage: 8000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      stock: 3,
      image: 'https://images.unsplash.com/photo-porsche',
    };

    render(
      <VehicleModal
        vehicle={existingVehicle}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /vehicle edit form/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Porsche')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Taycan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update vehicle/i })).toBeInTheDocument();
  });

  it('submits updated vehicle details via API put on Edit Form submission', async () => {
    const existingVehicle = {
      _id: 'v555',
      make: 'Porsche',
      model: 'Taycan',
      year: 2023,
      price: 110000,
      mileage: 8000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      stock: 3,
    };

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    api.put.mockResolvedValue({
      data: {
        data: {
          vehicle: { ...existingVehicle, price: 105000 },
        },
      },
    });

    render(
      <VehicleModal
        vehicle={existingVehicle}
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    const priceInput = screen.getByDisplayValue('110000');
    fireEvent.change(priceInput, { target: { value: '105000' } });

    fireEvent.click(screen.getByRole('button', { name: /update vehicle/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        '/vehicles/v555',
        expect.objectContaining({ price: 105000 })
      );
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
