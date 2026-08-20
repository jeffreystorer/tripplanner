import { Fragment } from 'react';
import { dateStrShort, linkify, timeStr } from '@/utils';

export default function Activity({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'activity'};
  return (
    <Fragment key={item.key}>
      <p className='item' onClick={e => onClick(item, e)}>
        <strong>
          {dateStrShort(item.astart_Date)}{' '}
        </strong><br />
        </p>
        <p className='activityItem'>{timeStr(item.astart_Date)}{' '}{linkify(item.bdetails)}
        </p>
      </Fragment>
  )});

  return <>{items}</>
}
