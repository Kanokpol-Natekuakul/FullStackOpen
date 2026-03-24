import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useParams, useNavigate } from 'react-router-native';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import * as Linking from 'expo-linking';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import theme from '../theme';
import { GET_REPOSITORY } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 14,
    margin: 15,
    marginTop: 0,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
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
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    marginBottom: 4,
  },
  username: {
    fontWeight: theme.fontWeights.bold,
    marginBottom: 2,
  },
  date: {
    color: theme.colors.textSecondary,
  },
  reviewText: {
    marginTop: 4,
  },
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
  viewButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: '#d73a4a',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryInfo = ({ repository, showGitHubButton }) => (
  <View>
    <RepositoryItem item={repository} />
    {showGitHubButton && repository.url && (
      <Pressable style={styles.button} onPress={() => Linking.openURL(repository.url)}>
        <Text style={styles.buttonText}>Open in GitHub</Text>
      </Pressable>
    )}
  </View>
);

const ReviewItem = ({ review, showActions, onDelete, onViewRepository }) => (
  <View>
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.username}>{review.user.username}</Text>
          <Text style={styles.date}>{format(new Date(review.createdAt), 'dd.MM.yyyy')}</Text>
        </View>
        <Text style={styles.reviewText}>{review.text}</Text>
      </View>
    </View>
    {showActions && (
      <View style={styles.actionButtons}>
        <Pressable style={[styles.actionButton, styles.viewButton]} onPress={onViewRepository}>
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    )}
  </View>
);

const SingleRepository = ({ showActions = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });
  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading || !data) return null;

  const repository = data.repository;
  const reviews = repository.reviews.edges.map((edge) => edge.node);

  const handleDelete = (reviewId) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteReview({ variables: { id: reviewId } });
            refetch();
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          showActions={showActions}
          onDelete={() => handleDelete(item.id)}
          onViewRepository={() => navigate(`/repository/${item.repositoryId}`)}
        />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} showGitHubButton={!showActions} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default SingleRepository;
