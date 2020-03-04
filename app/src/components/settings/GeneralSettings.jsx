import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { subYears } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  ListItemText,
  Checkbox,
  FormHelperText,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { SettingsContext } from '../../stores/Settings';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '70%',
    margin: 'auto',
  },
  formControl: {
    margin: theme.spacing(1, 0),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const genders = [
  {
    name: 'Man',
    value: 1,
  },
  {
    name: 'Woman',
    value: 2,
  },
  {
    name: 'Gender Queer',
    value: 4,
  },
  {
    name: 'Gender Fluid',
    value: 8,
  },
];

export default function GeneralSettings() {
  const classes = useStyles();
  const {
    inputs,
    setInputs,
    errors,
  } = useContext(SettingsContext);

  const [interest, setInterest] = useState('');

  const handleInterestDelete = (interestToDelete) => () => {
    setInputs({
      ...inputs,
      ...{ interests: inputs.interests.filter((el) => el !== interestToDelete) },
    });
  };

  const handleInterestChange = (event) => {
    if (/^[a-zA-Z0-9-'. ]*$/.test(event.target.value) === true) {
      setInterest(event.target.value);
    }
  };

  const handleInputChange = (event) => {
    let dataToSet = {};
    if (event instanceof Date || event === null) {
      dataToSet = { target: { name: 'birthdate', value: event } };
    } else {
      dataToSet = event;
    }
    setInputs({
      ...inputs,
      ...{ [dataToSet.target.name]: dataToSet.target.value },
    });
  };

  const handleKeyDown = (e) => {
    const interestModified = interest.trim().toLowerCase().replace(/ /g, '_');
    if (
      e.key === 'Enter'
      && interestModified !== ''
      && inputs.interests.indexOf(interestModified) === -1
    ) {
      setInputs({
        ...inputs,
        ...{ interests: inputs.interests.concat([interestModified]) },
      });
      setInterest('');
    }
  };

  return (
    <form className={classes.form} noValidate autoComplete="on">
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          id="first-name"
          name="firstName"
          label="First name"
          value={inputs.firstName}
          onChange={handleInputChange}
          helperText={
            errors.firstName
              ? 'First Name should be between 2 and 20 characters and should consist of letters and - . and spaces'
              : ''
          }
          error={errors.firstName}
        />
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <TextField
          id="last-name"
          name="lastName"
          label="Last name"
          value={inputs.lastName}
          onChange={handleInputChange}
          helperText={
            errors.lastName
              ? 'Last Name should be between 2 and 20 characters and should consist of letters and - . and spaces'
              : ''
          }
          error={errors.lastName}
        />
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            id="birthdate"
            label="Birthdate"
            variant="inline"
            disableToolbar
            autoOk
            initialFocusedDate={subYears(new Date(), 25)}
            maxDate={subYears(new Date(), 18)}
            minDate={subYears(new Date(), 80)}
            format="MM/dd/yyyy"
            value={inputs.birthdate}
            onChange={handleInputChange}
            helperText={
              errors.birthdate
                ? 'You must be between 18 and 80 years old'
                : ''
            }
            error={errors.birthdate}
          />
        </MuiPickersUtilsProvider>
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          name="gender"
          value={inputs.gender}
          onChange={handleInputChange}
        >
          {genders.map((gender) => (
            <MenuItem key={gender.value} value={gender.value}>{gender.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel id="sexual-preference-label">Interested in</InputLabel>
        <Select
          labelId="sexual-preference-label"
          id="sexual-preference"
          name="sexualPreference"
          multiple
          value={inputs.sexualPreference}
          renderValue={(selected) => selected.map(
            (el2) => genders.find((el) => el.value === el2).name,
          ).join(', ')}
          onChange={handleInputChange}
        >
          {genders.map((gender) => (
            <MenuItem key={gender.name} value={gender.value}>
              <Checkbox checked={inputs.sexualPreference.indexOf(gender.value) > -1} />
              <ListItemText primary={gender.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <TextField
          id="description"
          name="description"
          label="Description"
          multiline
          rows="4"
          value={inputs.description}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <TextField
          id="interest"
          name="interest"
          label="Center of interests"
          onKeyDown={handleKeyDown}
          value={interest}
          onChange={handleInterestChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      {errors.interests && (
        <FormHelperText error>You must have between 3 and 7 center of interests</FormHelperText>
      )}

      {inputs.interests.map((label) => (
        <Chip
          size="small"
          className={classes.chip}
          key={label}
          label={
            label
              .replace(/^[a-z]|\.[a-z]|-[a-z]|_[a-z]|'[a-z]/g, (el) => el.toUpperCase())
              .replace(/_/g, ' ')
          }
          onDelete={handleInterestDelete(label)}
          color="primary"
        />
      ))}

    </form>
  );
}
