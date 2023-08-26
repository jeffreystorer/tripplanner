import { v4 as uuidv4 } from 'uuid';
import { dateStrShort, timeStr } from '@/utils';

export default function Transport({ data, onClick}) {

  const items = data?.map((detail) => {   
    const item = {...detail, type: 'transport'};
  return (
    <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
      <strong>{dateStrShort(Object.values(item)[0])}</strong><br />
      {timeStr(Object.values(item)[0])}{'-'}
      {dateStrShort(Object.values(item)[0]) !==
            dateStrShort(Object.values(item)[1]) &&
            dateStrShort(Object.values(item)[1]) + '  '}
      {timeStr(Object.values(item)[1])}{' '}
      {Object.values(item)[2]}
    </p>
  )});

  return <>{items}</>
}
