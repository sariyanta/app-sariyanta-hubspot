export { Component } from './component';

/*
 * Unlike BlogArticle (fed a HubL `article` DTO, so its `fields` array is empty),
 * PageArticle is fields-driven: an editor authors its content inline in the page
 * editor. Fields are flat (no groups) so the module is fast to fill in. `post body`
 * is required with default text so a freshly dropped module is never empty and
 * immediately shows what it is for. `eyebrow` and `title` are optional — the
 * component guards each with `&&` and simply omits it when left blank.
 * `show_toc` lets an editor hide the table-of-contents sidebar; when off the
 * article spans the full width.
 */
export const fields = [
  {
    name: 'eyebrow',
    label: 'Eyebrow',
    type: 'text',
    required: false,
    default: '',
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: false,
    default: '',
  },
  {
    name: 'post_body',
    label: 'Post body',
    type: 'richtext',
    required: true,
    default:
      '<h2>Section heading</h2><p>Write your article here. Headings become a table of contents, and code blocks are syntax-highlighted.</p>',
  },
  {
    name: 'show_toc',
    label: 'Show table of contents',
    type: 'boolean',
    required: false,
    default: true,
  },
];

export const meta = {
  label: 'PageArticle',
};
