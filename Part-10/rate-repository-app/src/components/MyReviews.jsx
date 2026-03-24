import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { format } from 'date-fns';
import Text from './Text';
import theme from '../theme';
import { ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  separator: { height: 10 },
  reviewContainer: {
    backgroundColor: theme.colors.white,
    padding: 15,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  reviewContent: { flex: 1 },
  repoName: { fontWeight: theme.fontWeights.bold, marginBottom: 2 },
  date: { color: theme.colors.textSecondary },
  reviewText: { marginTop: 4 },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 0,
    backgroundColor: theme.colors.white,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  viewButton: { backgroundColor: theme.colors.primary },
  deleteButton: { backgroundColor: '#d73a4a' },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.body,
  },
});

const MyReviews = () => {
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const { data, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  if (!data?.me) return null;

  const reviews = data.me.reviews?.edges?.map((e) => e.node) ?? [];

  const handleDelete = (id) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteReview({ variables: { id } });
            refetch();
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <View>
          <View style={styles.reviewContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.repoName}>{item.repository.fullName}</Text>
              <Text style={styles.date}>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</Text>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => navigate(`/repository/${item.repositoryId}`)}
            >
              <Text style={styles.buttonText}>View repository</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Delete review</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
};

export default MyReviews;
