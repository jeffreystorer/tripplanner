import { dateStrShort, linkify, timeStr } from '@/utils';

export default function Transport({ data, onClick}) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'transport'};
  return (
    <p key={item.key} className='item' onClick={e => onClick(item, e)}>
      <strong>{dateStrShort(item.astart)}</strong><br />
      {timeStr(item.astart)}{'-'}
      {dateStrShort(item.astart) !==
            dateStrShort(item.bend) &&
            dateStrShort(item.bend) + '  '}
      {timeStr(item.bend)}{' '}
      {linkify(item.cdetails)}
    </p>
  )});

  return <>{items}</>
}
