import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound Component', () => {
  it('renders 404 page with navigation back button', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to inventory showroom/i })).toBeInTheDocument();
  });
});
