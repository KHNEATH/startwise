import { render } from '@testing-library/react';
import Login from '../Login';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock userApi
jest.mock('../../api/userApi', () => ({
  login: jest.fn(),
}));

// Mock auth utils
jest.mock('../../utils/auth', () => ({
  saveToken: jest.fn(),
}));

describe('Login Page', () => {
  it('renders without crashing', () => {
    render(<Login />);
    expect(document.body).toBeInTheDocument();
  });
});
