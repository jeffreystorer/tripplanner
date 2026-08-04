import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from 'react-error-boundary';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';
// Imported from their files, not the '@/components/common' and '@/pages'
// barrels: a barrel import pulls in every module it re-exports, which would
// drag all the lazy pages straight back into the initial chunk.
import ErrorFallback from '@/components/common/ErrorFallback';
import RouteErrorFallback from '@/components/common/RouteErrorFallback';
import Layout from '@/components/common/Layout';
import Loading from '@/components/common/Loading';
import SignInPage from '@/pages/SignInPage';

const ConfirmDeleteModal = lazy(() =>
  import('@/components/common/ConfirmDeleteModal')
);

// Everything else is split into its own chunk, fetched the first time its
// route is visited. These import the page FILES directly rather than going
// through '@/pages' - a barrel import pulls in every page it re-exports and
// would undo the splitting entirely.
const AddPage = lazy(() => import('@/pages/AddPage'));
const DetailPage = lazy(() => import('@/pages/DetailPage'));
const DetailsPage = lazy(() => import('@/pages/DetailsPage'));
const EditDetailPage = lazy(() => import('@/pages/EditDetailPage'));
const EditPage = lazy(() => import('@/pages/EditPage'));
const ItineraryPage = lazy(() => import('@/pages/ItineraryPage'));
const LogPage = lazy(() => import('@/pages/LogPage'));
const MovePage = lazy(() => import('@/pages/MovePage'));
const TripPage = lazy(() => import('@/pages/TripPage'));


const router = createBrowserRouter (
  createRoutesFromElements(
    <>
    <Route
      path="/"
      element={<SignInPage />}
      errorElement={<RouteErrorFallback />}
    />
    <Route
      path="/pages"
      element={<Layout />}
      errorElement={<RouteErrorFallback />}
    >
      <Route path='confirmdelete' element={<ConfirmDeleteModal />} />
      <Route
        path="activity"
        element={<DetailsPage page={'activity'} />}
      />
      <Route path="addactivity" element={<AddPage page={'activity'} />} />
      <Route
        path="/pages/editactivity/:rowIndex"
        element={<EditPage page={'activity'} />}
      />
      <Route path="car" element={<DetailsPage page={'car'} />} />
      <Route path="addcar" element={<AddPage page={'car'} />} />{' '}
      <Route
        path="/pages/editcar/:rowIndex"
        element={<EditPage page={'car'} />}
      />
      <Route
        path="itinerary"
        element={<ItineraryPage />}
        errorElement={<RouteErrorFallback />}
      />
      <Route
        path="itinerarydetail"
        element={<DetailPage type={'itinerary'}/>}
      />
      <Route
        path="additinerarynote"
        element={<AddPage page={'itinerarynote'} />}
      />
      <Route
        path="additineraryactivity"
        element={<AddPage page={'itineraryactivity'} />}
      />
      <Route
        path="additinerarycar"
        element={<AddPage page={'itinerarycar'} />}
      />
      <Route
        path="additinerarymap"
        element={<AddPage page={'itinerarymap'} />}
      />
      <Route
        path="additineraryroom"
        element={<AddPage page={'itineraryroom'} />}
      />
      <Route
        path="additinerarytransport"
        element={<AddPage page={'itinerarytransport'} />}
      />
      <Route path="edititinerary" element={<EditDetailPage type={'itinerary'} />} />
      <Route path="map" element={<DetailsPage page={'map'} />} />
      <Route path="addmap" element={<AddPage page={'map'} />} />
      <Route
        path="/pages/editmap/:rowIndex"
        element={<EditPage page={'map'} />}
      />
      <Route path="note" element={<DetailsPage page={'note'} />} />
      <Route path="addnote" element={<AddPage page={'note'} />} />
      <Route
        path="/pages/editnote/:rowIndex"
        element={<EditPage page={'note'} />}
      />
      <Route path="room" element={<DetailsPage page={'room'} />} />
      <Route path="addroom" element={<AddPage page={'room'} />} />
      <Route
        path="/pages/editroom/:rowIndex"
        element={<EditPage page={'room'} />}
      />
      <Route path="transport" element={<DetailsPage page={'transport'} />} />
      <Route path="addtransport" element={<AddPage page={'transport'} />} />
      <Route
        path="/pages/edittransport/:rowIndex"
        element={<EditPage page={'transport'} />}
      />
      <Route path="trip" element={<TripPage />} />
      <Route
        path="tripdetail"
        element={<DetailPage type={'trip'}/>}
      />
      <Route path="edittripdetail" element={<EditDetailPage type={'trip'} />} />
      <Route path="addtrip" element={<AddPage page={'trip'} />} />
      <Route
        path="/pages/edittrip/:rowIndex"
        element={<EditPage page={'trip'} />}
      />
      <Route
        path="/pages/movetrip/:rowIndex"
        element={<MovePage />}
      />
      <Route
        path="/pages/log"
        element={<LogPage />}
      />
      </Route>
    </>   
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </StrictMode>
);
