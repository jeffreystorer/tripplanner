import { Fragment } from 'react';
import { FileText, Globe, Mail, MapPin } from 'react-feather';
import { dateStrShort, linkKind, timeStr, toMapsHref } from '@/utils';

const ICONS = { map: MapPin, mail: Mail, doc: FileText, web: Globe };
const FALLBACK_LABEL = { map: 'Google Maps', mail: 'Email', doc: 'Document', web: 'Link' };

export default function MapLink({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'map'};
    const href = toMapsHref(item.cmap_Link);
    const kind = linkKind(href);
    const Icon = ICONS[kind];
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
            <Icon size={16} />&nbsp;{item.bdescription || FALLBACK_LABEL[kind]}
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
