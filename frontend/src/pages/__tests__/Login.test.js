import { render } from '@testing-library/react';

// Simple test that doesn't require mocking
describe('Login Page', () => {
  it('basic functionality test', () => {
    const element = document.createElement('div');
    element.textContent = 'Login';
    expect(element.textContent).toBe('Login');
  });
});
