import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import * as state from '@/store';
import { createItineraryItems, dowMonthDayFromStr } from '@/utils';

export default function ItineraryPage() {
  const navigate = useNavigate();
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
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

  function onClick(item, e) {
    e.preventDefault();
    let detail = {
      page: item.type,
      key: item.key,
      value: e.target.innerText,
      date: Object.values(item)[0].substring(0, 10),
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
    setItineraryDateTime(date + 'T00:00');
    navigate('/pages/additinerary' + page);
  }

  function handleNoteClick(e) {
    e.preventDefault();
    navigate('/pages/additinerarynote')
  }

  const items = createItineraryItems(data, onClick, handleDateClick, handleNoteClick);
  function handlePrint(){
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
                  {dowMonthDayFromStr(item, 'short')}
                </button>
              </li>
            );
          })}
        </ul>  
        <div>
          <h2 key={uuidv4()}>{currentTrip.atrip_Name}
          </h2>
          {items}
        </div>
      </div>
    </>
  );
}
