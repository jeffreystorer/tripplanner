import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Loading } from 'components/common';
import { Itinerary } from 'components/screens';
import { getTrip } from 'services';
import * as state from 'store';
import { createItineraryItems, tripDates } from 'utils';

export default function ItineraryPage() {
  const currentTrip = useRecoilValue(state.currentTrip);
  const currentTripKey = useRecoilValue(state.currentTripKey);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const userId = useRecoilValue(state.userId);

  useEffect(() => {
    getTrip(userId, currentTripKey).then(data => {
      //dates
      let dateArray = tripDates(data.bstart_Date, data.cend_Date);
      //activities
      let activityArray = [];
      for (const [key, value] of Object.entries(data.details.activity)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = 'activity';
        activityArray.push(detailObject);
      }
      //cars
      let carArray = [];
      for (const [key, value] of Object.entries(data.details.car)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = 'car';
        carArray.push(detailObject);
      }
      //notes
      let noteArray = [];
      for (const [key, value] of Object.entries(data.details.note)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = 'note';
        noteArray.push(detailObject);
      }
      //rooms
      let roomArray = [];
      for (const [key, value] of Object.entries(data.details.room)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = 'room';
        roomArray.push(detailObject);
      }
      //travels
      let travelArray = [];
      for (const [key, value] of Object.entries(data.details.travel)) {
        let detailObject = value;
        detailObject.key = key;
        detailObject.type = 'travel';
        travelArray.push(detailObject);
      }
      //set data
      setData({
        dates: dateArray,
        activities: activityArray,
        cars: carArray,
        notes: noteArray,
        rooms: roomArray,
        travels: travelArray,
      });
      setLoading(false);
    });
  }, [currentTripKey, setData, userId]);

  if (loading) return <Loading />;

  const items = createItineraryItems(data);

  return (
    <>
      <Itinerary items={items} currentTripName={currentTrip.atrip_Name} />
    </>
  );
}
