// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import Profile from '../screens/Profile'; // assume you have this screen
import { View, Text,Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // optional
import NewAdmission from '../screens/NewAdmission';
import StudentRecord from '../screens/StudentRecord';
import Attendance from '../screens/Attendance';

// Wrapper components to handle missing navigation props
const WelcomeWrapper = (props: any) => <Welcome {...props} />;
const NewAdmissionWrapper = (props: any) => <NewAdmission {...props} />;

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1E2D',
          borderTopWidth: 0,
          paddingVertical: 10,
        },
      }}
    >
      <Tab.Screen
        name="Welcome"
        component={WelcomeWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/Compass.png')}
              style={{ width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewAdmission"
        component={NewAdmissionWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/User_Add.png')}
              style={{ width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Student Record"
        component={StudentRecord}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/File_Search.png')}
              style={{ width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/User_Check.png')}
              style={{ width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
    marginBottom: 10,
    // tintColor: '#03C7BD',
  },
});