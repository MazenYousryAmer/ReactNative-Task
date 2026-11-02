import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingView = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF"></ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default LoadingView;
