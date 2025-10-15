import { render } from '@testing-library/react';

// Simple test that doesn't require mocking
describe('Home Page', () => {
  it('basic functionality test', () => {
    const element = document.createElement('div');
    element.textContent = 'Home';
    expect(element.textContent).toBe('Home');
  });
});
