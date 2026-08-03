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
import { createTripItems, toMapsHref } from '@/utils';

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
    map: 'Map Links',
    note: 'Trip Notes',
    room: 'Rooms',
    transport: 'Transports',
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
      value: item.type === 'map' ? item.bdescription : e.target.innerText,
      date: Object.values(item)[0].substring(0, 10),
      ...(item.type === 'map' && { url: toMapsHref(item.cmap_Link) }),
    };
    setItineraryDetail(detail);
    //a map link row already has its own tappable link, so its Edit button
    //skips the Cancel/Edit/Delete screen and opens the edit form directly
    if (item.type === 'map') {
      setPage(detail.page);
      navigate('/pages/edittripdetail');
      return;
    }
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
