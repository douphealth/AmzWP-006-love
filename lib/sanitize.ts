import DOMPurify from 'dompurify';

const SAFE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
    'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr',
    'th', 'td', 'div', 'span', 'section', 'article', 'aside', 'header',
    'footer', 'nav', 'sup', 'sub', 'hr', 'dl', 'dt', 'dd',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target',
    'rel', 'width', 'height', 'loading', 'decoding', 'colspan', 'rowspan',
    'scope',
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
  RETURN_TRUSTED_TYPE: false,
};

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, SAFE_CONFIG) as string;
}

export function sanitizePlainText(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], RETURN_TRUSTED_TYPE: false }) as string;
}
