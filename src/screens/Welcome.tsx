import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import BackButton from '../components/BackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import TopNav from '../components/TopNav';
import axios from 'axios';
import Card from '../components/Card';
import { getToken } from '../utils/storage';

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// TOKEN= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjUwY2NiOWYwOGE1MDdiNDRmYjA4MCIsImlhdCI6MTc1MTY5OTcxOX0.D_07Y8KGD-GrSB_IYq73peM2SGkGRsLHBHz_wsVj9n8
const Welcome = ({ navigation }: WelcomeProps) => {
  const [roomCount, setRoomCount] = useState<number | null>(null);
  const [shiftCount, setShiftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

    // useEffect(() => {

    //   const fetchData = async () => {
    //     const token = await getToken();
    //     try {
    //       const response = await axios.get(
    //         'http://192.168.0.101:3000/api/v1/seat/allseats',
    //         {
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization:
    //               `Bearer ${token}`,
    //           },
    //         },
    //       );
    //       const seats = response.data.seats;

    //       const roomSet = new Set<string>();
    //       const shiftSet = new Set<string>();

    //       seats.forEach((seat: any) => {
    //         roomSet.add(seat.room);
    //         shiftSet.add(seat.shift);
    //       });
    //       setRoomCount(roomSet.size);
    //       setShiftCount(shiftSet.size);
    //     } catch (error) {
    //       console.error('Error fetching seats:', error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   fetchData();
    // }, []);

    // if (loading) {
    //   return (
    //     <View style={styles.center}>
    //       <ActivityIndicator size="large" color="#007AFF" />
    //       <Text>Loading seat data...</Text>
    //     </View>
    //   );
    // }

  return (
    <ScreenWrapper>
      <TopNav />
      <View style={styles.container}>
        {/* <Typo style={styles.statText}>Total Rooms: {roomCount}</Typo>
        <Typo style={styles.statText}>Total Shifts: {shiftCount}</Typo> */}

        {/*Profile Section*/}
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/swarnPhoto.jpg')}
            style={styles.profileImage}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typo style={styles.profileText} size={24}>
              Hello
            </Typo>
            <Typo style={styles.profileText} size={24} fontWeight={'bold'}>
              Library Name
            </Typo>
          </View>
          <Typo style={{color: '#989FAB'}}>Welcome to your home.</Typo>
        </View>
      </View>

    {/*Card Section*/}
    <View style={styles.cardContainer}>
        <Card icon={require('../assets/home-icon.png')} tint="#03C7BD" number={roomCount || 0} label="Total Rooms" />
        <Card icon={require('../assets/Clock.png')} tint="#F591B7" number={shiftCount || 0} label="Total Shifts" />
        <Card icon={require('../assets/Data.png')} tint="#D6D446" number={72} label="Total Students" />
    </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    marginVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: '50%',
  },
  profileText: {
    marginTop: 10,
    marginLeft: 10,
    color: 'white',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  }

});
