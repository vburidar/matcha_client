import {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@material-ui/core';

import GeneralSettings from '../components/settings/GeneralSettings';
import PicturesSettings from '../components/settings/PicturesSettings';
import LocationsSettings from '../components/settings/LocationsSettings';

import { StoreContext } from '../store/Store';
import { createApiRequester } from '../api/Api';
import { getLabelFromPos, SettingsContext } from '../Settings';
import redirectTo from '../initialServices/initialServices';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
  previousButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function CompleteProfilePage({ ipLocation, user }) {
  const { dispatch } = useContext(StoreContext);
  const {
    inputs,
    setInputs,
    pictures,
    dispatchPictures,
    locations,
    dispatchLocations,
    generalDisabled,
    picturesDisabled,
    locationsDisabled,
    disabled,
    setDisabled,
    updateProfile,
  } = useContext(SettingsContext);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: user.id });
    setInputs({
      ...inputs,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    if (locations.length === 0) {
      dispatchLocations({
        type: 'addLocation',
        payload: {
          label: ipLocation.label,
          latitude: ipLocation.latitude,
          longitude: ipLocation.latitude,
          type: 'ip',
          isActive: true,
        },
      });
    }
  }, []);

  const generalProps = { inputs, setInputs };
  const picturesProps = {
    disabled, setDisabled, pictures, dispatchPictures,
  };
  const locationsProps = {
    getLabelFromPos, disabled, setDisabled, locations, dispatchLocations,
  };

  const steps = [
    {
      name: 'General',
      component: <GeneralSettings props={generalProps} />,
      disabled: generalDisabled,
    },
    {
      name: 'Pictures',
      component: <PicturesSettings props={picturesProps} />,
      disabled: picturesDisabled,
    },
    {
      name: 'Location',
      component: <LocationsSettings props={locationsProps} />,
      disabled: locationsDisabled,
    },
  ];

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(({ name }) => (
            <Step key={name}>
              <StepLabel>{name}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper elevation={0} className={classes.paper}>
          {steps[activeStep].component}
        </Paper>
        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          {activeStep > 0 && (
            <Button
              onClick={() => (activeStep > 0) && setActiveStep(activeStep - 1)}
              variant="contained"
              className={classes.previousButton}
            >
              PREVIOUS
            </Button>
          )}
          {activeStep < 2 && (
            <Button
              variant="contained"
              disabled={steps[activeStep].disabled}
              onClick={() => (activeStep + 1 < steps.length) && setActiveStep(activeStep + 1)}
            >
              NEXT
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              color="primary"
              disabled={steps.filter((step) => step.disabled).length > 0}
              onClick={updateProfile}
            >
              FINISH
            </Button>
          )}
        </Paper>
      </Paper>
    </Container>
  );
}

CompleteProfilePage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === true) {
    redirectTo('/profile/settings', req, res);
  }
  const u = await apiObj.get(`users/getProfileInfo/current`);
  const user = u.data;
  try {
    const ipLoc = await axios('http://ip-api.com/json');
    const latitude = ipLoc.data.lat;
    const longitude = ipLoc.data.lon;
    const label = await getLabelFromPos(latitude, longitude);
    return {
      ipLocation: {
        label,
        latitude,
        longitude,
      },
      user,
    };
  } catch (err) {
    console.error(err.message);
    return { type: 'error', id: 'Unable to get user data' };
  }
};
