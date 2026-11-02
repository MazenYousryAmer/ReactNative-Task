import GithubItem from './GithubItem';
import { StyleSheet, FlatList, View } from 'react-native';

const GithubList = ({ users, onEndReached, navigation }) => {
  function getItem({ item }) {
    function pressHandler() {
      navigation.navigate('Details', { user: item });
    }

    return (
      <GithubItem
        name={item.login}
        id={item.id}
        key={item.id}
        onPress={pressHandler}
      ></GithubItem>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={getItem}
        keyExtractor={(user, index) => (user.id ? user.id : index.toString())}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GithubList;
