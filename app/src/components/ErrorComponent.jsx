import { Typography } from '@material-ui/core';
import Link from 'next/link';

export default function ErrorComponent({ status, message }) {
  return (
    <div>
      <Typography>
        {'An error occured. '}
        <Link href="/">
          <a>
            Go back to Home
          </a>

        </Link>
      </Typography>
    </div>
  );
}
