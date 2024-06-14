import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';
import { addDetail, addTrip } from '@/services';
import { AddEdit } from '@/components/screens';
import { fields } from '@/fields';
import * as state from '@/store';
import '@/styles/index.css';

export default function AddPage({ page }) {
  let isItinerary = false;
  let addedPage = page;
  if (page.includes('itinerary')) {
    isItinerary = true;
    addedPage = page.substring(9);
  }
  const navigate = useNavigate();
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const resetCurrentTripIndex = useResetRecoilState(state.currentTripIndex);
  const resetCurrentTripKey = useResetRecoilState(state.currentTripKey);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const refreshDetailData = useRecoilRefresher_UNSTABLE(
    state.detailData(addedPage)
  );
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const [data, setData] = useState(fields[addedPage]);
  const itineraryDateTime = useRecoilValue(state.itineraryDateTime);

  useEffect(() => {
    if (isItinerary) {
      switch (addedPage) {
        case 'activity':
          setData({ ...data, astart_Date: itineraryDateTime });
          break;
        case 'car':
          setData({ ...data, astart: itineraryDateTime });
          break;
        case 'room':
          setData({ ...data, astart_Date: itineraryDateTime });
          break;
        case 'transport':
          setData({ ...data, astart: itineraryDateTime, bend: itineraryDateTime });
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedPage, isItinerary, itineraryDateTime]);

  
  const handleChange = e => {
    e.preventDefault();
    let name  = e.target.name;
    let value = e.target.value ? e.target.value : '';
    if (page === 'trip' && name !=='atrip_Name') value = value + 'T00:00';
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      switch (addedPage) {
        case 'trip':
          addTrip(userId, data);
          resetCurrentTripIndex();
          resetCurrentTripKey();
          refreshTripData();
          refreshDetailData();
          refreshItineraryData();
          navigate('/pages/trip');
          break;
        default:
          addDetail(userId, currentTripKey, data, addedPage);
          refreshTripData();
          refreshDetailData();
          refreshItineraryData();
          break;
      }

      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  function handleCancel(){
    if (isItinerary) {
      navigate('/pages/itinerary');
    } else {
      navigate('/pages/' + page);
    }
  };

  return (
    <AddEdit
      mode={'New'}
      data={data}
      page={addedPage}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleCancel={handleCancel}
    />
  );
}
