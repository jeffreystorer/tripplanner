import { Fragment } from 'react';
import { MapPin } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr, toMapsHref } from '@/utils';

export default function MapLink({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'map'};
    const href = toMapsHref(Object.values(item)[2]);
  return (
      <Fragment key={uuidv4()}>
        <p className='item'>
          <strong>
            {dateStrShort(Object.values(item)[0])}{' '}
            {timeStr(Object.values(item)[0])}
          </strong>
        </p>
        <p className='map-item'>
          <a href={href} target='_blank' rel='noopener noreferrer'>
            <MapPin size={16} />&nbsp;{Object.values(item)[1] || "Today's Route"}
          </a>
          <button
            type='button'
            className='map-edit'
            onClick={e => onClick(item, e)}
          >
            Edit
          </button>
        </p>
      </Fragment>
  )});

  return <>{items}</>
}
