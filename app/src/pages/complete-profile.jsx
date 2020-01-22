import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import Layout from '../components/Layout';
import GeneralSettingsForm from '../components/GeneralSettingsForm';

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

function Pictures() {
  return (
    <div>Pictures</div>
  );
}

function Localisation() {
  return (
    <div>Localisation</div>
  );
}

// function getStepContent(step, { generalProps, picturesProps, localisationProps }) {
//   switch (step) {
//     case 0:
//       return <GeneralSettingsForm props={generalProps} />;
//     case 1:
//       return <Pictures props={picturesProps} />;
//     case 2:
//       return <Localisation props={localisationProps} />;
//     default:
//       return 'Unknown step';
//   }
// }
// const steps = [
//   'General',
//   'Pictures',
//   'Localisation',
// ];

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
    interest: '',
    interests: [],
  });

  const propsToPass = {
    generalProps: {
      inputs, setInputs, disabled, setDisabled,
    },
    picturesProps: {},
    localisationProps: {},
  };

  const steps = ({ generalProps, picturesProps, localisationProps }) => [
    {
      name: 'General',
      component: <GeneralSettingsForm props={generalProps} />,
    },
    {
      name: 'Pictures',
      component: <Pictures props={picturesProps} />,
    },
    {
      name: 'Localisation',
      component: <Localisation props={localisationProps} />,
    },
  ];

  return (
    <Layout>
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
              {/* {getStepContent(activeStep, propsToPass)} */}
              {steps(propsToPass)[activeStep].component}
            </div>
          </Paper>
          <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
            <Button disabled={disabled} onClick={() => setActiveStep(activeStep + 1)}>NEXT</Button>
          </Paper>
        </Paper>
      </Container>
    </Layout>
  );
}
