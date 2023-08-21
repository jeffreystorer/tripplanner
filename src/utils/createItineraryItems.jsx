import { Fragment } from 'react';
import { Star } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import { dowMonthDayFromStr } from '@/utils';

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
  const travels = data.travels;

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

  let items = [];
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

  function pushDateGroup(item) {
    pushDate(item);
    pushTravelsOvernight(item);
    pushRoomsStay(item);
    pushRoomsCheckOut(item);
    pushPreActivities(item);
    pushCarsDropOff(item);
    pushTravels(item);
    pushCarsPickUp(item);
    pushActivities(item);
    pushRoomsCheckIn(item);
    pushRoomsStay(item);
    pushPostActivities(item);
  }

  function pushDate(item) {
    items.push(
      <details key={uuidv4()} id={item} className='itinerary-date'>
        <summary>{dowMonthDayFromStr(item, 'long')}</summary>
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
            <button className='stacked'  onClick={e => handleDateClick(item, 'travel', e)}>
              Add Travel
            </button>
          </li>
        </ul>
      </details>              
    );
  }

  function pushPreActivities(item) {
    const todaysActivities = activities.filter(obj => {
      return obj.astart_Date === item && obj.bdetails.charAt(0) === '<';
    });
    todaysActivities.forEach(pushPreActivity);
  }

  function pushPreActivity(item) {
    items.push(
      itineraryItem(item, item.bdetails.substring(1))
    );
  }

  function pushActivities(item) {
    const todaysActivities = activities.filter(obj => {
      return (
        obj.astart_Date === item &&
        obj.bdetails.charAt(0) !== '<' &&
        obj.bdetails.charAt(0) !== '>'
      );
    });
    todaysActivities.forEach(pushActivity);
  }

  function pushActivity(item) {
    items.push(
      itineraryItem(item, item.bdetails)
    );
  }

  function pushPostActivities(item) {
    const todaysActivities = activities.filter(obj => {
      return obj.astart_Date === item && obj.bdetails.charAt(0) === '>';
    });
    todaysActivities.forEach(pushPostActivity);
  }

  function pushPostActivity(item) {
    items.push(
      itineraryItem(item, item.bdetails.substring(1))
    );
  }

  function pushCarsDropOff(item) {
    const todaysCars = cars.filter(obj => {
      return obj.bend.substring(0, 10) === item;
    });
    todaysCars.forEach(pushCarDropOff);
  }

  function pushCarDropOff(item) {
    items.push(
      itineraryItem(item, `Drop Off Car: ${item.bend.substring(11)} ${item.cagency}, ${
          item.fdrop_Off_Location
        }`)
    );
  }

  function pushCarsPickUp(item) {
    const todaysCars = cars.filter(obj => {
      return obj.astart.substring(0, 10) === item;
    });
    todaysCars.forEach(pushCarPickUp);
  }

  function pushCarPickUp(item) {
    items.push(
      itineraryItem(item, `Pick Up Car: ${item.astart.substring(11)} ${item.cagency}, ${
          item.dpick_Up_Location
        }, ${item.edetails}`)
    );
  }

  function pushTravels(item) {
    const todaysTravels = travels.filter(obj => {
      return obj.astart.substring(0, 10) === item;
    });
    todaysTravels.forEach(pushTravel);
  }

  function pushTravel(item) {
    let arrDate = '';
    if (
      dowMonthDayFromStr(item.astart, 'short') !==
      dowMonthDayFromStr(item.bend, 'short')
    ) {
      arrDate = dowMonthDayFromStr(item.bend, 'short') + ' ';
    }
    items.push(
      itineraryItem(item,`${item.astart.substring(11)}-${arrDate}${item.bend.substring(
          11
        )}  ${item.cdetails}`)
    );
  }

  function pushTravelsOvernight(item) {
    const todaysTravels = travels.filter(obj => {
      return obj.dovernight_Arrival_Date === item;
    });
    todaysTravels.forEach(pushTravelOvernight);
  }

  function pushTravelOvernight(item) {
    items.push(
      itineraryItem(item, `Overnight Travel: ${dowMonthDayFromStr(
          item.astart,
          'short'
        )}  ${item.astart.substring(11)}-${item.bend.substring(11)}  ${
          item.cdetails
        }`)
    );
  }

  function pushRoomsCheckOut(item) {
    const todaysRooms = rooms.filter(obj => {
      return obj.bend_Date === item;
    });
    todaysRooms.forEach(pushRoomCheckOut);
  }

  function pushRoomCheckOut(item) {
    items.push(
      itineraryItem(item, `Check Out: ${item.croom}`)
    );
  }

  function pushRoomsCheckIn(item) {
    const todaysRooms = rooms.filter(obj => {
      return obj.astart_Date === item;
    });
    todaysRooms.forEach(pushRoomCheckIn);
  }

  function pushRoomCheckIn(item) {
    items.push(
      itineraryItem(item, `Check In: ${item.croom}, ${item.ddetails}`)
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
    items.push(
      itineraryItem(item, `Continue Stay: ${item.croom}`)
    );
  }
  return <div key={uuidv4()}  id='itinerary-items'>{items}</div>;
}
