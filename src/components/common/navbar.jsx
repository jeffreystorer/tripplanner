import { NavLink, useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue
} from 'recoil';
import * as _ from 'lodash';
import * as state from '@/store';

export default function NavBar(){
  const navigate = useNavigate();
  const tripData = useRecoilState(state.tripData);
  const currentTripData = useRecoilValue(state.currentTripData);
  const setCurrentKey = useSetRecoilState(state.currentKey);
  const currentTrip = useRecoilValue(state.currentTrip);
  const currentTripKey = useRecoilValue(
    state.currentTripKey
  );
  const currentTripIndex = useRecoilValue(
    state.currentTripIndex
  );
  const userId = useRecoilValue(state.userId);
  const setDeleteAll = useSetRecoilState(state.deleteAll);
  const setDeleteTarget = useSetRecoilState(state.deleteTarget);
  const setShowModal = useSetRecoilState(state.showModal);
  
  function handleAdd(e) {
      e.preventDefault();
      navigate('/pages/addtrip');
  }

  function handleEdit(e) {
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

  function handleDownloadTrip(e) {
    e.preventDefault();
    const backup = { [currentTripKey]: currentTripData };
    exportData(backup, 'Backup of ' + currentTrip.atrip_Title);
  }

  function handleDownloadTrips(e) {
    e.preventDefault(); const tripsArray = tripData[0];

    let backup = { [userId]: {} };

    tripsArray.forEach(createObject)

    function createObject(item) {
      let aKey = item.key;
      let newItem = _.cloneDeep(item);
      delete newItem.key;
      backup[userId][aKey] = newItem;
    }
    exportData(backup, "Backup of storer-tp");
  }

  function exportData(data, fileName) {
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
    <nav>
      <ul>
        <li>
            <NavLink
            to="/pages/trip"
            className={({isActive}) => isActive ? "active" : "inactive"}
            >
            Trips
            </NavLink>
        </li>
        <li>
            <NavLink
            to="/pages/itinerary"
            className={({isActive}) => isActive ? "active" : "inactive"}
            >
            Itinerary
            </NavLink>
        </li>
        <li>
            <p>More...</p>
              <ul>
                <li>
                  <button onClick={handleAdd}>Add Trip</button>
                </li>
                {currentTripIndex > -1 && (
                  <>
                <div className='divider'></div>
                <li>Current Trip</li>
                <li>
                  <button onClick={handleEdit}>Edit</button>
                </li>
                <li>
                  <button onClick={e => handleDelete(e, false)}>Delete</button>
                </li>
                <li>
                  <button onClick={handleDownloadTrip}>Backup</button>
                </li>
                </>
                )}
                {tripData[0].length > 0 && (
                  <>
                <div className='divider'></div>
                <li>All Trips</li>
                <li>
                  <button onClick={e => handleDelete(e, true)}>Delete</button>
                </li>
                <li>
                  <button onClick={handleDownloadTrips}>Backup</button>
                </li>
                </>
                )}
                <div className='divider'></div>
                <li>                  
                  <NavLink
                  to="/"
                  className={({isActive}) => isActive ? "active" : "inactive"}
                  >
                    Sign Out
                  </NavLink>
                </li>

              </ul>
        </li>
      </ul>
    </nav>
  );
}