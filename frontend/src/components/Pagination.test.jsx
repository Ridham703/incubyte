import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import { describe, it, expect, vi } from 'vitest';

describe('Pagination Component', () => {
  it('renders page numbers and items summary', () => {
    const handlePageChange = vi.fn();

    render(
      <Pagination
        page={1}
        totalPages={3}
        totalItems={24}
        limit={8}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();

    const page2Button = screen.getByRole('button', { name: /2/i });
    expect(page2Button).toBeInTheDocument();

    fireEvent.click(page2Button);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page and enables next button', () => {
    const handlePageChange = vi.fn();

    render(
      <Pagination
        page={1}
        totalPages={3}
        totalItems={24}
        limit={8}
        onPageChange={handlePageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    const nextButton = screen.getByRole('button', { name: /next page/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
