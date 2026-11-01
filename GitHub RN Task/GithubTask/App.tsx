// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GithubItem from './Components/GithubItem';
import GithubList from './Components/GithubList';
import Header from './Components/Header';
import Home from './Screens/Home';
import Details from './Screens/Details';

// const user = { id: 0, name: 'Mazen' };
// const users = [
//   { id: 0, name: 'Mazen' },
//   { id: 1, name: 'Yousry' },
//   { id: 2, name: 'Amer' },
//   { id: 4, name: 'test' },
// ];

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // <GithubList users={users}></GithubList>
    // <SafeAreaProvider style={styles.container}>
    // <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
      {/* <Header welcomeMessage={'Github React Native task'}></Header> */}
      {/* <AppContent /> */}
      {/* <GithubItem user={user} /> */}
      {/* <GithubList users={users}></GithubList> */}
      {/* <Home></Home> */}
    </NavigationContainer>
    // </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

// import React from 'react';
// import {
//   SafeAreaView,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
// } from 'react-native';
// import Header from './header';

// // 1. Define your data shape & array
// interface ItemData {
//   id: string;
//   title: string;
// }

// const DATA: ItemData[] = [
//   { id: '1', title: 'First Item' },
//   { id: '2', title: 'Second Item' },
//   { id: '3', title: 'Third Item' },
// ];

// export default function App() {
//   function press() {
//     console.log('here');
//   }
//   // 2. Define how each item looks
//   const renderItem = ({ item }: { item: ItemData }) => (
//     <View style={styles.item}>
//       <Pressable onPress={press}>
//         <Text style={styles.title}>{item.title}</Text>
//       </Pressable>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header welcomeMessage={'Github React Native task'}></Header>
//       <FlatList
//         data={DATA}
//         renderItem={renderItem}
//         keyExtractor={item => item.id} // 3. Provide unique keys for stability
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   item: {
//     backgroundColor: '#f9c2ff',
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 24,
//   },
// });
