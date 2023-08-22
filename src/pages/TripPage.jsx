import { useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { ConfirmDeleteModal, DetailButtons } from '@/components/common';
import * as state from '@/store';
import { dowMonthDayFromStr } from '@/utils';
import { v4 as uuidv4 } from 'uuid';

export default function TripPage() {
  const navigate = useNavigate();
  const tripData = useRecoilState(state.tripData);
  const [currentTrip, setCurrentTrip] = useRecoilState(state.currentTrip);
  const setCurrentTripKey = useSetRecoilState(
    state.currentTripKey
  );
  const [currentTripIndex, setCurrentTripIndex] = useRecoilState(
    state.currentTripIndex
  );
  

  function handleSetTrip(item, index) {
    setCurrentTripKey(item.key);
    setCurrentTripIndex(index);
    const newCurrentTrip = {
      key: item.key,
      atrip_LongName:
        item.atrip_Name +
        ':  ' +
        dowMonthDayFromStr(item.bstart_Date, 'long') +
        ' to ' +
        dowMonthDayFromStr(item.cend_Date, 'long'),
      atrip_Name:
        item.atrip_Name +
        ':  ' +
        dowMonthDayFromStr(item.bstart_Date, 'short') +
        ' to ' +
        dowMonthDayFromStr(item.cend_Date, 'short'),
      atrip_Title: item.atrip_Name,
      atrip_Dates: dowMonthDayFromStr(item.bstart_Date, 'short') +
        ' to ' +
        dowMonthDayFromStr(item.cend_Date, 'short'),
      atrip_LongDates: dowMonthDayFromStr(item.bstart_Date, 'long') +
        ' to ' +
        dowMonthDayFromStr(item.cend_Date, 'long')
    }
    setCurrentTrip((prev) => newCurrentTrip);
    navigate('/pages/itinerary');
  }




  return (
    <>
      <div id='trip-page'>
        {tripData[0].length > 0 && (
          <div className='titled-outer'>
            <h2>Saved Trips</h2>
            <ul>
              {tripData[0].map((item, index) => (
                <li
                  className={index === currentTripIndex ? 'active-li' : ''}
                  onClick={() => handleSetTrip(item, index)}
                  key={uuidv4()}
                >
                  {item.atrip_Name}
                  {':  '}
                  {dowMonthDayFromStr(item.bstart_Date, 'short')}
                  {' to '}
                  {dowMonthDayFromStr(item.cend_Date, 'short')}
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentTripIndex > -1 && (        
          <div className='titled-outer'>
            <h2>{currentTrip.atrip_Name}</h2>
            <DetailButtons />
          </div>        
        )
        }
      </div>
      <ConfirmDeleteModal />
    </>
  );
}
