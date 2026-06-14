import { NavLink, useNavigate } from 'react-router-dom';
import {
  useSetRecoilState,
  useRecoilValue
} from 'recoil';
import * as state from '@/store';

export default function NavBar(){
  const navigate = useNavigate();
  const tripData = useRecoilValue(state.tripData);
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
  

  function handleMove(e){
    e.preventDefault();
    const targetPage = `/pages/movetrip/${currentTripIndex}`
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
    e.preventDefault(); const tripsArray = tripData;

    let backup = { [userId]: {} };

    tripsArray.forEach(createObject)

    function createObject(item) {
      let aKey = item.key;
      let newItem = structuredClone(item);
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
                    <NavLink
                    to="/pages/log"
                    className={({isActive}) => isActive ? "active" : "inactive"}
                    >
                    Log
                    </NavLink>
                </li>
                  <li>
                    <button onClick={handleAdd}>Add Trip</button>
                  </li>
                  {currentTripIndex > -1 && (
                    <>
                  <li className='divider'></li>
                  <li>Current Trip</li>
                  <li>
                    <button onClick={handleEdit}>Edit</button>
                  </li>
                  <li>
                    <button onClick={handleMove}>Move</button>
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
                  <li className='divider'></li>
                  <li>All Trips</li>
                  <li>
                    <button onClick={e => handleDelete(e, true)}>Delete</button>
                  </li>
                  <li>
                    <button onClick={handleDownloadTrips}>Backup</button>
                  </li>
                  </>
                  )}
                  <li className='divider'></li>
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