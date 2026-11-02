import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserModel from '../Models/UserModel';
import GithubList from '../Components/GithubList';
import LoadingView from '../Components/LoadingView';
import SearchInput from '../Components/SearchInput';
import EmptyView from '../Components/EmptyView';

const Home = ({ navigation }) => {
  const [users, setUsers] = useState<UserModel>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchButtonClicked, setSearchButtonClicked] =
    useState<boolean>(false);

  async function persistData() {
    try {
      const usersToString = JSON.stringify(users);
      const pageNumberToString = JSON.stringify(pageNumber);
      await AsyncStorage.setItem('searchQuery', query);
      await AsyncStorage.setItem('users', usersToString);
      await AsyncStorage.setItem('pageNumber', pageNumberToString);

      setSearchButtonClicked(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async function retreiveDataFromCache() {
    try {
      const searchQuery = await AsyncStorage.getItem('searchQuery');
      const value = await AsyncStorage.getItem('users');
      const pageNumberString = await AsyncStorage.getItem('pageNumber');
      if (value && searchQuery && pageNumberString) {
        setSearchString(searchQuery);
        setQuery(searchQuery);

        const convertedUser = JSON.parse(value);
        setUsers(convertedUser);
        const page = +pageNumberString;
        setPageNumber(page);
      }
      return null; // Key does not exist
    } catch (error) {
      console.error('Error retreiving data:', error);
    }
  }

  async function fetchGithubUser() {
    setIsError(false);
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodedQuery}&page=${pageNumber}&per_page=20`,
      );

      if (!response.ok) {
        setIsError(true);
      }

      const data = (await response.json()) as UserModel;
      console.log(data);
      if (pageNumber === 1) {
        setUsers(data);
      } else {
        appendUsers(data);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    retreiveDataFromCache();
  }, []);

  useEffect(() => {
    if (query !== '' && searchButtonClicked) {
      fetchGithubUser();
    }

    // setIsLoading(false);
  }, [query, pageNumber, isLoading]);

  useEffect(() => {
    users && persistData();
  }, [JSON.stringify(users)]);

  function inputChange(inputValue: string) {
    setSearchString(inputValue);
  }

  function onSearchPress() {
    setQuery(searchString);
    setPageNumber(1);
    setIsLoading(true);
    setSearchButtonClicked(true);
  }

  function loadNextPage() {
    setSearchButtonClicked(true);
    setPageNumber(pageNumber + 1);
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
      {(!users || (users?.items?.length ?? 0) === 0) && !isLoading ? (
        <EmptyView />
      ) : null}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingView></LoadingView>
        </View>
      ) : (
        <GithubList
          users={users?.items}
          navigation={navigation}
          onEndReached={loadNextPage}
        ></GithubList>
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
  },
  header: {
    height: 80,
  },
  list: {
    flex: 1,
  },
});

export default Home;
