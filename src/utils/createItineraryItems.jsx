import { Fragment } from 'react';
import { Star } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr } from '@/utils';

export default function createItineraryItems(
  data,
  onClick,
  handleDateClick,
  handleNoteClick
) {
  const dates = data.dates;
  const activities = data.activities;
  const cars = data.cars;
  const notes = data.notes;
  const rooms = data.rooms;
  const transports = data.transports;

  function noteItem(item, value) {
    
    return (
      <div key={uuidv4()} className='note-item' onClick={e => onClick(item, e)}>
        <Star />&nbsp;&nbsp;
        <p className='item'>
          {value}
        </p>
      </div>
      
    );
  }

  function itineraryItem(item, value) {
    
    return (
      <Fragment key={uuidv4()}><p onClick={e => onClick(item, e)}>{value}</p></Fragment>
      
    );
  }

  //items are <p></p>
  let items = [];
  
  //dateItems are objects with item and value
  let dateItems = [];

  items.push(
    <details key={uuidv4()} className='itinerary-date'>
      <summary>Notes</summary>
      <ul>
        <li>
          <button className='not-stacked'  onClick={e => handleNoteClick(e)}>
            Add Note
          </button>
        </li>          
      </ul>
    </details>  
  );
  notes.forEach(pushNotes);

  function pushNotes(item) {

    items.push(noteItem(item, item.anote));
  }

  dates.forEach(pushDateGroup);

  //item is YYYY-MM-DDT00:00
  function pushDateGroup(item) {
    pushDate(item);
    pushDateItems(item);
    pushRoomsStay(item);
    dateItems = [];
  }

  function pushDate(item) {
    items.push(
      <details key={uuidv4()} id={item} className='itinerary-date'>
        <summary>{dateStrShort(item)}</summary>
        <ul>
          <li>
            <button className='stacked'  onClick={e => handleDateClick(item, 'activity', e)}>
              Add Activity
            </button>
          </li>
          <li>
            <button className='stacked'  onClick={e => handleDateClick(item, 'car', e)}>
              Add Car
            </button>
          </li>
          <li>
            <button className='stacked'  onClick={e => handleDateClick(item, 'room', e)}>
              Add Room
            </button>
          </li>
          <li>
            <button className='stacked'  onClick={e => handleDateClick(item, 'transport', e)}>
              Add Transport
            </button>
          </li>
        </ul>
      </details>              
    );
  }

    

  function pushDateItems(item){
    pushTransportsOvernight(item);
    pushRoomsCheckOut(item);
    pushCarsDropOff(item);
    pushTransports(item);
    pushCarsPickUp(item);
    pushActivities(item);
    pushRoomsCheckIn(item);
    dateItems.sort((a, b) => a.value.localeCompare(b.value))
    let sortedItems = [];
    dateItems.forEach(pushItineraryItems);
    function pushItineraryItems(item){
      sortedItems.push(itineraryItem(item.item, item.value))
    }
    items.push(sortedItems);
  }

  function pushActivities(item) {
    const todaysActivities = activities.filter(obj => {
      return (
        dateStrShort(obj.astart_Date) === dateStrShort(item)
      );
    });
    todaysActivities.forEach(pushActivity);
  }

  function pushActivity(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[0])} ${item.bdetails}`}
    );
  }



  function pushCarsDropOff(item) {
    const todaysCars = cars.filter(obj => {
      return dateStrShort(obj.bend) === dateStrShort(item);
    });
    todaysCars.forEach(pushCarDropOff);
  }

  function pushCarDropOff(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[1])} Drop Off Car: ${item.cagency}, ${
          item.fdrop_Off_Location
        }`}
    );
  }

  function pushCarsPickUp(item) {
    const todaysCars = cars.filter(obj => {
      return dateStrShort(obj.astart) === dateStrShort(item);
    });
    todaysCars.forEach(pushCarPickUp);
  }

  function pushCarPickUp(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[0])} Pick Up Car: ${item.cagency}, ${
          item.dpick_Up_Location
        }, ${item.edetails}`}
    );
  }

  function pushTransports(item) {
    const todaysTransports = transports.filter(obj => {
      return dateStrShort(obj.astart) === dateStrShort(item);
    });
    todaysTransports.forEach(pushTransport);
  }

  function pushTransport(item) {
    let arrDate = '';
    if (
      dateStrShort(item.astart) !==
      dateStrShort(item.bend)
    ) {
      arrDate = dateStrShort(item.bend) + ' ';
    }
    dateItems.push(
      {item: item, value:`${timeStr(Object.values(item)[0])} - ${arrDate}${timeStr(Object.values(item)[1])}  ${item.cdetails}`}
    );
  }

  function pushTransportsOvernight(item) {
    const todaysTransports = transports.filter(obj => {
      return dateStrShort(obj.dovernight_Arrival_Date) === dateStrShort(item);
    });
    todaysTransports.forEach(pushTransportOvernight);
  }

  function pushTransportOvernight(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[1])} Arrival: ${
        item.cdetails
      }`}
    );
  }

  function pushRoomsCheckOut(item) {
    const todaysRooms = rooms.filter(obj => {
      return dateStrShort(obj.bend_Date) === dateStrShort(item);
    });
    todaysRooms.forEach(pushRoomCheckOut);
  }

  function pushRoomCheckOut(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[1])} Check Out: ${item.croom}`}
    );
  }

  function pushRoomsCheckIn(item) {
    const todaysRooms = rooms.filter(obj => {
      return dateStrShort(obj.astart_Date) === dateStrShort(item);
    });
    todaysRooms.forEach(pushRoomCheckIn);
  }

  function pushRoomCheckIn(item) {
    dateItems.push(
      {item: item, value: `${timeStr(Object.values(item)[0])} Check In: ${item.croom}, ${item.ddetails}`}
    );
  }

  function pushRoomsStay(item) {
    //item = a trip date 'yyyy-mm-dd'
    const todaysRooms = rooms.filter(obj => {
      return obj.fstay_Dates.includes(item);
    });
    todaysRooms.forEach(pushRoomStay);
  }

  function pushRoomStay(item) {
    // item == room object
    items.push(itineraryItem(item, `Continue Stay: ${item.croom}`));
  }
  
  return <div key={uuidv4()}  id='itinerary-items'>{items}</div>;
}
