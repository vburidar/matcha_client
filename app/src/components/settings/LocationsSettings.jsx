import { useEffect, useContext } from 'react';

import { StoreContext } from '../../store/Store';
import { newNotification } from '../../store/actions';

import SingleLocation from './SingleLocation';

async function getGpsPositionAsync() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      },
    );
  });
}

export default function LocationsSettings({
  props: {
    locations, dispatchLocations, getLabelFromPos,
  },
}) {
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    const init = async () => {
      try {
        const pos = await getGpsPositionAsync();
        const { latitude, longitude } = pos.coords;
        const label = await getLabelFromPos(latitude, longitude);
        dispatchLocations({
          type: 'updateLocation',
          payload: {
            label,
            latitude,
            longitude,
            type: 'gps',
            isActive: true,
            index: 0,
          },
        });
      } catch (err) {
        if (typeof err.code === 'undefined' || err.code > 1) {
          newNotification(dispatch, { message: err.message, severity: 'error' });
        }
      }
    };
    init();
  }, []);

  return (
    <div>
      {locations.map((location, index) => (
        <SingleLocation
          key={index}
          index={index}
          disabled={false}
        />
      ))}
    </div>
  );
}
