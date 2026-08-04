//Shown when a data read fails: no network, a permissions problem, or a bug in
//building a page. Explains the failure instead of bouncing to the sign-in
//screen, and keeps the user where they were.
export default function ErrorFallback({ error }) {
  const offline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div id='error-fallback'>
      <h2>Something went wrong</h2>
      <p>
        {offline
          ? 'You appear to be offline. Your trip data could not be loaded.'
          : 'Your trip data could not be loaded.'}
      </p>
      <p>
        <small>{error?.message ?? String(error)}</small>
      </p>
      <div>
        <button onClick={() => window.location.reload()}>Try again</button>
        <button onClick={() => (window.location = '/')}>Sign in again</button>
      </div>
    </div>
  );
}
