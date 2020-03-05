import { useState, useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';

import { countryToFlag } from '../../stores/Settings';

export default function LocationPicker({ location, setLocation }) {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState(-1);

  function clearAutocomplete() {
    setLocation({ label: '', type: 'default' });
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

        setLocation({
          label: selectedSuggestion.label,
          latitude,
          longitude,
          type: 'custom',
        });
      }
    } catch (err) {
      console.log('error when fetching position');
      // newNotification(dispatch, { message: err.message, severity: 'error' });
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
      setLocation({
        label: value,
        latitude: 0,
        longitude: 0,
        type: 'custom',
      });
    }
  }

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
      console.log('error2');
      return (null);
      // return newNotification(dispatch, { message: err.message, severity: 'error' });
    }
  }

  useEffect(() => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }

    setTimeoutId(
      setTimeout(() => {
        if (location.latitude === 0 && location.longitude === 0) {
          getLocationSuggestions(location.label);
          setTimeoutId(-1);
        }
      }, 400),
    );
  }, [location.label]);

  return (
    <Autocomplete
      id="location"
      options={locationSuggestions}
      autoHighlight
      value={location}
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
          fullWidth
          placeholder="Your position"
        />
      )}
    />
  );
}
