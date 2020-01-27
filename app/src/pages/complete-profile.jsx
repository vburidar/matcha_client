import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@material-ui/core';

import GeneralSettingsForm from '../components/GeneralSettingsForm';
import PicturesUpload from '../components/PicturesUpload';

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
}));

function Localisation() {
  return (
    <div>
      Localisation
    </div>
  );
}

export default function CompleteProfilePage() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [disabled, setDisabled] = useState(true);

  /** General settings form state */
  const [inputs, setInputs] = useState({
    birthdate: null,
    gender: '',
    sexualOrientation: [],
    description: '',
    interests: [],
  });

  const propsToPass = {
    generalProps: {
      inputs, setInputs, disabled, setDisabled,
    },
    picturesProps: {
      disabled, setDisabled,
    },
    localisationProps: {},
  };

  const steps = ({ generalProps, picturesProps, localisationProps }) => [
    {
      name: 'General',
      component: <GeneralSettingsForm props={generalProps} />,
    },
    {
      name: 'Pictures',
      component: <PicturesUpload props={picturesProps} />,
    },
    {
      name: 'Localisation',
      component: <Localisation props={localisationProps} />,
    },
  ];

  const goToNextStep = () => {
    if (activeStep + 1 < steps({}, {}, {}).length - 1) {
      setActiveStep(activeStep + 1);
      setDisabled(true);
    }
  };

  const completeProfile = async () => {
    console.log('completeProfile');
    console.log(inputs);
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps(propsToPass).map(({ name }) => (
            <Step key={name}>
              <StepLabel>{name}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper elevation={0} className={classes.paper}>
          <div>
            {steps(propsToPass)[activeStep].component}
          </div>
        </Paper>
        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          {activeStep < 2 && (
            <Button
              disabled={disabled}
              onClick={goToNextStep}
            >
            NEXT
            </Button>
          )}
          {/* {activeStep === 2 && ( */}
          <Button
            variant="contained"
            color="primary"
            disabled={false}
            onClick={completeProfile}
          >
            FINISH
          </Button>
          {/* )} */}
        </Paper>
      </Paper>
    </Container>
  );
}
