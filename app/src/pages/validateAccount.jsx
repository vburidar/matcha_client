import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { ApiContext } from '../api/Api';

function HomePage() {
  const router = useRouter();
  const { validateAccount } = useContext(ApiContext);
  const [login, setLogin] = useState(router.query.login);
  const [code, setCode] = useState(router.query.code);

  useEffect(() => {
    console.log('in useEffect');
    async function setupValidation() {
      if (router.query.login !== undefined && router.query.code !== undefined) {
        setLogin(router.query.login);
        setCode(router.query.code);
        await validateAccount({
          login,
          code,
        });
        console.log('ready to push to signin');
        router.push('/signin');
      }
    }
    setupValidation();
  }, []);

  return (
    <div>
      <h1>Subscription validation</h1>
      <div><p /></div>
    </div>
  );
}

export default HomePage;
