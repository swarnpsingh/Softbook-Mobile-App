import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/Welcome';
import Splash from './screens/Splash';
import Login from './screens/Login';
import BottomTabs from './components/BottomTabs';
import NewAdmission from './screens/NewAdmission';
import StudentRecord from './screens/StudentRecord';
import SeatSelectin from './screens/SeatSelectin';
import FinalConfirm from './screens/FinalConfirm';
import { getToken } from './utils/storage';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Tabs: undefined;
  NewAdmission: undefined;
  SeatSelection: { admissionData: any };
  FinalConfirm: { admissionData: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Tabs'>('Login');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setInitialRoute(token ? 'Tabs' : 'Login');
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) return <Splash navigation={{ navigate: () => {} } as any} route={{} as any} />; // Show splash until auth check is done

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="NewAdmission" component={NewAdmission} />
        <Stack.Screen name="SeatSelection" component={SeatSelectin} />
        <Stack.Screen name="FinalConfirm" component={FinalConfirm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
