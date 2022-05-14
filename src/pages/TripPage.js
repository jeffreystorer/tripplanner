import { useState } from 'react';
import { Link as ReactLink, Navigate } from 'react-router-dom';
import {
  useRecoilState,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  Button,
  Container,
  HStack,
  Link,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { firebaseConfig } from 'firebaseConfig';
import { useList } from 'react-firebase-hooks/database';
//import { useVisibilityChange } from 'use-visibility-change';
import { Loading } from 'components/common';
import { ConfirmDeleteModal } from 'components/trip';
import { removeAll, removeTrip } from 'services';
import * as state from 'store';
import 'styles/App.css';

export default function TripPage() {
  /* const onShow = () => {
    window.location.reload();
  };
  useVisibilityChange({ onShow }); */
  const userId = useRecoilValue(state.userId); //'Fs0wwvxoWwdZPXcVo8NcHYDot1z2'; //JSON.parse(localStorage.getItem('userId'));

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const dbRef = ref(db, `/${userId}/`);
  const [snapshots, loading, error] = useList(dbRef);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allTrips, setAllTrips] = useState(false);
  const setCurrentTrip = useSetRecoilState(state.currentTrip);
  const resetCurrentTrip = useResetRecoilState(state.currentTrip);
  const [currentTripKey, setCurrentTripKey] = useRecoilState(
    state.currentTripKey
  );
  const resetCurrentTripKey = useResetRecoilState(state.currentTripKey);
  const [currentTripIndex, setCurrentTripIndex] = useRecoilState(
    state.currentTripIndex
  );
  const resetCurrentTripIndex = useResetRecoilState(state.currentTripIndex);

  /*  useEffect(() => {
    if (snapshots) {
      if (currentTripIndex > -1) {
        const tripSnapshot = snapshots[currentTripIndex];
        setCurrentTripKey(tripSnapshot.key);
        const { name } = tripSnapshot.val();
        setCurrentTrip({
          key: tripSnapshot.key,
          name,
        });
      }
    }
    //eslint-disable-next-line
  }, [snapshots]); */

  function handleClick(tripSnapshot, index) {
    setCurrentTripKey(tripSnapshot.key);
    setCurrentTripIndex(index);
    const { name } = tripSnapshot.val();
    setCurrentTrip({
      key: tripSnapshot.key,
      name,
    });
  }

  const handleClickDelete = () => {
    if (allTrips) {
      removeAll(userId);
    } else {
      removeTrip(userId, currentTripKey);
    }
    resetCurrentTripIndex();
    resetCurrentTripKey();
    resetCurrentTrip();
  };
  const handleShowConfirmDeleteCurrentModal = () => {
    setAllTrips(false);
    onOpen();
  };

  const handleShowConfirmDeleteAllModal = () => {
    setAllTrips(true);
    onOpen();
  };

  if (error) {
    console.log('😊😊 error', error);
    return <Navigate to="/" />;
  }

  if (loading) return <Loading />;
  return (
    <>
      <Container>
        <VStack gap={1}>
          <span className="paragraph--center">
            Click on a trip to edit or delete
          </span>
          <ul className="list--text-align-left">
            {snapshots &&
              snapshots.map((snapshot, index) => (
                <li
                  className={index === currentTripIndex ? 'active_li' : 'li'}
                  onClick={() => handleClick(snapshot, index)}
                  key={index}
                >
                  {snapshot.val().name}
                </li>
              ))}
          </ul>
          <HStack gap={3}>
            <Button>
              <Link as={ReactLink} to="/pages/addtrip">
                Add a Trip
              </Link>
            </Button>
            {currentTripIndex > -1 && (
              <Button onClick={handleShowConfirmDeleteCurrentModal}>
                Delete Current Trip
              </Button>
            )}
            {snapshots && (
              <Button onClick={handleShowConfirmDeleteAllModal}>
                Delete All
              </Button>
            )}
          </HStack>
        </VStack>
        <ConfirmDeleteModal
          allTrips={allTrips}
          isOpen={isOpen}
          onClose={onClose}
          handleDelete={handleClickDelete}
        />
      </Container>
    </>
  );
}
