import { v4 as uuidv4 } from 'uuid';
import { dowMonthDayFromStr } from '@/utils';

export default function Transport({ data, onClick}) {

  const items = data?.map((detail) => {   
    const item = {...detail, type: 'transport'};
  return (
    <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
      <strong>{dowMonthDayFromStr(Object.values(item)[0], 'short')}</strong><br />
      {Object.values(item)[0].substring(11)}{'-'}
      {dowMonthDayFromStr(Object.values(item)[0], 'short') !==
            dowMonthDayFromStr(Object.values(item)[1], 'short') &&
            dowMonthDayFromStr(Object.values(item)[1], 'short') + '  '}
      {Object.values(item)[1].substring(11)}{' '}
      {Object.values(item)[2]}
    </p>
  )});

  return <>{items}</>
}
