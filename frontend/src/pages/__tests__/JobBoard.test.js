import { render, screen } from '@testing-library/react';
import JobBoard from '../JobBoard';
import { BrowserRouter } from 'react-router-dom';

describe('JobBoard Page', () => {
  it('renders job board title', () => {
    render(
      <BrowserRouter>
        <JobBoard />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
