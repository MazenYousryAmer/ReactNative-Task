import React from 'react';
import { TextInput, View, StyleSheet, Pressable, Text } from 'react-native';

const SearchInput = ({ query, inputChange, onPress }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={query}
        onChangeText={inputChange}
      ></TextInput>
      <Pressable
        android_ripple={{ color: '#ccc' }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <Text style={styles.searchText}>Search</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    height: 80,
    backgroundColor: '#aaaaaa',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
  },
  button: {
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonPressed: {
    opacity: 0.5,
  },
  searchText: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SearchInput;
