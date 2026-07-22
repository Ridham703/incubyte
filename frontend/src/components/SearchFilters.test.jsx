import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from './SearchFilters';
import { describe, it, expect, vi } from 'vitest';

describe('SearchFilters Component', () => {
  const mockFilters = {
    search: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  it('renders search input and trigger filter change callback', () => {
    const handleFilterChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search make or model/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'BMW' } });

    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'BMW', page: 1 })
    );
  });

  it('shows clear filters button when active filter exists and triggers reset', () => {
    const handleFilterChange = vi.fn();
    const handleReset = vi.fn();

    const activeFilters = { ...mockFilters, search: 'Tesla' };

    render(
      <SearchFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    );

    const resetButton = screen.getByRole('button', { name: /reset all filters/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
