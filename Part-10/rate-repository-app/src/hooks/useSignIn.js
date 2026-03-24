import { useMutation, useApolloClient } from '@apollo/client';
import { useContext } from 'react';
import { AUTHENTICATE } from '../graphql/mutations';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const apolloClient = useApolloClient();
  const authStorage = useContext(AuthStorageContext);

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({
      variables: {
        credentials: { username, password },
      },
    });
    await authStorage.setAccessToken(data.authenticate.accessToken);
    apolloClient.resetStore();
    return { data };
  };

  return [signIn, result];
};

export default useSignIn;
