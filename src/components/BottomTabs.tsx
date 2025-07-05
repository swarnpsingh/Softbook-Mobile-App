// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import Profile from '../screens/Profile'; // assume you have this screen
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // optional
import NewAdmission from '../screens/NewAdmission';
import StudentRecord from '../screens/StudentRecord';
import Attendance from '../screens/Attendance';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#03C7BD',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1E2D',
          borderTopWidth: 0,
          paddingVertical: 5,
        },
      }}
    >
      <Tab.Screen
        name="Welcome"
        component={(props: any) => <Welcome {...props} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="New Admission"
        component={NewAdmission}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-add-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Student Record"
        component={StudentRecord}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
