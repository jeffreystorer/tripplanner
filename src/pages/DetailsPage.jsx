import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import { Plus } from 'react-feather'; 
import { DetailButtons } from '@/components/common';
import * as state from '@/store';
import { createTripItems } from '@/utils';

//page is set by main.jsx as part of the route

export default function DetailsPage({ page }) {
  const navigate = useNavigate();
  const setPage = useSetRecoilState(state.page);
  const setItineraryDetail = useSetRecoilState(state.itineraryDetail);
  const data = useRecoilState(state.detailData(page));
  const refreshDetailData = useRecoilRefresher_UNSTABLE(state.detailData(page));
  const currentTrip = useRecoilValue(state.currentTrip);
  const labels = {
    activity: 'Activities',
    car: 'Cars',
    note: 'Trip Notes',
    room: 'Rooms',
    travel: 'Travels',
  };

  useEffect(() => {
    setPage(page);
    refreshDetailData();
  }, [refreshDetailData]);

  function onClick(item, e) {
    e.preventDefault();
    let detail = {
      page: item.type,
      key: item.key,
      value: e.target.innerText,
      date: Object.values(item)[0].substring(0, 10),
    };
    setItineraryDetail(detail);
    navigate('/pages/tripdetail');
  }
  const items = createTripItems(page, data[0], onClick);
 
  return (
    <div className='details titled-outer'>
        <h2>
          {currentTrip.atrip_Name}
        </h2>
        <DetailButtons />
        <div className='titled-inner'>
            <h3>{labels[page]}</h3>
          {items}
        </div>
    </div>
  );
}
