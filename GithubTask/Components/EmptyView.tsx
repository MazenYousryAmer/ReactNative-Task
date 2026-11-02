import { View, Text, StyleSheet } from 'react-native';

const EmptyView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No search results</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
  },
});

export default EmptyView;
