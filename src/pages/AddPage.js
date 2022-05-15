import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AddEdit } from 'components/screens';
import { fields } from 'fields';
import { addDetail, addTrip } from 'services';
import * as state from 'store';
import 'styles/App.css';

export default function AddPage({ page }) {
  const navigate = useNavigate();
  const [data, setData] = useState(fields[page]);
  const userId = useRecoilValue(state.userId);
  const currentTripKey = useRecoilValue(state.currentTripKey);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      switch (page) {
        case 'trip':
          addTrip(userId, data);
          break;
        default:
          addDetail(userId, currentTripKey, data, page);
          break;
      }
      navigate('/pages/' + page);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickCancel = () => {
    navigate('/pages/' + page);
  };

  return (
    <AddEdit
      mode={'New'}
      page={page}
      data={data}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleClickCancel={handleClickCancel}
    />
  );
}
