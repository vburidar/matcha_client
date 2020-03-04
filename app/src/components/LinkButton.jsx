import Link from 'next/link';
import Button from '@material-ui/core/Button';

const LinkButton = ({
  className, href, hrefAs, children, prefetch,
}) => (
  <Link href={href} as={hrefAs} prefetch>
    <a className={className}>
      {children}
    </a>
  </Link>
);

export default LinkButton;
//const RenderButton = () => <Button component={ButtonLink} href="/foo">bar</Button>;
