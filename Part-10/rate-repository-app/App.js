import { ApolloProvider } from '@apollo/client';
import { NativeRouter } from 'react-router-native';
import apolloClient from './src/apolloClient';
import Main from './src/components/Main';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );
}
