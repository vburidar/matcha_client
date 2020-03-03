import { Typography } from '@material-ui/core';
import { useEffect } from 'react';

export default function ErrorComponent({ error, status, message }) {
  return (
    <div>
      <Typography>
        An error occured with code
        {' '}
        {status}
        {' '}
        and the following message
        {' \''}
        {message}
        {'\''}
      </Typography>
    </div>
  );
}
