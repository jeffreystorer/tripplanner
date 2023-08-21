import { useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue
} from 'recoil';
import { ConfirmDeleteModal, DetailButtons } from '@/components/common';
import * as _ from 'lodash';
import * as state from '@/store';
import { dowMonthDayFromStr } from '@/utils';
import { v4 as uuidv4} from 'uuid';

export default function TripPage() {
  const navigate = useNavigate();
  const tripData = useRecoilState(state.tripData);
  const currentTripData = useRecoilValue(state.currentTripData);
  const setCurrentKey = useSetRecoilState(state.currentKey);
  const [currentTrip, setCurrentTrip] = useRecoilState(state.currentTrip);
  const [currentTripKey, setCurrentTripKey] = useRecoilState(
    state.currentTripKey
  );
  const [currentTripIndex, setCurrentTripIndex] = useRecoilState(
    state.currentTripIndex
  );
  const userId = useRecoilValue(state.userId);
  const setDeleteAll = useSetRecoilState(state.deleteAll);
  const setDeleteTarget = useSetRecoilState(state.deleteTarget);
  const setShowModal = useSetRecoilState(state.showModal);

  function handleSetTrip(item, index) {
    setCurrentTripKey(item.key);
    setCurrentTripIndex(index);
    const newCurrentTrip =  {
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
  }

  function handleView(e){
    e.preventDefault();
    navigate('/pages/itinerary');
  }

  function handleAdd(e){
    e.preventDefault();
    navigate('/pages/addtrip');
  }


  function handleEdit(e){
    e.preventDefault();
    const targetPage = `/pages/edittrip/${currentTripIndex}`
    navigate(targetPage);
  }
 

  function handleDelete(e, param) {
    e.preventDefault();
    setCurrentKey(currentTripKey);
    setDeleteAll(param);
    setDeleteTarget('trip');
    setShowModal(true);
    navigate('/pages/confirmdelete');
  }

  function handleDownloadTrip(e){
    e.preventDefault();
    const backup = { [currentTripKey]: currentTripData};
    exportData(backup, 'Backup of ' + currentTrip.atrip_Title);
  }

  function handleDownloadTrips(e){
    e.preventDefault();const tripsArray = tripData[0];

    let backup = {[userId]: {}};
    
    tripsArray.forEach(createObject)
    
    function createObject(item){
      let aKey = item.key;
      let newItem = _.cloneDeep(item);
      delete newItem.key;
      backup[userId][aKey] = newItem;    
    }
    exportData(backup, "Backup of storer-tp");
  }
  
  function exportData(data, fileName){
    const now = new Date();
    const stamp = now.toISOString();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${fileName} (${stamp}).json`;

    link.click();
  };

  

  return (
    <>
    <div id='trip-page'>
      <button className='not-stacked' onClick={handleAdd}>Add Trip</button>
      {tripData[0].length > 0 && (
      <div className='titled-outer'>
        <h2>Saved Trips</h2>
        <p>Click on a trip to select it</p>
      <div className='divider'></div>
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
          <div className='divider'></div>
          <div className='buttons'>
          <button className='not-stacked' onClick={e => handleDelete(e, true)}>
            Delete All
          </button>
          <button className='not-stacked' onClick={handleDownloadTrips}>
            Backup All
          </button>
          </div>
        </ul>
      </div>
      )}
      {currentTripIndex > -1 && (
        <>
          <button onClick={handleView}>
              View Itinerary
          </button>
        <div className='titled-outer'>
          <h2>{currentTrip.atrip_Name}</h2>
          <div className='buttons'>
          
            <button className='not-stacked' onClick={handleEdit}>
              Edit
            </button> 
            <button className='not-stacked' onClick={e => handleDelete(e, false)}>
            Delete 
            </button>
            <button className='not-stacked' onClick={handleDownloadTrip}>
              Backup
            </button>
          </div>
          <DetailButtons />
          </div>
          </>
      )
      }
    </div>
    <ConfirmDeleteModal />
    </>
  );
}
