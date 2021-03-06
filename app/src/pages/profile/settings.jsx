import {
  useEffect, useContext, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
} from '@material-ui/core';

import CredentialsSettings from '../../components/settings/CredentialsSettings';
import GeneralSettings from '../../components/settings/GeneralSettings';
import PicturesSettings from '../../components/settings/PicturesSettings';
import LocationsSettings from '../../components/settings/LocationsSettings';

import { createApiRequester } from '../../stores/Api';
import { StoreContext } from '../../store/Store';
import { getLabelFromPos, SettingsContext } from '../../stores/Settings';
import redirectTo from '../../initialServices/initialServices';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
}));

function intToBitsArray(value) {
  const ret = [];
  for (let bitToTest = 32; bitToTest > 0; bitToTest /= 2) {
    if ((value & bitToTest) === bitToTest) {
      ret.push(bitToTest);
    }

    if (bitToTest === 1) break;
  }
  return ret;
}

export default function SettingsPage({ user }) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const {
    credentials,
    setCredentials,
    setInputs,
    dispatchPictures,
    dispatchLocations,
    credentialsDisabled,
    generalDisabled,
    picturesDisabled,
    locationsDisabled,
    updateProfile,
  } = useContext(SettingsContext);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    async function init() {
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: user.id });
      setCredentials({
        ...credentials,
        login: user.login,
        email: user.email,
      });
      setInputs({
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: new Date(user.birthdate),
        gender: user.gender,
        sexualPreference: intToBitsArray(user.sexualPreference),
        description: user.description,
        interests: user.interests.map((interest) => interest.name),
      });
      dispatchPictures({
        type: 'initialisePictures',
        payload: {
          pictures: user.images,
        },
      });

      const labelPromises = [];
      user.locations.forEach((location) => {
        labelPromises.push(getLabelFromPos(location.latitude, location.longitude));
      });
      const labels = await Promise.all(labelPromises);
      const newLocations = user.locations.map((location, i) => ({
        ...location,
        label: labels[i],
      }));
      dispatchLocations({
        type: 'initialiseLocations',
        payload: {
          locations: newLocations,
        },
      });
    }
    init();
  }, []);

  const tabs = [
    {
      name: 'Credentials',
      component: <CredentialsSettings email={user.email} />,
    },
    {
      name: 'General',
      component: <GeneralSettings />,
    },
    {
      name: 'Pictures',
      component: <PicturesSettings />,
    },
    {
      name: 'Locations',
      component: <LocationsSettings />,

    },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h6">SETTINGS</Typography>
      <Paper>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, val) => setCurrentTab(val)}
          className={classes.tabs}
          centered
        >
          {tabs.map((tab) => (
            <Tab key={tab.name} label={tab.name} />
          ))}
        </Tabs>

        <Paper elevation={0} className={classes.paper}>
          {tabs[currentTab].component}
        </Paper>

        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          <Button
            disabled={credentialsDisabled || generalDisabled
              || picturesDisabled || locationsDisabled}
            onClick={updateProfile}
            variant="contained"
            color="primary"
          >
            UPDATE
          </Button>
        </Paper>

      </Paper>
    </Container>
  );
}

SettingsPage.getInitialProps = async ({ req, res }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }

  if (data.profileIsComplete === false) {
    redirectTo('complete-profile', req, res);
  }
  const u = await apiObj.get('users/current');
  const user = u.data;
  return ({ user });
};
