import { describe, expect, it } from 'vitest';

import { highlightCodeBlocks } from './highlight-code-blocks';

describe('highlightCodeBlocks', () => {
  it('adds highlight.js token markup to a bare code block', () => {
    const out = highlightCodeBlocks('<pre><code>const x = 1;</code></pre>');

    expect(out).toContain('hljs');
    expect(out).toMatch(/class="hljs-[a-z]+"/);
  });

  it('highlights HubSpot RTE blocks: bare <pre> with <br> lines and &nbsp; indents', () => {
    // HubSpot's rich-text editor emits no <code>, splits lines with <br>, and
    // indents with &nbsp; — see /blog/test-blog.
    const out = highlightCodeBlocks(
      '<pre>function f() {<br>&nbsp;&nbsp;return 1;<br>}</pre>',
    );

    expect(out).toContain('hljs');
    expect(out).toMatch(/class="hljs-[a-z]+"/);
    expect(out).not.toContain('<br>');
  });

  it('auto-detects the language within the configured subset', () => {
    const json = highlightCodeBlocks('<pre><code>{ "name": "x" }</code></pre>');
    expect(json).toContain('language-json');

    const bash = highlightCodeBlocks(
      '<pre><code>export NODE_ENV=production\necho "$HOME"</code></pre>',
    );
    expect(bash).toContain('language-bash');
  });

  it('leaves inline code (not inside a pre) untouched', () => {
    const out = highlightCodeBlocks(
      '<p>Run <code>useState</code> in a component.</p>',
    );

    expect(out).not.toContain('hljs');
    expect(out).toContain('<code>useState</code>');
  });

  it('passes a body with no code block through unchanged', () => {
    const out = highlightCodeBlocks('<h2>Intro</h2><p>No code here.</p>');

    expect(out).toContain('<h2>Intro</h2>');
    expect(out).toContain('<p>No code here.</p>');
    expect(out).not.toContain('hljs');
  });

  it('preserves heading ids injected by the table-of-contents pass', () => {
    const out = highlightCodeBlocks(
      '<h2 id="setup">Setup</h2><pre><code>const x = 1;</code></pre>',
    );

    expect(out).toContain('id="setup"');
    expect(out).toContain('hljs');
  });
});
