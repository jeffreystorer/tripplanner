import { dateStrShort, linkify, timeStr } from '@/utils';

export default function Car({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'car'}
    const pickUpLocation = item.dpick_Up_Location.split('\n').shift();
    let dropOffLocation = item.fdrop_Off_Location.split('\n').shift();
    if (dropOffLocation !== '') {
      dropOffLocation = (pickUpLocation === dropOffLocation) ? '' : dropOffLocation
    }
  return (
      <p key={item.key} className='item' onClick={e => onClick(item, e)}>
        <strong>
          {dateStrShort(item.astart)} {' - '}
          {dateStrShort(item.bend)}

        </strong> {'  '}
              {item.cagency}<br />
              Pick up: {timeStr(item.astart)}
              {'  '}
              {pickUpLocation}<br />
              Drop off: {timeStr(item.bend)}
              {'  '}
              {dropOffLocation}
              {item.edetails && (
                <>
                  <br />
                  {linkify(item.edetails)}
                </>
              )}
      </p>
  )});

  return <>{items}</>
 }
