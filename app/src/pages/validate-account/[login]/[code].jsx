import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { ApiContext, createApiRequester } from '../../../stores/Api';
import redirectTo from '../../../initialServices/initialServices';

function ValidateAccountPage() {
  const router = useRouter();
  const { validateAccount } = useContext(ApiContext);
  const { login, code } = router.query;

  useEffect(() => {
    async function setupValidation() {
      if (login !== undefined && code !== undefined) {
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

ValidateAccountPage.getInitialProps = async ({ req, res }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === true && res) {
    redirectTo('/', req, res);
  }
  return {};
};

export default ValidateAccountPage;
