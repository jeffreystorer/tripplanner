import { useSyncExternalStore } from 'react';
import {
  isServingLocalData,
  localBackupDate,
  subscribeOfflineData,
} from '@/services';

//Shown whenever the app is displaying the locally saved snapshot rather than
//live data, so the user knows what they are looking at and why saving is off.
export default function OfflineBanner() {
  const offline = useSyncExternalStore(
    subscribeOfflineData,
    isServingLocalData
  );

  if (!offline) return null;

  const date = localBackupDate();
  const when = date ? new Date(date).toLocaleString() : 'an earlier session';

  return (
    <div id='offline-banner' role='status'>
      Offline &ndash; showing your saved copy from {when}. Changes cannot be
      saved until you reconnect.
    </div>
  );
}
