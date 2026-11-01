import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
} from 'react-native';

const GithubItem = ({ id, name, onPress }) => {
  return (
    <View style={styles.itemContainer}>
      <Pressable
        android_ripple={{ color: '#ccc' }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <Image
          source={{
            uri: `https://avatars.githubusercontent.com/u/${id}?v=4`,
          }}
          defaultSource={require('../assets/Profile.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>{name}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 50,
    backgroundColor: '#f9c2ff',
    // padding: 15,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ededed',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    elevation: 4,
  },
  text: {
    fontSize: 15,
    padding: 14,
    paddingTop: 7,
    paddingBottom: 7,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonPressed: {
    opacity: 0.5,
  },
  logo: {
    marginRight: 8,
    marginLeft: 16,
    width: 35,
    height: 35,
  },
});

export default GithubItem;
