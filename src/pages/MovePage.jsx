import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { updateTrip } from '@/services';
import { moveTrip, returnNewCurrentTrip } from '@/utils';
import * as state from '@/store';
import '@/styles/index.css';

export default function MovePage() {
  const navigate = useNavigate();
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const setCurrentTrip = useSetRecoilState(state.currentTrip);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const [data, setData] = useState();
  const { rowIndex } = useParams();
  const [loading, setLoading] = useState(true);
  const tripData = useRecoilValue(state.tripData);

  useEffect(() => {
    setData(tripData[rowIndex]);
    setLoading(false);
  }, [tripData, rowIndex]);

  

  if (loading) return <h2>Loading...</h2>;

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const newStartDate = formJson.startDate + 'T00:00';
    const movedData = moveTrip(newStartDate, data);
    const date = new Date();
    const printDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    if (!movedData.dprint_Date) movedData.dprint_Date = printDate;
    try {
          await updateTrip(userId, currentTripKey, movedData);
          const newCurrentTrip = returnNewCurrentTrip(movedData);
          setCurrentTrip(newCurrentTrip);
          refreshTripData();
          refreshItineraryData();
          setData(tripData[rowIndex]);
      } catch (error) {
      console.log(error);
    }
    handleCancel();
  };





  function handleCancel(){
      navigate('/pages/trip');
  }

  return (
    <div id='add-edit'>
      <section>
        <header>
          <h2>
            Move {data.atrip_Name} Trip
          </h2>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label>
            Start Date<br/>
            <input
              autoComplete='off'
              name='startDate'
              type='date'
              defaultValue={data.bstart_Date.substring(0,10)}
            />
          </label>
          </fieldset>
          <footer>
            <button className='not-stacked' onClick={handleCancel}>
              Cancel
            </button>
            &nbsp;&nbsp;
            <button type='submit' className='not-stacked'>
              Save
            </button>              
        </footer>          
        </form>
        
      </section>
    </div>
  );
}
