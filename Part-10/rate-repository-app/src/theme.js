import { Platform } from 'react-native';

const theme = {
  colors: {
    primary: '#0366d6',
    appBar: '#24292e',
    mainBackground: '#e1e4e8',
    white: '#ffffff',
    textPrimary: '#24292e',
    textSecondary: '#586069',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
