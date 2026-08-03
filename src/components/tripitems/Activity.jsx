import { Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr } from '@/utils';

export default function Activity({ data, onClick }) {

  const items = data?.map((detail) => {   
    const item = {...detail, type: 'activity'};
  return (
    <Fragment key={uuidv4()}>
      <p className='item' onClick={e => onClick(item, e)}>
        <strong>
          {dateStrShort(Object.values(item)[0])}{' '} 
        </strong><br />
        </p>
        <p className='activityItem'>{timeStr(Object.values(item)[0])}{' '}{Object.values(item)[1]}
        </p>
      </Fragment>
  )});

  return <>{items}</>
}
