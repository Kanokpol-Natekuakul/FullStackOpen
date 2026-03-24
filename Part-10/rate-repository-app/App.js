import { ApolloProvider } from '@apollo/client';
import { NativeRouter } from 'react-router-native';
import apolloClient, { authStorage } from './src/apolloClient';
import AuthStorageContext from './src/contexts/AuthStorageContext';
import Main from './src/components/Main';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <NativeRouter>
        <AuthStorageContext.Provider value={authStorage}>
          <Main />
        </AuthStorageContext.Provider>
      </NativeRouter>
    </ApolloProvider>
  );
}
