import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client';
import { useContext } from 'react';
import Text from './Text';
import theme from '../theme';
import { ME } from '../graphql/queries';
import AuthStorageContext from '../contexts/AuthStorageContext';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
  },
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  tabText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
});

const AppBarTab = ({ label, to, onPress }) => (
  <Link to={to} component={Pressable} style={styles.tab} onPress={onPress}>
    <Text style={styles.tabText}>{label}</Text>
  </Link>
);

const AppBar = () => {
  const { data } = useQuery(ME, { fetchPolicy: 'cache-and-network' });
  const apolloClient = useApolloClient();
  const authStorage = useContext(AuthStorageContext);

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  const isSignedIn = Boolean(data?.me);

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        <AppBarTab label="Repositories" to="/" />
        {isSignedIn
          ? <AppBarTab label="Sign out" to="/" onPress={signOut} />
          : <AppBarTab label="Sign in" to="/sign-in" />
        }
      </ScrollView>
    </View>
  );
};

export default AppBar;
