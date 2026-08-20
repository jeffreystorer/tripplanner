// Hosts whose URLs open Google Maps. google.com is here for /maps paths only -
// a Google Doc is also on google.com and must not be treated as a map.
const MAPS_HOSTS = [
  'google.com',
  'www.google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
  'g.co',
];

// Google's document hosts are a small fixed set, so inference works well here.
// Ordinary hotel and airline sites live on hundreds of domains and correctly
// fall through to the neutral 'web' globe.
const DOC_HOSTS = [
  'docs.google.com',
  'drive.google.com',
  'sheets.google.com',
  'slides.google.com',
];

const MAIL_HOSTS = [
  'mail.google.com',
  'outlook.live.com',
  'outlook.office.com',
  'outlook.office365.com',
  'mail.yahoo.com',
  'mail.proton.me',
  'app.fastmail.com',
];

function parse(text) {
  try {
    return new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
}

function isMapsUrl(url) {
  const host = url.hostname.toLowerCase();
  if (!MAPS_HOSTS.includes(host)) return false;
  // google.com hosts far more than Maps, so require a /maps path there.
  // The short-link and maps.* hosts are unambiguous.
  if (host === 'google.com' || host === 'www.google.com') {
    return url.pathname.toLowerCase().startsWith('/maps');
  }
  return true;
}

/**
 * Turns whatever the user typed into an https URL.
 *
 * A valid URL on any host is passed through untouched, so this handles map
 * links, webmail deep links, hotel confirmations, and anything else. Only text
 * that is not a URL at all - a place name, an address, "lat,lng" - is turned
 * into a Google Maps search, which is almost always what is wanted when
 * someone types a place rather than pasting a link.
 *
 * The result is a plain https link, which is what makes it work everywhere:
 * iOS and Android hand off to the Google Maps app via universal / app links
 * when it is installed, and desktop browsers open the website. No user-agent
 * sniffing, custom URL schemes, or API key required.
 */
export default function toMapsHref(raw) {
  const text = (raw ?? '').trim();
  if (!text) return '';

  const url = parse(text);
  // require a dot in the hostname so "Colosseum, Rome" is not mistaken for a
  // host - new URL() is happy to parse a bare word as one
  if (url && url.hostname.includes('.')) {
    return url.toString();
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    text
  )}`;
}

/**
 * Which icon a link should carry, inferred from its host. Falls back to 'web',
 * so an unrecognised link gets a neutral globe rather than a wrong icon.
 */
export function linkKind(href) {
  const url = parse(href ?? '');
  if (!url) return 'web';
  const host = url.hostname.toLowerCase();
  if (MAIL_HOSTS.includes(host)) return 'mail';
  if (DOC_HOSTS.includes(host)) return 'doc';
  if (isMapsUrl(url)) return 'map';
  return 'web';
}
