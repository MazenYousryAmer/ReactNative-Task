import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';

import UserDetails from '../Models/UserDetails';
import ErrorView from '../Components/ErrorView';
import LoadingView from '../Components/LoadingView';

const Details = ({ route }) => {
  const [userDetailsState, setUserDetails] = useState<UserDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const { id, login, avatar_url } = route.params.user;

  async function fetchGithubUserDetails(username: string) {
    try {
      const response = await fetch(`https://api.github.com/users/${login}`);

      if (!response.ok) {
        setIsError(true);
      }

      const data = (await response.json()) as UserDetails;
      setUserDetails(data);
    } catch (error) {
      setIsError(true);
    }
  }

  useEffect(() => {
    fetchGithubUserDetails(login);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {isError ? <ErrorView /> : null}
      {isLoading ? (
        <LoadingView></LoadingView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>{login}</Text>
          <Image
            source={{
              uri: `https://avatars.githubusercontent.com/u/${id}?v=4`,
            }}
            defaultSource={require('../assets/Profile.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>
            {userDetailsState?.bio ? userDetailsState.bio : 'No bio available'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginVertical: 8,
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  logo: {
    marginVertical: 8,
    width: 100,
    height: 100,
  },
});

export default Details;
