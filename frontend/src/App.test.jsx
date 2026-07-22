import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the DrivePulse Car Dealership Inventory brand title', () => {
    render(<App />);
    const brandElements = screen.getAllByText(/DrivePulse/i);
    expect(brandElements.length).toBeGreaterThan(0);
    expect(brandElements[0]).toBeInTheDocument();

    const inventoryElements = screen.getAllByText(/Inventory System/i);
    expect(inventoryElements.length).toBeGreaterThan(0);
    expect(inventoryElements[0]).toBeInTheDocument();
  });
});
