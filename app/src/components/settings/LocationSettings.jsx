import { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { StoreContext } from '../../store/Store';
import { newNotification } from '../../store/actions';

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

export default function LocationSettings({
  props: {
    getLabelFromPos, disabled, setDisabled, location, dispatchLocation,
  },
}) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);

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
        if (typeof err.code === 'undefined' || err.code > 1) {
          newNotification(dispatch, { message: err.message, severity: 'error' });
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    let shouldToggleDisabled = false;
    if (location.latitude === 0 && location.latitude === 0 && disabled === false) {
      shouldToggleDisabled = true;
    }
    if (!(location.latitude === 0 && location.latitude === 0) && disabled === true) {
      shouldToggleDisabled = true;
    }

    if (shouldToggleDisabled) {
      setDisabled(!disabled);
    }
  }, [location.latitude, location.longitude]);

  return (
    <div>
      <SingleLocation
        location={location}
        dispatchLocation={dispatchLocation}
      />
    </div>
  );
}
