import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import {
  TextField,
  Grid,
  FormHelperText,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { StoreContext } from '../../store/Store';
import { newNotification } from '../../store/actions';

import { countryToFlag, SettingsContext } from '../../stores/Settings';

export default function SingleLocation({ index, disabled }) {
  const { dispatch } = useContext(StoreContext);
  const { locations, dispatchLocations, errors } = useContext(SettingsContext);
  const [timeoutId, setTimeoutId] = useState(-1);
  const [locationSuggestions, setLocationSuggestions] = useState([locations[index]]);

  async function getLocationSuggestions(queryText) {
    try {
      if (queryText.trim() === '') {
        return setLocationSuggestions([]);
      }

      const query = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json'
          + `?apiKey=${process.env.HERE_API_KEY}`
          + `&query=${queryText}`
          + '&maxresults=10';

      const res = await axios.get(query);
      let { suggestions } = res.data;

      suggestions = suggestions
        .filter((el) => (
          ['houseNumber', 'intersection', 'street', 'postalCode', 'district'].indexOf(el.matchLevel) > -1
        ))
        .map((suggestion) => ({
          label: `${countryToFlag(suggestion.countryCode)} ${suggestion.label.split(',').slice(1).join(',')}`,
          locationId: suggestion.locationId,
          latitude: 0,
          longitude: 0,
        }));

      return setLocationSuggestions(suggestions);
    } catch (err) {
      return newNotification(dispatch, { message: err.message, severity: 'error' });
    }
  }

  function clearAutocomplete() {
    dispatchLocations({ type: 'resetLocation', payload: { index } });
    setLocationSuggestions([]);
  }

  async function selectLocation(selectedSuggestion) {
    try {
      if (selectedSuggestion !== null) {
        const query = 'https://geocoder.ls.hereapi.com/6.2/geocode.json'
          + `?apiKey=${process.env.HERE_API_KEY}`
          + `&locationid=${selectedSuggestion.locationId}`
          + '&jsonattributes=1';

        const res = await axios.get(query);

        if (!res.data.response.view.length === 0) {
          throw new Error('Unable to get area suggestions');
        }

        const [latitude, longitude] = [
          res.data.response.view[0].result[0].location.displayPosition.latitude,
          res.data.response.view[0].result[0].location.displayPosition.longitude,
        ];

        dispatchLocations({
          type: 'updateLocation',
          payload: {
            label: selectedSuggestion.label,
            latitude,
            longitude,
            type: 'custom',
            index,
          },
        });
      }
    } catch (err) {
      newNotification(dispatch, { message: err.message, severity: 'error' });
    }
  }

  function handleOnChange(e, value) {
    if (value === null) {
      clearAutocomplete();
    } else {
      selectLocation(value);
    }
  }
  function handleOnInputChange(e, value, reason) {
    if (reason === 'input') {
      dispatchLocations({
        type: 'updateLocation',
        payload: {
          label: value,
          latitude: 0,
          longitude: 0,
          type: 'custom',
          index,
        },
      });
    }
  }

  useEffect(() => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }

    setTimeoutId(
      setTimeout(() => {
        if (locations[index].latitude === 0 && locations[index].longitude === 0) {
          getLocationSuggestions(locations[index].label);
          setTimeoutId(-1);
        }
      }, 400),
    );
  }, [locations[index].label]);

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item xs={12} sm>
        <TextField
          id="location-name"
          label="Location Name"
          fullWidth
          disabled={disabled}
          value={locations[index].name}
          onChange={(e) => dispatchLocations({
            type: 'updateLocationName',
            payload: {
              name: e.target.value,
              index,
            },
          })}
          helperText={
            errors.locationName
              ? 'Location name should be between 2 and 20 characters and should consist of letters and - . and spaces'
              : ''
          }
          error={errors.locationName}
        />
      </Grid>

      <Grid item xs={12} sm>
        <Autocomplete
          id="location"
          disabled={disabled}
          options={locationSuggestions}
          autoHighlight
          value={locations[index]}
          onInputChange={handleOnInputChange}
          onChange={handleOnChange}
          getOptionLabel={(suggestion) => suggestion.label}
          renderOption={(suggestion) => (
            <>
              <span>{suggestion.label}</span>
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Choose a place"
              label="Location"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        {errors.location && (
          <FormHelperText error>Invalid location</FormHelperText>
        )}
      </Grid>
    </Grid>
  );
}
