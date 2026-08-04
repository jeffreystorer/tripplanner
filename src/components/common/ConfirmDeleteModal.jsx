import {  useRecoilRefresher_UNSTABLE,
  useResetRecoilState,
  useRecoilValue,
  useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { removeAll, removeDetail, removeTrip } from '@/services';
import * as state from '@/store';
import '@/styles/index.css';

export default function ConfirmDeleteModal(){
  const navigate = useNavigate();
  const deleteAll = useRecoilValue(state.deleteAll);
  const [showModal, setShowModal] = useRecoilState(state.showModal);
  const page = useRecoilValue(state.page);
  const currentKey = useRecoilValue(state.currentKey);
  const deleteTarget = useRecoilValue(state.deleteTarget);
  const userId = useRecoilValue(state.userId);
  const resetCurrentTrip = useResetRecoilState(state.currentTrip);
  const currentTripKey = useRecoilValue(
    state.currentTripKey
  );
  const resetCurrentTripIndex = useResetRecoilState(state.currentTripIndex);
  const resetCurrentTripKey = useResetRecoilState(state.currentTripKey);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const itineraryDetail = useRecoilValue(state.itineraryDetail);
  const refreshDetailData = useRecoilRefresher_UNSTABLE(state.detailData(page));
  const tripPath = '/pages/trip';
  const itineraryDetailPath = '/pages/itinerary';
  const detailPath = `/pages/${page}`;
  
  function handleDelete(){

    switch (deleteTarget) {
      case 'trip':        
        if (deleteAll) {
          removeAll(userId);
        } else {
          removeTrip(userId, currentTripKey);
        }
        refreshTripData();
        resetCurrentTripIndex();
        resetCurrentTripKey();
        resetCurrentTrip();
        setShowModal(false);
        navigate(tripPath);
        break;
      case 'itinerarydetail':

        try {
          removeDetail(
            userId,
            currentTripKey,
            itineraryDetail.page,
            itineraryDetail.key
          );
          refreshDetailData();
          refreshItineraryData();
        } catch (error) {
          console.log(error);
        }
        setShowModal(false);
        navigate(itineraryDetailPath);
        break;
      case 'detail':        
        try {
          removeDetail(userId, currentTripKey, page, currentKey);
          refreshDetailData();
          refreshItineraryData();
        } catch (error) {
          console.log(error);
        }
        setShowModal(false);
        navigate(detailPath);
        break;    
      default:
        break;
    }
    
  }
  
  function handleClose(e){
    e.preventDefault();
    setShowModal(false);
    let path;
    switch (deleteTarget) {
      case 'trip':
        path = tripPath;
        break;
      case 'itinerarydetail':
        path = itineraryDetailPath;
        break;
      case 'detail':
        path = detailPath;
        break;    
      default:
        break;
    }
    navigate(path);
  }

  const className = showModal ? 'open modalClose' : 'modalClose'

  return (
    <div id='modal' className={className} onClick={handleClose}>
      <section>
        <header>
          <h2>Heads up!</h2><a className='modalClose' onClick={handleClose} hidden></a>
        </header>
        {deleteAll ? (
          <p>Are you sure you want to delete all items?</p>
        ) : (
          <p>Are you sure you want to delete this item?</p>
        )}
        <footer>
          <button className='not-stacked modalClose' onClick={handleClose}>
            Cancel
          </button>
            <button className='not-stacked' onClick={handleDelete}>
              {deleteAll ? ("Delete All") : ("Delete")}
            </button>
        </footer>
      </section>
    </div>
  );
}
