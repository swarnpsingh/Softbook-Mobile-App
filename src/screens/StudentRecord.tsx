import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';

const StudentRecord = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Typo size={24} fontWeight="bold">Student Record</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default StudentRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 