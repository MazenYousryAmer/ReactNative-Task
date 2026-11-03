// module.exports = {
//   preset: '@react-native/jest-preset',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   clearMocks: true,
// };

// module.exports = {
//   preset: 'react-native',
//   // The preset only transforms .js/.ts/.tsx; Components/LoadingView.jsx too.
//   transform: {
//     '^.+\\.jsx$': 'babel-jest',
//   },
//   // React Navigation, react-native-screens, react-native-safe-area-context and
//   // AsyncStorage ship untranspiled ESM/TypeScript, so Jest must transform them.
//   transformIgnorePatterns: [
//     'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
//   ],
// };

module.exports = {
  preset: '@react-native/jest-preset',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'react-native' +
      '|@react-native' +
      '|@react-native-async-storage' +
      '|@react-navigation' +
      '|react-native-screens' +
      '|react-native-safe-area-context' +
      ')/)',
  ],
  setupFilesAfterEach: undefined,
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  clearMocks: true,
};
