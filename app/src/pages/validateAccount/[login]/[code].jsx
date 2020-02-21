import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { ApiContext, createApiRequester } from '../../../api/Api';
import redirectTo from '../../../initialServices/initialServices';

function ValidateAccountPage() {
  const router = useRouter();
  const { validateAccount } = useContext(ApiContext);
  const [login, setLogin] = useState(router.query.login);
  const [code, setCode] = useState(router.query.code);

  useEffect(() => {
    async function setupValidation() {
      if (router.query.login !== undefined && router.query.code !== undefined) {
        setLogin(router.query.login);
        setCode(router.query.code);
        await validateAccount({
          login,
          code,
        });
        router.push('/signin');
      }
    }
    setupValidation();
  }, []);

  return (null);
}

ValidateAccountPage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === true && res) {
    redirectTo('/', req, res);
  }
  return (data);
};

export default ValidateAccountPage;
