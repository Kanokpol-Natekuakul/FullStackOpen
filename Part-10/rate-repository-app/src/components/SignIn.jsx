import { Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.colors.white,
  },
  field: {
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
});

const initialValues = {
  username: '',
  password: '',
};

const SignInForm = ({ onSubmit }) => (
  <View style={styles.container}>
    <View style={styles.field}>
      <FormikTextInput name="username" placeholder="Username" />
    </View>
    <View style={styles.field}>
      <FormikTextInput name="password" placeholder="Password" secureTextEntry />
    </View>
    <Pressable style={styles.submitButton} onPress={onSubmit}>
      <Text style={styles.submitButtonText}>Sign in</Text>
    </Pressable>
  </View>
);

const SignIn = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

export default SignIn;
