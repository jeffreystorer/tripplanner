import { Activity, Car, MapLink, Note, Room, Transport } from '@/components/tripitems';

export default function createTripItems(page, data, onClick) {

  switch (page) {
    case 'activity':
      return <Activity data={data} onClick={onClick}/>;
    case 'car':
      return <Car data={data} onClick={onClick}/>;
    case 'map':
      return <MapLink data={data} onClick={onClick}/>;
    case 'note':
      return <Note data={data} onClick={onClick}/>;
    case 'room':
      return <Room data={data} onClick={onClick}/>;
    case 'transport':
      return <Transport data={data} onClick={onClick}/>;
    default:
      break;
  }
}
