import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import * as state from '@/store';
import { createItineraryItems, dateStrShort, returnNewCurrentTrip }  from '@/utils';
import { updateTrip } from '@/services';
import * as _ from 'lodash';

export default function ItineraryPage() {
  const navigate = useNavigate();
  const [lastPrinted, setLastPrinted] = useState('')
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const setCurrentTrip = useSetRecoilState(state.currentTrip);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
  const tripData = useRecoilValue(state.tripData);
  const currentTrip = useRecoilValue(state.currentTrip);
  const data = useRecoilValue(state.itineraryData);
  const [itineraryDetail, setItineraryDetail] = useRecoilState(
    state.itineraryDetail
  );
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const setItineraryDateTime = useSetRecoilState(state.itineraryDateTime);
  const itineraryData = useRecoilValue(state.itineraryData);

  useEffect(() => {
    if (currentTripIndex === -1) navigate('/pages/trip');
  }, [currentTripIndex, navigate]);

  useEffect(() => {
    refreshItineraryData();
  }, [refreshItineraryData]);

  useEffect(() => {
    try {
      const node = document.getElementById(itineraryDetail.key);
      node.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      });
    } catch (error) {}
  });

  useEffect(() => {
    setLastPrinted(tripData[currentTripIndex].dprint_Date)
  },[tripData, currentTripIndex])

  function onClick(item, e) {
    e.preventDefault();
    let detail = {
      page: item.type,
      key: item.key,
      value: e.target.innerText,
      date: dateStrShort(Object.values(item)[0]),
    };
    setItineraryDetail(detail);
    navigate('/pages/itinerarydetail');
  }

  function handleDateClick(date, page, e) {
    e.preventDefault();
    let detail = {
      key: date,
    };
    setItineraryDetail(detail);
    setItineraryDateTime(date);
    navigate('/pages/additinerary' + page);
  }

  function handleNoteClick(e) {
    navigate('/pages/additinerarynote')
  }

  const items = createItineraryItems(data, onClick, handleDateClick, handleNoteClick);
  function handlePrint(){
    const date = new Date();
    const printDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    let data = JSON.parse(JSON.stringify(tripData[currentTripIndex]));
    data.dprint_Date = printDate;    
    updateTrip(userId, currentTripKey, data);
    const newCurrentTrip = returnNewCurrentTrip(data);
    setCurrentTrip((prev) => newCurrentTrip);
    refreshTripData();
    print()
};

  return ( 
    <>
      <button id='print' onClick={handlePrint}>Print</button>       
      <div id='itinerary-page'>   
        <ul key={uuidv4()}>
          {itineraryData.dates.map(item => {
            return (
              <li key={uuidv4()}>
                <button
                  onClick={e => {
                    e.preventDefault();
                    const node = document.getElementById(item);
                    node.scrollIntoView({
                      behavior: 'auto',
                      block: 'start',
                      inline: 'nearest',
                    });
                  }}
                >
                  {dateStrShort(item)}
                </button>
              </li>
            );
          })}
        </ul>  
        <div>
          <h2 key={uuidv4()}>{currentTrip.atrip_Name}
          </h2>
          <h3>(Printed: {lastPrinted})</h3>
          {items}
        </div>
      </div>
    </>
  );
}
