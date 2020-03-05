import { Typography } from '@material-ui/core';

export default function ErrorComponent({ status, message }) {
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
