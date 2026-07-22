import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios');

const TestComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Logged Out'}</span>
      <span data-testid="user-role">{user ? user.role : 'None'}</span>
      <button onClick={logout}>Logout Button</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides default unauthenticated state when no token exists', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user-role')).toHaveTextContent('None');
  });

  it('restores authenticated user from localStorage', () => {
    const mockUser = { id: '1', name: 'Admin User', role: 'admin' };
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    api.get.mockResolvedValue({
      data: { data: { user: mockUser } },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
  });
});
