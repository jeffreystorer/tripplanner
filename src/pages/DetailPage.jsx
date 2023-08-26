import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useSetRecoilState, useRecoilValue } from 'recoil';
import { ConfirmDeleteModal } from '@/components/common';
import { dateStrShort } from '@/utils';
import * as state from '@/store';

export default function DetailPage({type}) {
  const navigate = useNavigate();
  const itineraryDetail = useRecoilValue(state.itineraryDetail);
  const setPage = useSetRecoilState(state.page);
  const setDeleteAll = useSetRecoilState(state.deleteAll);
  const setDeleteTarget = useSetRecoilState(state.deleteTarget);
  const setShowModal = useSetRecoilState(state.showModal);
  const setCurrentKey = useSetRecoilState(state.currentKey);
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const currentTrip = useRecoilValue(state.currentTrip);
  const cancelPath = (type === 'itinerary') ? '/pages/itinerary' : `/pages/${itineraryDetail.page}`;
  const editPath = (type === 'itinerary') ? '/pages/edititinerary' : '/pages/edittripdetail';
  const deleteTarget = (type === 'itinerary') ? 'itinerarydetail' : 'detail';
  
  useEffect(() => {
    setPage(itineraryDetail.page);
    refreshItineraryData();
  }, [refreshItineraryData, setPage, itineraryDetail]);

  function handleDelete(e){
    e.preventDefault();
    setCurrentKey(itineraryDetail.key);
    setDeleteAll(false);
    setDeleteTarget(prev => deleteTarget);
    setShowModal(true);
    navigate('/pages/confirmdelete');
  };

  function handleCancel() {
    navigate(cancelPath);
  }

  const detailType = itineraryDetail.page.charAt(0).toUpperCase() + itineraryDetail.page.slice(1)

  return (
    <>
      <div id='itinerary-details'>
        <section>
          <header>
          <h2>{currentTrip.atrip_Name}</h2>
          </header>
          <div className='titled-inner'>
            {detailType === 'Note' ? (
              <h3>
                {detailType}
              </h3>
            ):(
              <h3>
                  {detailType}{' '}for{' '}
                  {dateStrShort(itineraryDetail.date, 'short')}
              </h3>
            )
            }
            {itineraryDetail.value}
          </div>
          <footer>
            <button className='not-stacked' onClick={handleCancel}>
              Cancel
            </button>
            <button
              className='not-stacked' 
              onClick={() => navigate(editPath)}
            >
              Edit
            </button>
            <button className='not-stacked' onClick={handleDelete}>
              Delete
            </button>
          </footer>
        </section>
      </div>
      <ConfirmDeleteModal />
      </>
  );
}
