import { View, Text, StyleSheet } from 'react-native';

const EmptyView = () => {
  return (
    <View style={styles.copntainer}>
      <Text style={styles.text}>No search resuts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  copntainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
  },
});

export default EmptyView;
