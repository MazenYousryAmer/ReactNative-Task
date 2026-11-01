import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import UserModel from '../Models/UserModel';
import GithubList from '../Components/GithubList';
import ErrorView from '../Components/ErrorView';
import LoadingView from '../Components/LoadingView';
import SearchInput from '../Components/SearchInput';
import EmptyView from '../Components/EmptyView';

// const usersTest = [
//   { id: 0, name: 'Mazen' },
//   { id: 1, name: 'Yousry' },
//   { id: 2, name: 'Amer' },
//   { id: 4, name: 'test' },
// ];

const Home = ({ navigation }) => {
  const [users, setUsers] = useState<UserModel>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  async function fetchGithubUser() {
    if (!query) return;
    // inputChange(username);
    setIsError(false);
    setIsLoading(true);
    try {
      // const response = await fetch(`https://api.github.com/users/${username}`);
      const response = await fetch(
        // `https://api.github.com/search/users?q=${username}&page=1`,
        `https://api.github.com/search/users?q=${query}&page=${pageNumber}`,
      );
      setIsLoading(false);

      if (!response.ok) {
        // throw new Error(`User not found (Status: ${response.status})`);
        setIsError(true);
        // console.error('Error fetching data:', error.message);
      }

      const data = (await response.json()) as UserModel;
      console.log(data);
      // setTimeout(() => {
      if (pageNumber === 1) {
        setUsers(data);
      } else {
        appendUsers(data);
      }
      // }, 10000);
    } catch (error) {
      setIsError(true);
      // console.error('Error fetching data:', error.message);
    }
  }

  useEffect(() => {
    fetchGithubUser();
    setIsLoading(false);
  }, [query, pageNumber, isLoading]);

  function inputChange(inputValue: string) {
    setSearchString(inputValue);
  }

  function onSearchPress() {
    setQuery(searchString);
    setPageNumber(1);
    const allUsers = {
      total_count: 0,
      items: [],
      incomplete_results: false,
    };
    setUsers(allUsers);
    // fetchGithubUser();
  }

  function loadNextPage() {
    setPageNumber(pageNumber + 1);
    // fetchGithubUser();
  }

  function appendUsers(data: UserModel) {
    const allUsers = {
      total_count: users?.total_count ?? 0,
      items: [...(users?.items ?? []), ...data.items],
      incomplete_results: users?.incomplete_results ?? false,
    };
    setUsers(allUsers);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          query={searchString}
          onPress={onSearchPress}
          inputChange={(text: string) => inputChange(text)}
        />
      </View>

      {/* <Header welcomeMessage={'Github React Native task'}></Header> */}
      {!users || (users?.items?.length ?? 0) === 0 ? <EmptyView /> : null}
      {isError ? <ErrorView /> : null}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingView></LoadingView>
        </View>
      ) : (
        // <View style={styles.innerContainer}>
        <GithubList
          //style={styles.list}
          users={users?.items}
          navigation={navigation}
          onEndReached={loadNextPage}
        ></GithubList>
        // </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    height: 90,
  },
  loadingContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    height: 200,
    width: 200,
  },
  header: {
    height: 80,
  },
  list: {
    flex: 1,
  },
});

export default Home;

// elastic search
// tries
// useQuery for request caching
