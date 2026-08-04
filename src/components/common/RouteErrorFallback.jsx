import { useRouteError } from 'react-router-dom';
import ErrorFallback from '@/components/common/ErrorFallback';

//React Router catches errors thrown while rendering a route with its own
//boundary, which takes precedence over the react-error-boundary at the root.
//This adapts the router's error into the same fallback UI.
//
//Must be imported eagerly: if this were lazy, an offline failure would try to
//fetch its chunk to report the offline failure, and fail again.
export default function RouteErrorFallback() {
  const error = useRouteError();
  return <ErrorFallback error={error} />;
}
