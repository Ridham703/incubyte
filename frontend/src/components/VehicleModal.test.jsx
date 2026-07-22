import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleModal from './VehicleModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

describe('VehicleModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Add Vehicle modal fields correctly', () => {
    render(
      <VehicleModal
        vehicle={null}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/bmw, tesla, audi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/m3, model 3, rs5/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save vehicle/i })).toBeInTheDocument();
  });

  it('submits new vehicle data via API post on form submit', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    api.post.mockResolvedValue({
      data: {
        data: {
          vehicle: {
            _id: 'v999',
            make: 'Toyota',
            model: 'Supra',
            year: 2024,
            price: 55000,
            mileage: 100,
            stock: 2,
          },
        },
      },
    });

    render(
      <VehicleModal
        vehicle={null}
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/bmw, tesla, audi/i), {
      target: { value: 'Toyota' },
    });
    fireEvent.change(screen.getByPlaceholderText(/m3, model 3, rs5/i), {
      target: { value: 'Supra' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. 65000/i), {
      target: { value: '55000' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. 12000/i), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save vehicle/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/vehicles',
        expect.objectContaining({
          make: 'Toyota',
          model: 'Supra',
          price: 55000,
          mileage: 100,
        })
      );
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
