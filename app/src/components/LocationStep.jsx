import { useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SingleLocation from './SingleLocation';

const useStyles = makeStyles((theme) => ({
}));

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

function reducer(state, action) {
  switch (action.type) {
    case 'addLocation':
      return {
        ...state,
        label: action.payload.label,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type,
      };
    case 'updateLocationName':
      return {
        ...state,
        name: action.payload.name,
      };
    case 'resetLocation':
      return {
        ...state,
        label: '',
        latitude: 0,
        longitude: 0,
        type: 'custom',
      };
    default:
      return state;
  }
}

export default function LocationStep({
  props: {
    ipLocation, getLabelFromPos,
  },
}) {
  const classes = useStyles();
  const [location, dispatchLocation] = useReducer(reducer, {
    name: 'Default',
    label: '',
    latitude: 0,
    longitude: 0,
    type: 'custom',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const pos = await getGpsPositionAsync();
        const { latitude, longitude } = pos.coords;
        const label = await getLabelFromPos(latitude, longitude);
        dispatchLocation({
          type: 'addLocation',
          payload: {
            label,
            latitude,
            longitude,
            type: 'gps',
          },
        });
      } catch (err) {
        dispatchLocation({
          type: 'addLocation',
          payload: {
            ...ipLocation,
            type: 'ip',
          },
        });
      }
    };
    init();
  }, []);

  return (
    <div>
      <SingleLocation
        location={location}
        dispatchLocation={dispatchLocation}
      />
    </div>
  );
}
