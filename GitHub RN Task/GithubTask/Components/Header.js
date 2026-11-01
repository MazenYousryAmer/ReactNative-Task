import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ welcomeMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{welcomeMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#89CFF0',
  },
  text: {
    height: 30,
    fontSize: 18,
    color: '#2c3e50',
  },
});

export default Header;
