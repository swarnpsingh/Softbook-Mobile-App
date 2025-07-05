import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NavigationContainer} from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/Welcome'
import Splash from './screens/Splash'
import Login from './screens/Login'
import BottomTabs from './components/BottomTabs'

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' id={undefined} screenOptions={{headerShown: false}}>
        <Stack.Screen 
          name="Splash" 
          component={Splash} 
        />
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{title: 'Welcome'}}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{title: 'Login'}}
        />
        <Stack.Screen 
          name="Tabs" 
          component={BottomTabs} 
          options={{title: 'Bottom Tabs'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})