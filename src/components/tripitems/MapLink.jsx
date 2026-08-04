import { Fragment } from 'react';
import { MapPin } from 'react-feather';
import { dateStrShort, timeStr, toMapsHref } from '@/utils';

export default function MapLink({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'map'};
    const href = toMapsHref(item.cmap_Link);
  return (
      <Fragment key={item.key}>
        <p className='item'>
          <strong>
            {dateStrShort(item.astart_Date)}{' '}
            {timeStr(item.astart_Date)}
          </strong>
        </p>
        <p className='map-item'>
          <a href={href} target='_blank' rel='noopener noreferrer'>
            <MapPin size={16} />&nbsp;{item.bdescription || 'Google Maps'}
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
