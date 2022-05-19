import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useDisclosure } from '@chakra-ui/react';
import { useVisibilityChange } from 'use-visibility-change';
import { ConfirmDeleteDetailModal } from 'components/common';
import { Details } from 'components/screens';
import { removeDetail } from 'services';
import * as state from 'store';
import { createAccordionItems } from 'utils';

export default function DetailsPage({ snapshots, page }) {
  console.log('🚀 ~ file: DetailsPage.js ~ line 13 ~ DetailsPage ~ page', page);
  console.log(
    '🚀 ~ file: DetailsPage.js ~ line 13 ~ DetailsPage ~ snapshots',
    snapshots
  );
  console.log(
    '🚀 ~ file: DetailsPage.js ~ line 13 ~ DetailsPage ~ snapshots[0].val()',
    snapshots[0].val()
  );
  const onShow = () => {
    setAccordionKey(accordionKey + 1);
  };
  useVisibilityChange({ onShow });
  const navigate = useNavigate();
  const currentTrip = useRecoilValue(state.currentTrip);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  console.log('🚀 ~ file: DetailsPage.js ~ line 22 ~ DetailsPage ~ data', data);
  const [rowIndex, setRowIndex] = useState(null);
  const [currentKey, setCurrentKey] = useState(null);
  const [accordionKey, setAccordionKey] = useState(12345);
  const userId = useRecoilValue(state.userId);

  useEffect(() => {
    let detailsArray = [];
    snapshots.forEach(snapshot => {
      let detailObject = snapshot.val();
      detailObject.key = snapshot.key;
      detailsArray.push(detailObject);
    });

    if (detailsArray.length > 0) {
      console.log(
        '🚀 ~ file: DetailsPage.js ~ line 36 ~ useEffect ~  sorting detailsArray',
        detailsArray
      );

      switch (page) {
        case 'activity':
          detailsArray.sort(function (a, b) {
            let x = a.astart_Date.toLowerCase();
            let y = b.astart_Date.toLowerCase();
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          });
          break;
        case 'car':
          detailsArray.sort((a, b) => {
            const result = a.astart.localeCompare(b.astart);
            return result !== 0 ? result : a.bend.localeCompare(b.bend);
          });
          break;
        case 'note':
          break;
        case 'room':
          detailsArray.sort((a, b) => {
            const result = a.astart_Date.localeCompare(b.astart_Date);
            return result !== 0
              ? result
              : a.bend_Date.localeCompare(b.bend_Date);
          });
          break;
        case 'travel':
          detailsArray.sort((a, b) => {
            const result = a.astart.localeCompare(b.astart);
            return result !== 0 ? result : a.bend.localeCompare(b.bend);
          });
          break;
        default:
          break;
      }
    }
    setData(detailsArray);
  }, [page, setData, snapshots]);

  const handleDelete = () => {
    try {
      removeDetail(userId, currentTripKey, page, currentKey);
      const updatedData = data.filter((_, i) => i !== rowIndex);
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
    setAccordionKey(accordionKey + 1);
    navigate('/');
  };

  const showModal = i => {
    setCurrentKey(data[i].key);
    setRowIndex(i);
    onOpen();
  };
  const items = createAccordionItems(page, data, showModal);

  console.log('🚀 ~ file: DetailsPage.js ~ line 82 ~ DetailsPage ~ page', page);
  console.log('🚀 ~ file: DetailsPage.js ~ line 82 ~ DetailsPage ~ data', data);

  return (
    <>
      <ConfirmDeleteDetailModal
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={handleDelete}
      />
      <Details
        page={page}
        items={items}
        accordionKey={accordionKey}
        currentTripName={currentTrip.atrip_Name}
      />
    </>
  );
}
