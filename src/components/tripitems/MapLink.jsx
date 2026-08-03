import { MapPin } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr, toMapsHref } from '@/utils';

export default function MapLink({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'map'};
    const href = toMapsHref(Object.values(item)[2]);
  return (
      <p key={uuidv4()} className='map-item'>
        <strong>
          {dateStrShort(Object.values(item)[0])}{' '}
          {timeStr(Object.values(item)[0])}
        </strong>
        <a href={href} target='_blank' rel='noopener noreferrer'>
          <MapPin size={16} />&nbsp;{Object.values(item)[1] || 'Google Maps'}
        </a>
        <button
          type='button'
          className='map-edit'
          onClick={e => onClick(item, e)}
        >
          Edit
        </button>
      </p>
  )});

  return <>{items}</>
}
