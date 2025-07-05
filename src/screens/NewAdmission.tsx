import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav from '../components/TopNav';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../constants/theme';

const NewAdmission = () => {
    const [isLoading, setIsLoading] = useState(false);
  return (
    <ScreenWrapper>
      <ScrollView>
        <TopNav />
        <View style={styles.container}>
          <Typo size={24} fontWeight="bold" style={styles.title}>
            New Admission
          </Typo>
          <View style={styles.formContainer}>
            <Typo size={16} fontWeight="bold" style={styles.formTitle}>Student Credentials</Typo>

            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Full Name</Typo>
              <Input placeholder="Swarn Pratap Singh" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Father's Name</Typo>
              <Input placeholder="Mr. Sanjay Kumar Singh" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Street Address</Typo>
              <Input placeholder="Enter your address here" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Permanent Address</Typo>
              <Input placeholder="Enter your address here" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Mobile Number</Typo>
              <Input placeholder="82100XXXXXX" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Duration (months)</Typo>
              <Input placeholder="1" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>ID Proof</Typo>
              <Input placeholder="Aadhar Card/Passport/Driving License" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>ID Upload</Typo>
              <Input placeholder="Add file" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Amount Paid</Typo>
              <Input placeholder="Rs. 500" />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>Payment Method</Typo>
              <Input placeholder="UPI/Bank Transfer/Cash" />
            </View>
            <Button style={styles.button} loading={isLoading}>
                <Typo size={21} fontWeight={'700'} color={colors.black}>
                    Proceed to Seat Selection
                </Typo>
            </Button>
            
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default NewAdmission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title:{
    marginBottom: 15,
  },
  formTitle:{
    marginBottom: 10,
  },
  formContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  formLabel: {
    marginBottom: 5,
  },
  formGroup:{

  },
  button: {
    marginTop: 20,
  }
});
