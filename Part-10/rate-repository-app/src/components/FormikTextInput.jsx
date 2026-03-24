import { TextInput, StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  errorText: {
    color: '#d73a4a',
    marginTop: 4,
    fontSize: theme.fontSizes.body,
  },
});

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const showError = meta.touched && meta.error;

  return (
    <View>
      <TextInput
        style={[styles.input, showError && styles.inputError]}
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </View>
  );
};

export default FormikTextInput;
