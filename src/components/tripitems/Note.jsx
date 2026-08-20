import { Star } from 'react-feather';
import { linkify } from '@/utils';

export default function Note({ data, onClick }) {

  const items = data?.map((detail) => {
    const item = {...detail, type: 'note'}
  return (
    <div key={item.key} className='note-item' onClick={e => onClick(item, e)}>
      <Star />&nbsp;&nbsp;
      <p className='item'>
        {linkify(item.anote)}
      </p>
    </div>
  )});

  return <>{items}</>
}
