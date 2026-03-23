import { View, Text, Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    flexDirection: 'row',
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

const AppBarTab = ({ label, onPress }) => (
  <Pressable style={styles.tab} onPress={onPress}>
    <Text style={styles.tabText}>{label}</Text>
  </Pressable>
);

const AppBar = () => {
  return (
    <View style={styles.container}>
      <AppBarTab label="Repositories" />
    </View>
  );
};

export default AppBar;
