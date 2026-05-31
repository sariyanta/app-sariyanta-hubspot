// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from './container';

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Inside the container</p>
      </Container>,
    );

    expect(screen.getByText('Inside the container')).toBeInTheDocument();
  });

  it('applies the canonical width ramp', () => {
    render(<Container data-testid="c">x</Container>);

    const el = screen.getByTestId('c');
    expect(el).toHaveClass('max-w-2xl');
    expect(el).toHaveClass('xl:max-w-5xl');
  });

  it('merges a custom className over the base classes', () => {
    render(
      <Container data-testid="c" className="py-16">
        x
      </Container>,
    );

    const el = screen.getByTestId('c');
    expect(el).toHaveClass('py-16');
    expect(el).toHaveClass('mx-auto');
  });
});
