import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.colors.white,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fullName: {
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.body,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  languageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.body,
    marginTop: 2,
  },
});

const formatCount = (count) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};

const RepositoryStats = ({ item }) => (
  <View style={styles.statsRow}>
    <View style={styles.stat}>
      <Text style={styles.statValue}>{formatCount(item.stargazersCount)}</Text>
      <Text style={styles.statLabel}>Stars</Text>
    </View>
    <View style={styles.stat}>
      <Text style={styles.statValue}>{formatCount(item.forksCount)}</Text>
      <Text style={styles.statLabel}>Forks</Text>
    </View>
    <View style={styles.stat}>
      <Text style={styles.statValue}>{item.ratingAverage}</Text>
      <Text style={styles.statLabel}>Rating</Text>
    </View>
    <View style={styles.stat}>
      <Text style={styles.statValue}>{item.reviewCount}</Text>
      <Text style={styles.statLabel}>Reviews</Text>
    </View>
  </View>
);

const RepositoryItem = ({ item }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.topRow}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.info}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.languageBadge}>{item.language}</Text>
        </View>
      </View>
      <RepositoryStats item={item} />
    </View>
  );
};

export default RepositoryItem;
