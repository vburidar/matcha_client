import React, { useContext, useEffect } from 'react';
import { contextTest } from '../contextTest';

const ExampleComponent = () => {
  const globalState = useContext(contextTest);
  const { dispatch } = globalState;
  console.log(globalState);

  useEffect(() => {
    //dispatch({ type: 'init_store' });
  }, []);

  return (
    null
  );
};

export default ExampleComponent;
