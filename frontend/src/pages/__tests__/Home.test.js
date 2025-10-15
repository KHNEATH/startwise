import { render, screen } from '@testing-library/react';
import Home from '../Home';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    // Just test that the component renders without errors
    expect(document.body).toBeInTheDocument();
  });
});
