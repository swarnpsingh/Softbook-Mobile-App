import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import Typo from '../components/Typo';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import { colors } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { removeToken } from '../utils/storage';
import { useRefreshControl } from '../utils/common';
import moment from 'moment';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

// Add Payment interface for local typing
interface Payment {
  amount: number | string;
  paymentDate: string;
}

const Profile = ({ route, navigation }: Props) => {
  const { adminProfile, fetchAdminProfile, paymentData } = useAppContext();
  const { refreshing, onRefresh } = useRefreshControl(fetchAdminProfile);

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const calculateOneMonthIncome = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    let total = 0;
    (paymentData as Payment[]).forEach((payment) => {
      const paymentDate = payment?.paymentDate ? new Date(payment.paymentDate) : null;
      if (paymentDate && paymentDate >= startDate && paymentDate <= today) {
        total += Number(payment.amount) || 0;
      }
    });
    setIncome(total);
  };

  const calculateTotalIncome = () => {
    let total = 0;
    (paymentData as Payment[]).forEach((payment) => {
      total += Number(payment.amount) || 0;
    });
    setTotalIncome(total);
  };

  useEffect(() => {
    calculateTotalIncome();
    calculateOneMonthIncome();
    console.log(paymentData);
  }, [paymentData]);

  const logout = async () => {
    await removeToken();
    navigation.navigate('Login');
  };

  useEffect(() => {
    if (!adminProfile) fetchAdminProfile();
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TopNav2 title="Profile" />
        <View style={styles.container}>
          <View style={{ gap: 5, marginTop: '20%' }}>
            <Typo size={30} fontWeight={'800'}>
              Hey,
            </Typo>
            <Typo size={30} fontWeight={'800'}>
              {adminProfile ? adminProfile.name : ''}
            </Typo>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Library Name</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile.libraryName : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Email ID</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile.email : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Phone Number</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile.phone : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Address</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile?.libraryAddress ? adminProfile.libraryAddress : 'Patna, Bihar, India'}</Typo>
            </View>
          </View>
          {/* <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Customer ID</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile._id : ''}</Typo>
            </View>
          </View> */}
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Subscription</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile.subscription.plan : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Expires At</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'800'} color='#FF4D4D'>{moment(adminProfile ? adminProfile.subscription.expiresAt : '').format('DD/MM/YYYY')}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Total Monthly Income</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'800'} color='#56d91e'>{"₹" + income}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Total Income</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'800'} color='#56d91e'>{"₹" + totalIncome}</Typo>
            </View>
          </View>

          <View style={styles.contactInfoContainer}>
            <Typo size={24} fontWeight={'600'}>Customer Support</Typo>
            <View style={styles.profileContainer}>
              <View>
                <Typo size={16} fontWeight={'400'}>Email us at</Typo>
              </View>
              <View>
                <Typo size={16} fontWeight={'400'}>customersupport@softbook.co.in</Typo>
              </View>
            </View>
            <View style={styles.profileContainer}>
              <View>
                <Typo size={16} fontWeight={'400'}>Phone (emegency only)</Typo>
              </View>
              <View>
                <Typo size={16} fontWeight={'400'}>(+91) 76672 61255</Typo>
              </View>
            </View>
          </View>
          <Button onPress={logout} style={{ marginTop: 30, backgroundColor: "#FF4D4D" }}>
            <Typo size={18} fontWeight="600" color={colors.white}>
              Logout
            </Typo>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  contactInfoContainer: {
    marginTop: '20%',
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
});
