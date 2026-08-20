import { Fragment } from 'react';
import toMapsHref from '@/utils/mapLinks';

// [label](url) first, then a bare URL. Both are captured in one pass so a
// bare URL sitting inside a bracket form is not matched twice.
const LINK_PATTERN = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>[\]]+)/g;

// Trailing punctuation is almost always sentence punctuation rather than part
// of the URL: "see https://example.com/x." should not link the full stop.
const TRAILING = /[.,;:!?)\]}'"]+$/;

const MAX_VISIBLE = 40;

function shorten(url) {
  if (url.length <= MAX_VISIBLE) return url;
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, '');
    if (pathname && pathname !== '/') return `${host}/…`;
    return host;
  } catch {
    return url.slice(0, MAX_VISIBLE) + '…';
  }
}

/**
 * Turns URLs inside free text into anchors, returning an array of strings and
 * elements suitable for rendering directly.
 *
 * Supports two forms:
 *   [label](https://example.com)  - reads as prose, hides a long URL
 *   https://example.com          - linkified with shortened display text
 *
 * Everything between links is returned untouched, so `white-space: pre-wrap`
 * keeps its line breaks. Malformed input is left as literal text rather than
 * producing a dead link.
 */
export default function linkify(text) {
  if (!text || typeof text !== 'string') return text;

  const out = [];
  let lastIndex = 0;
  let match;

  //the regex is stateful because of the /g flag, so reset before each use
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [full, bracketLabel, bracketUrl, bareUrl] = match;

    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }

    let href = bracketUrl ?? bareUrl;
    let label = bracketLabel;
    let trailing = '';

    if (!bracketUrl) {
      // strip sentence punctuation off a bare URL and re-emit it as text
      const stripped = href.replace(TRAILING, '');
      trailing = href.slice(stripped.length);
      href = stripped;
      label = shorten(href);
    }

    out.push(
      <a
        key={`${match.index}-${href}`}
        href={toMapsHref(href)}
        target='_blank'
        rel='noopener noreferrer'
        //note and itinerary rows carry an onClick that navigates to the detail
        //screen; without this, tapping a link would do both
        onClick={e => e.stopPropagation()}
      >
        {label}
      </a>
    );
    if (trailing) out.push(trailing);

    lastIndex = match.index + full.length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) out.push(text.slice(lastIndex));

  return out.map((part, i) =>
    typeof part === 'string' ? <Fragment key={`t${i}`}>{part}</Fragment> : part
  );
}
