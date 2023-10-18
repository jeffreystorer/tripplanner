import { useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue
} from 'recoil';
import { DetailButtons } from '@/components/common';
import * as state from '@/store';
import { dateStrShort, returnNewCurrentTrip } from '@/utils';
import { v4 as uuidv4 } from 'uuid';

export default function TripPage() {
  const navigate = useNavigate();
  const tripData = useRecoilValue(state.tripData);
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
    const newCurrentTrip = returnNewCurrentTrip(item);
    setCurrentTrip((prev) => newCurrentTrip);
    navigate('/pages/itinerary');
  }


  return (
      <div id='trip-page'>
        {tripData.length > 0 && (
          <div className='titled-outer'>
            <h2>Saved Trips</h2>
            <ul>
              {tripData.map((item, index) => (
                <li
                  className={index === currentTripIndex ? 'active-li' : ''}
                  onClick={() => handleSetTrip(item, index)}
                  key={uuidv4()}
                >
                  {item.atrip_Name}
                  {':  '}
                  {dateStrShort(item.bstart_Date)}
                  {' to '}
                  {dateStrShort(item.cend_Date)}
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
  );
}
