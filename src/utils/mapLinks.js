// Hosts whose URLs are already valid Google Maps links and should be
// passed through untouched (this includes the maps.app.goo.gl short
// links produced by the Maps share sheet on mobile).
const MAPS_HOSTS = [
  'google.com',
  'www.google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
  'g.co',
];

/**
 * Turns whatever the user typed into an https Google Maps URL.
 *
 * Accepts a pasted Maps link, a bare host/path, a plain address, a place
 * name, or "lat,lng". Anything that is not recognisably a Maps URL is
 * turned into a Maps search.
 *
 * The returned URL is a plain https link, which is what makes this work
 * everywhere: iOS and Android open the Google Maps app via universal /
 * app links when it is installed, and desktop browsers open the website.
 * No user-agent sniffing, custom URL schemes, or API key required.
 */
export default function toMapsHref(raw) {
  const text = (raw ?? '').trim();
  if (!text) return '';

  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (MAPS_HOSTS.includes(url.hostname.toLowerCase())) {
      return url.toString();
    }
  } catch (error) {
    // Not parseable as a URL - treat it as a search term below.
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    text
  )}`;
}
