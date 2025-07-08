// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import Profile from '../screens/Profile'; // assume you have this screen
import { View, Text,Image, StyleSheet } from 'react-native';
import NewAdmission from '../screens/NewAdmission';
import StudentRecord from '../screens/StudentRecord';
import Attendance from '../screens/Attendance';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          backgroundColor: '#0F0E1B',
          borderTopWidth: 0,
          paddingVertical: 10,
          height: 80,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={WelcomeWrapper}
        options={{
          tabBarIcon: ({ color }) => (
            // <Image
            //   source={require('../assets/Compass.png')}
            //   style={[styles.icon, { tintColor: color }]}
            // />
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Admission"
        component={NewAdmissionWrapper}
        options={{
          tabBarIcon: ({ color }) => (
            // <Image
            //   source={require('../assets/User_Add.png')}
            //   style={[styles.icon, { tintColor: color }]}
            // />
            <Ionicons name="person-add-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentRecord}
        options={{
          tabBarIcon: ({ color }) => (
            // <Image
            //   source={require('../assets/File_Search.png')}
            //   style={[styles.icon, { tintColor: color }]}
            // />
            <Ionicons name="cube-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          tabBarIcon: ({ color }) => (
            // <Image
            //   source={require('../assets/User_Check.png')}
            //   style={[styles.icon, { tintColor: color }]}
            // />
            <Ionicons name="people-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            // <Image
            //   source={require('../assets/User_Circle.png')}
            //   style={[styles.icon, { tintColor: color }]}
            // />
            <Ionicons name="person-outline" size={28} color={color} />
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
    resizeMode: 'contain',
  },
});