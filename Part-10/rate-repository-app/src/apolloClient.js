import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';
import AuthStorage from './utils/authStorage';

const { apolloUri } = Constants.expoConfig.extra;

const authStorage = new AuthStorage();

const httpLink = createHttpLink({
  uri: apolloUri,
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await authStorage.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          repositories: relayStylePagination(),
        },
      },
      Repository: {
        fields: {
          reviews: relayStylePagination(),
        },
      },
    },
  }),
});

export { authStorage };
export default apolloClient;
