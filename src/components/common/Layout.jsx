import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as state from '@/store';
import { returnNewCurrentTrip } from '@/utils';
import ScrollToTop from 'react-scroll-to-top';
import { NavBar } from '@/components/common';
import '@/styles/index.css';

export default function LayoutPage() {

  const tripData = useRecoilValue(state.tripData);
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
  const setCurrentTripIndex = useSetRecoilState(state.currentTripIndex);
  const setCurrentTripKey = useSetRecoilState(state.currentTripKey);
  const setCurrentTrip = useSetRecoilState(state.currentTrip);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(tripData) || tripData.length === 0) return;
    // don't override an already-selected trip
    if (currentTripIndex > -1) return;
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const idx = tripData.findIndex(item => {
        if (!item.bstart_Date || !item.cend_Date) return false;
        const start = item.bstart_Date.substring(0, 10);
        const end = item.cend_Date.substring(0, 10);
        return start <= todayStr && todayStr <= end;
      });

      if (idx !== -1) {
        const item = tripData[idx];
        setCurrentTripKey(item.key);
        setCurrentTripIndex(idx);
        setCurrentTrip(returnNewCurrentTrip(item));
        navigate('/pages/itinerary');
      }
    } catch (error) {}
  }, [tripData, currentTripIndex, setCurrentTripIndex, setCurrentTripKey, setCurrentTrip, navigate]);

  return (
    <>
      <ScrollToTop />
      <header>
          <h1>Storer TP</h1>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
