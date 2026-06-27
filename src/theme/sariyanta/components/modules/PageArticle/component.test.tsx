// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';

/*
 * The real <Island> needs HubSpot's build-time loader; mock it to render the
 * island module inline so the SSR output (TOC included) is testable here.
 */
vi.mock('@hubspot/cms-components', () => ({
  Island: ({
    module: Mod,
    wrapperTag: Tag = 'div',
    wrapperClassName,
    toc,
  }: {
    module: ComponentType<{ toc: unknown }>;
    wrapperTag?: keyof JSX.IntrinsicElements;
    wrapperClassName?: string;
    toc: unknown;
  }) => (
    <Tag className={wrapperClassName}>
      <Mod toc={toc} />
    </Tag>
  ),
}));

import { PageArticle } from './component';

interface FieldValues {
  eyebrow?: string;
  title?: string;
  post_body?: string;
}

function renderPage(fieldValues: FieldValues = {}) {
  return render(
    <PageArticle
      fieldValues={{ post_body: '<p>Body paragraph.</p>', ...fieldValues }}
    />,
  );
}

describe('PageArticle', () => {
  it('renders the post body html', () => {
    renderPage({ post_body: '<p>Body paragraph.</p>' });

    expect(screen.getByText('Body paragraph.')).toBeInTheDocument();
  });

  it('renders the eyebrow when set', () => {
    renderPage({ eyebrow: 'Guide' });

    expect(
      screen.getByText('Guide', { selector: '[data-section]' }),
    ).toBeInTheDocument();
  });

  it('omits the eyebrow when left blank', () => {
    const { container } = renderPage({ eyebrow: '' });

    expect(container.querySelector('[data-section]')).toBeNull();
  });

  it('renders the title as a level-1 heading when set', () => {
    renderPage({ title: 'About Us' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'About Us' }),
    ).toBeInTheDocument();
  });

  it('omits the title heading when left blank', () => {
    renderPage({ title: '' });

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders an "On this page" table of contents linking to body headings', () => {
    renderPage({
      post_body: '<p>Intro.</p><h2>Overview</h2><p>x</p><h3>Details</h3>',
    });

    expect(
      screen.getByRole('heading', { name: /on this page/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '#overview',
    );
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '#details',
    );
  });

  it('renders no table of contents when the body has no headings', () => {
    renderPage({ post_body: '<p>Just prose, no headings.</p>' });

    expect(
      screen.queryByRole('heading', { name: /on this page/i }),
    ).not.toBeInTheDocument();
  });
});
