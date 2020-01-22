import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { subYears } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
    name: 'Woman',
    value: 'woman',
  },
  {
    name: 'Man',
    value: 'man',
  },
  {
    name: 'Non binary',
    value: 'non-binary',
  },
];

export default function GeneralSettingsForm({
  props: {
    inputs, setInputs, disabled, setDisabled,
  },
}) {
  const classes = useStyles();
  const [interest, setInterest] = useState('');

  const handleInterestDelete = (interestToDelete) => () => {
    setInputs({
      ...inputs,
      ...{ interests: inputs.interests.filter((el) => el !== interestToDelete) },
    });
  };

  const handleInterestChange = (event) => {
    setInterest(event.target.value);
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

  const handleKeyPress = (e) => {
    if (
      e.key === 'Enter'
      && interest.trim() !== ''
      && inputs.interests.indexOf(interest.trim()) === -1
    ) {
      setInputs({
        ...inputs,
        ...{ interests: inputs.interests.concat([interest.trim()]) },
      });
      setInterest('');
    }
  };

  const handleBirthdateError = (err) => {
    if (err !== '' && disabled === false) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    let shouldBeDisabled = false;
    if (
      inputs.birthdate === null
      || genders.findIndex((el) => el.value === inputs.gender) === -1
      || inputs.sexualOrientation.length === 0
      || inputs.description.trim() === ''
      || inputs.interests.length < 3
    ) {
      shouldBeDisabled = true;
    }

    if (disabled !== shouldBeDisabled) {
      setDisabled(!disabled);
    }
  }, [inputs]);

  return (
    <form className={classes.form} noValidate autoComplete="on">
      <FormControl fullWidth className={classes.formControl}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            initialFocusedDate={subYears(new Date(), 25)}
            disableToolbar
            maxDate={subYears(new Date(), 18)}
            minDate={subYears(new Date(), 80)}
            format="MM/dd/yyyy"
            id="birthdate"
            label="Birthdate"
            value={inputs.birthdate}
            onChange={handleInputChange}
            onError={handleBirthdateError}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
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
          <MenuItem value="">None</MenuItem>
          {genders.map((gender) => (
            <MenuItem key={gender.value} value={gender.value}>{gender.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel id="sexual-orientation-label">Interested in</InputLabel>
        <Select
          labelId="sexual-orientation-label"
          id="sexual-orientation"
          name="sexualOrientation"
          multiple
          value={inputs.sexualOrientation}
          renderValue={(selected) => selected.join(', ')}
          onChange={handleInputChange}
        >
          {genders.map((gender) => (
            <MenuItem key={gender.name} value={gender.name}>
              <Checkbox checked={inputs.sexualOrientation.indexOf(gender.name) > -1} />
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
          onKeyPress={handleKeyPress}
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

      {inputs.interests.map((label) => (
        <Chip
          size="small"
          className={classes.chip}
          label={label}
          onDelete={handleInterestDelete(label)}
          color="primary"
        />
      ))}

    </form>
  );
}
