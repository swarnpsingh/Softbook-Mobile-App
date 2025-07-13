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

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ route, navigation }: Props) => {
  const { adminProfile, fetchAdminProfile } = useAppContext();
  const { refreshing, onRefresh } = useRefreshControl(fetchAdminProfile);

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
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Customer ID</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile._id : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Subscription</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{adminProfile ? adminProfile.subscription.plan : ''}</Typo>
            </View>
          </View>
          <Button onPress={logout} style={{ marginTop: 20, backgroundColor: "red" }}>
            <Typo size={18} fontWeight="600" color={colors.white}>
              Logout
            </Typo>
          </Button>

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
    marginTop: '40%',
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
});
