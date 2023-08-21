import { v4 as uuidv4 } from 'uuid';
import { dowMonthDayFromStr } from '@/utils';

export default function Car({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'car'}  
    const pickUpLocation = Object.values(item)[3].split('\n').shift();
    let dropOffLocation = Object.values(item)[5].split('\n').shift();
    if (dropOffLocation !== '') {
      dropOffLocation = (pickUpLocation === Object.values(item)[5].split('\n').shift()) ? '' : Object.values(item)[5].split('\n').shift()
    }
  return (
      <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
        <strong>
          {dowMonthDayFromStr(Object.values(item)[0], 'short')} {' - '}   
          {dowMonthDayFromStr(Object.values(item)[1], 'short')} 
             
        </strong> {'  '}
              {Object.values(item)[2]}<br />
              Pick up: {Object.values(item)[0].substring(11)}
              {'  '}
              {pickUpLocation}<br />
              Drop off: {Object.values(item)[1].substring(11)}
              {'  '}
              {dropOffLocation}
      </p>   
  )});

  return <>{items}</>
 }