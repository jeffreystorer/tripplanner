import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from 'react-error-boundary';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { ConfirmDeleteModal, Layout, Loading } from '@/components/common';
import {
  SignInPage,
  DetailsPage,
  AddPage,
  EditPage,
  ItineraryPage,
  ItineraryPageErrorBoundary,
  DetailPage,
  EditDetailPage,
  TripPage,
  MovePage,
  LogPage
} from '@/pages';


const router = createBrowserRouter (
  createRoutesFromElements(
    <>
    <Route path="/" element={<SignInPage />} />
    <Route path="/pages" element={<Layout />}>
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
      <Route path="itinerary" element={<ItineraryPage />} 
        errorElement={<ItineraryPageErrorBoundary />}
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
        path="additineraryroom"
        element={<AddPage page={'itineraryroom'} />}
      />
      <Route
        path="additinerarytransport"
        element={<AddPage page={'itinerarytransport'} />}
      />
      <Route path="edititinerary" element={<EditDetailPage type={'itinerary'} />} />
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
      <ErrorBoundary>
        <Suspense FallbackComponent={<Loading />}>
      <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </StrictMode>
);
