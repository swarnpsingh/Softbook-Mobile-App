import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';

const Attendance = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Typo size={24} fontWeight="bold">Attendance</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 