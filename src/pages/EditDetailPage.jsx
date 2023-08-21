import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import * as _ from 'lodash';
import { AddEdit } from '@/components/screens';
import { updateDetail } from '@/services';
import * as state from '@/store';
import '@/styles/index.css';

export default function EditDetailPage({type}) {
  const navigate = useNavigate();
  const detail = useRecoilValue(state.itineraryDetail);
  const tripData = useRecoilValue(state.tripData);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const currentTripIndex = useRecoilValue(state.currentTripIndex);
  const refreshItineraryData = useRecoilRefresher_UNSTABLE(state.itineraryData);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const path = (type === 'itinerary') ? '/pages/itinerary' : `/pages/${detail.page}`;

  useEffect(() => {
    setData(tripData[currentTripIndex].details[detail.page][detail.key]);
    setLoading(false);
  }, [currentTripIndex, detail.key, detail.page, tripData]);

  useEffect(() => {
    refreshTripData();
    refreshItineraryData();
  }, [refreshItineraryData, refreshTripData]);

  const handleChange = e => {
    let newValue = e.target.value;
    if (!newValue) newValue = '';
    setData({ ...data, [e.target.name]: newValue });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newData = _.cloneDeep(data);
      delete newData.key;
      updateDetail(userId, currentTripKey, newData, detail.page, detail.key);
      refreshItineraryData();
      refreshTripData();
      navigate(path);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate(path);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <AddEdit
      mode={'Edit'}
      page={detail.page}
      data={data}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleCancel={handleCancel}
    />
  );
}
