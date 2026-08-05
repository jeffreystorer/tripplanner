import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { startField } from '@/fields';
import * as state from '@/store';
import { createItineraryItems, dateStrShort, returnNewCurrentTrip, insertDate, deleteDate, toMapsHref}  from '@/utils';
import { updateTrip } from '@/services';

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
  const setPage = useSetRecoilState(state.page);
  const itineraryData = useRecoilValue(state.itineraryData);

  useEffect(() => {
    if (currentTripIndex === -1) navigate('/pages/trip');
  }, [currentTripIndex, navigate]);

  useEffect(() => {
    refreshItineraryData();
  }, [refreshItineraryData]);

  //extracted so the dependency array holds a plain value the linter can check
  const itineraryDetailKey = itineraryDetail?.key;

  // Scroll to the selected itinerary detail when it changes
  useEffect(() => {
    if (!itineraryDetailKey) return;
    try {
      const node = document.getElementById(itineraryDetailKey);
      if (node)
        node.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'nearest',
        });
    } catch (error) {
      console.error('Could not scroll to the selected detail:', error);
    }
  }, [itineraryDetailKey]);

  // On initial load (or when itinerary data changes) auto-scroll to today's date
  useEffect(() => {
    if (!itineraryData || !Array.isArray(itineraryData.dates)) return;
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`; // local date YYYY-MM-DD

      const dates = itineraryData.dates.filter(Boolean);
      if (dates.length === 0) return;

      // build date-only values and Date objects (local)
      const dateOnly = dates.map(d => d.substring(0, 10));
      const dateObjs = dateOnly.map(s => new Date(s + 'T00:00'));

      const first = dateObjs[0];
      const last = dateObjs[dateObjs.length - 1];
      const todayDate = new Date(todayStr + 'T00:00');

      // Only auto-scroll if today is within the itinerary date range
      if (todayDate < first || todayDate > last) return;

      // find exact match, otherwise find first date >= today
      let idx = dateObjs.findIndex(d => d.getTime() === todayDate.getTime());
      if (idx === -1) {
        idx = dateObjs.findIndex(d => d.getTime() > todayDate.getTime());
        if (idx === -1) idx = dateObjs.length - 1; // fallback to last
      }

      const match = dates[idx];
      if (match) {
        const node = document.getElementById(match);
        if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Could not scroll to today:', error);
    }
  }, [itineraryData]);

  useEffect(() => {
    setLastPrinted(tripData[currentTripIndex].dprint_Date)
  },[tripData, currentTripIndex])

  function onClick(item, e) {
    e.preventDefault();
    let detail = {
      page: item.type,
      key: item.key,
      //for a map link the click target is the Edit button, so use the
      //stored description instead of the button's text
      value: item.type === 'map' ? item.bdescription : e.target.innerText,
      date: dateStrShort(item[startField[item.type]]),
      ...(item.type === 'map' && { url: toMapsHref(item.cmap_Link) }),
    };
    setItineraryDetail(detail);
    //a map link row already has its own tappable link, so its Edit button
    //skips the Cancel/Edit/Delete screen and opens the edit form directly
    if (item.type === 'map') {
      setPage(detail.page);
      navigate('/pages/edititinerary');
      return;
    }
    navigate('/pages/itinerarydetail');
  }

  const handleInsertDateClick = async (date,e) => {
      e.preventDefault();
      const movedData = insertDate(date, tripData[currentTripIndex]);
      const _date = new Date();
      const printDate = _date.toLocaleDateString() + ' ' + _date.toLocaleTimeString();
      if (!movedData.dprint_Date) movedData.dprint_Date = printDate;
      try {
            await updateTrip(userId, currentTripKey, movedData);
            const newCurrentTrip = returnNewCurrentTrip(movedData);
            setCurrentTrip(newCurrentTrip);
            refreshTripData();
            refreshItineraryData();
        } catch (error) {
        console.log(error);
      }
      handleCancel();
    };

  const handleDeleteDateClick = async (date,e) => {
      e.preventDefault();
      const movedData = deleteDate(date, tripData[currentTripIndex]);
      const _date = new Date();
      const printDate = _date.toLocaleDateString() + ' ' + _date.toLocaleTimeString();
      if (!movedData.dprint_Date) movedData.dprint_Date = printDate;
      try {
            await updateTrip(userId, currentTripKey, movedData);
            const newCurrentTrip = returnNewCurrentTrip(movedData);
            setCurrentTrip(newCurrentTrip);
            refreshTripData();
            refreshItineraryData();
        } catch (error) {
        console.log(error);
      }
      handleCancel();
    };

  function handleCancel() {
    navigate('/pages/itinerary');
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

  function handleNoteClick() {
    navigate('/pages/additinerarynote')
  }

  const items = createItineraryItems(data, onClick, handleInsertDateClick, handleDeleteDateClick,handleDateClick, handleNoteClick);
  function handlePrint(){
    const date = new Date();
    const printDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    let data = JSON.parse(JSON.stringify(tripData[currentTripIndex]));
    data.dprint_Date = printDate;    
    updateTrip(userId, currentTripKey, data);
    const newCurrentTrip = returnNewCurrentTrip(data);
    setCurrentTrip(newCurrentTrip);
    refreshTripData();
    print()
  }

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
