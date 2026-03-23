import { Text as RNText, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
  },
  colorPrimary: { color: theme.colors.primary },
  colorSecondary: { color: theme.colors.textSecondary },
  fontSizeSubheading: { fontSize: theme.fontSizes.subheading },
  fontWeightBold: { fontWeight: theme.fontWeights.bold },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.base,
    color === 'primary' && styles.colorPrimary,
    color === 'secondary' && styles.colorSecondary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <RNText style={textStyle} {...props} />;
};

export default Text;
