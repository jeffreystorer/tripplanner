import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { DetailsDataFetch } from 'pages';
import * as state from 'store';

export default function DetailsGateway({ page }) {
  console.log(
    '🚀 ~ file: DetailsGateway.js ~ line 7 ~ DetailsGateway ~ page',
    page
  );
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
  console.log(
    '🚀 ~ file: DetailsGateway.js ~ line 9 ~ DetailsGateway ~ currentTripIndex',
    currentTripIndex
  );
  return (
    <>
      {currentTripIndex > -1 ? (
        <DetailsDataFetch page={page} />
      ) : (
        <Navigate to="/pages/trip" />
      )}
    </>
  );
}
