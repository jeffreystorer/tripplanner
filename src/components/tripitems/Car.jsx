import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr } from '@/utils';

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
          {dateStrShort(Object.values(item)[0])} {' - '}   
          {dateStrShort(Object.values(item)[1])}
             
        </strong> {'  '}
              {Object.values(item)[2]}<br />
              Pick up: {timeStr(Object.values(item)[0])}
              {'  '}
              {pickUpLocation}<br />
              Drop off: {timeStr(Object.values(item)[1])}
              {'  '}
              {dropOffLocation}
      </p>   
  )});

  return <>{items}</>
 }