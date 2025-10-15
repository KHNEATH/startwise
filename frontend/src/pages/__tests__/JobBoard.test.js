import { render } from '@testing-library/react';
import JobBoard from '../JobBoard';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock jobApi
jest.mock('../../api/jobApi', () => ({
  fetchJobs: jest.fn(() => Promise.resolve([])),
  postJob: jest.fn(),
  applyToJob: jest.fn(),
  quickApply: jest.fn(),
}));

describe('JobBoard Page', () => {
  it('renders without crashing', () => {
    render(<JobBoard />);
    expect(document.body).toBeInTheDocument();
  });
});
