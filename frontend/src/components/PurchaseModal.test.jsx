import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PurchaseModal from './PurchaseModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

describe('PurchaseModal Component', () => {
  const mockVehicle = {
    _id: 'v101',
    make: 'Audi',
    model: 'RS6 Avant',
    year: 2024,
    price: 125000,
    stock: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with vehicle information when isOpen is true', () => {
    render(
      <PurchaseModal
        vehicle={mockVehicle}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /confirm purchase/i })).toBeInTheDocument();
    expect(screen.getByText(/2024 Audi RS6 Avant/i)).toBeInTheDocument();
    expect(screen.getByText(/₹1,25,000/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('submits purchase request to API on confirm button click', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    api.post.mockResolvedValue({
      data: {
        data: {
          vehicle: { ...mockVehicle, stock: 2 },
        },
      },
    });

    render(
      <PurchaseModal
        vehicle={mockVehicle}
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/v101/purchase', { quantity: 1 });
      expect(handleSuccess).toHaveBeenCalledWith(expect.objectContaining({ stock: 2 }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
