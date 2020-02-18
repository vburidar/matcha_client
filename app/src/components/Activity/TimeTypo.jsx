import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const Timetypo = (props) => {
  const [data] = useState(props.props);

  if (data.years_since > 0) {
    return (
      <Typography color="textPrimary" component="h4">
        {data.years_since}
        {' year(s) ago'}
      </Typography>
    );
  } if (data.month_since > 0) {
    return (
      <Typography color="textPrimary" component="h4">
        {data.months_since}
        {' month(s) ago'}
      </Typography>
    );
  } if (data.day_since > 0) {
    return (
      <Typography color="textPrimary" component="h4">
        {data.days_since}
        {' day(s) ago'}
      </Typography>
    );
  } if (data.hours_since > 0) {
    return (
      <Typography color="textSecondary" component="h4">
        {data.hours_since}
        {' hour(s) ago'}
      </Typography>
    );
  }
  return (
    <Typography color="textPrimary" component="h4">
      {' a few moments ago'}
    </Typography>
  );
};

export default Timetypo;
