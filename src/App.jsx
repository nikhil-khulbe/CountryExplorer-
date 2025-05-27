import {View, Text} from 'react-native';
import React from 'react';
import Home from './pages/Home';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './navigation/StackNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
