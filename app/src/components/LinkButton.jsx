import React from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';

const LinkButton = React.forwardRef(({
  className, href, hrefAs, children,
}, ref) => (
  <Link href={href} as={hrefAs} ref={ref}>
    <a className={className}>
      {children}
    </a>
  </Link>
));

export default LinkButton;
// const RenderButton = () => <Button component={ButtonLink} href="/foo">bar</Button>;
