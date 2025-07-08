import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import Typo from '../components/Typo';
import axios from 'axios';
import { getToken } from '../utils/storage';

type Profile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  libraryName: string;
  address: string;
};

const Profile = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(
        'http://192.168.0.100:3000/api/v1/admin/profile',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUserProfile(response.data.admin);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView>
        <TopNav2 title="Profile" />
        <View style={styles.container}>
          <View style={{ gap: 5, marginTop: '20%' }}>
            <Typo size={30} fontWeight={'800'}>
              Hey,
            </Typo>
            <Typo size={30} fontWeight={'800'}>
              {userProfile ? userProfile.name : ''}
            </Typo>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Library Name</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{userProfile ? userProfile.libraryName : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Email ID</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{userProfile ? userProfile.email : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Phone Number</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{userProfile ? userProfile.phone : ''}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Address</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{userProfile?.address ? userProfile.address : 'Patna, Bihar, India'}</Typo>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View>
              <Typo size={16} fontWeight={'600'}>Customer ID</Typo>
            </View>
            <View>
              <Typo size={16} fontWeight={'400'}>{userProfile ? userProfile._id : ''}</Typo>
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
