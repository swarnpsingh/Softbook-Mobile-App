import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import BackButton from '../components/BackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import TopNav from '../components/TopNav';
import axios from 'axios';
import Card from '../components/Card';
import Card2 from '../components/Card2';
import { getToken } from '../utils/storage';
import { Picker } from '@react-native-picker/picker';
import TopNav2 from '../components/TopNav2';
import { useAppContext } from '../contexts/AppContext';
import { useRefreshControl } from '../utils/common';
import { useColorScheme } from 'react-native';


type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// TOKEN= eBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjUwY2NiOWYwOGE1MDdiNDRmYjA4MCIsImlhdCI6MTc1MTcyMTg5MX0.H00ZOn9_luakIfMMuMToNLUFUGaPBrWrOWNEG8wchYc
const Welcome = ({ navigation }: WelcomeProps) => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {
    adminProfile,
    seats,
    availableRooms,
    availableShifts,
    totalStudents,
    totalIncome,
    loading,
    fetchWelcomeData,
    logout,
  } = useAppContext();

  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const { refreshing, onRefresh } = useRefreshControl(fetchWelcomeData);
  const [hasHandledInactive, setHasHandledInactive] = useState(false);


  useEffect(() => {
    fetchWelcomeData();
  }, []);

  useEffect(() => {
    if (
      adminProfile?.subscription?.active === false &&
      !hasHandledInactive
    ) {
      setHasHandledInactive(true);
      Alert.alert(
        "Subscription Inactive",
        "Your subscription is not active. Please renew to continue.",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              navigation.replace("Login");
              setHasHandledInactive(false); // Reset for next session
            }
          }
        ],
        { cancelable: false }
      );
    }
  }, [adminProfile, logout, navigation, hasHandledInactive]);

  // Set initial room and shift when available
  useEffect(() => {
    if (availableRooms.length > 0 && selectedRoom === '') {
      setSelectedRoom(availableRooms[0]);
    }
    if (availableShifts.length > 0 && selectedShift === '') {
      setSelectedShift(availableShifts[0]);
    }
  }, [availableRooms, availableShifts]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading seat data...</Text>
      </View>
    );
  }

  const filteredSeats = seats.filter(
    (seat: any) => seat.room === selectedRoom && seat.shift === selectedShift,
  );

  const totalSeats = filteredSeats.length;
  const occupied = filteredSeats.filter(
    (s: any) => s.status === 'booked',
  ).length;
  const available = totalSeats - occupied;

  return (
    <ScreenWrapper>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TopNav2
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/typo.png')}
                resizeMode="contain"
                style={styles.logo}
                onError={() => console.log('Image failed to load')}
              />
              {/* Fallback text if image fails to load
              <Typo style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
                SoftBook
              </Typo> */}
            </View>
          }
        />
        <View style={styles.container}>
          {/* <Typo style={styles.statText}>Total Rooms: {roomCount}</Typo>
          <Typo style={styles.statText}>Total Shifts: {shiftCount}</Typo> */}

          {/*Profile Section*/}
          <View style={styles.profileContainer}>
            {/* <Image
              source={require('../assets/swarnPhoto.jpg')}
              style={styles.profileImage}
            /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typo style={styles.profileText} size={24}>
                Hello
              </Typo>
              <Typo style={styles.profileText} size={24} fontWeight={'bold'}>
                {adminProfile?.libraryName}
              </Typo>
            </View>
            <Typo style={{ color: '#989FAB' }}>Welcome to your home.</Typo>
          </View>
        </View>

        {/*Card Section*/}
        <View style={styles.cardContainer}>
          <Card
            style={{ width: '30%' }}
            icon={require('../assets/home-icon.png')}
            tint="#03C7BD"
            number={availableRooms.length || 0}
            label="Total Rooms"
          />
          <Card
            style={{ width: '30%' }}
            icon={require('../assets/Clock.png')}
            tint="#F591B7"
            number={availableShifts.length || 0}
            label="Total Shifts"
          />
          <Card
            style={{ width: '30%' }}
            icon={require('../assets/Data.png')}
            tint="#D6D446"
            number={totalStudents || 0}
            label="Total Students"
          />
          {/* <Card
            style={{ width: '42%' }}  
            icon={require('../assets/income.png')}
            tint="#4BDE80"
            number={`₹${totalIncome || 0}`}
            label="Total Income"
          /> */}
        </View>

        {/* Dropdown Filters */}
        <View style={styles.pickerContainer}>
          <View style={styles.dropdownContainer}>
            <Typo style={styles.pickerLabel}>Room</Typo>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedRoom}
                onValueChange={itemValue => setSelectedRoom(itemValue)}
                style={styles.dropdown}
                dropdownIconColor="white"
              >
                {availableRooms.map(room => (
                  <Picker.Item
                    label={room}
                    value={room}
                    key={room}
                    color={isDarkTheme ? 'white' : 'black'} // Dynamically set text color
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.dropdownContainer}>
            <Typo style={styles.pickerLabel}>Shift</Typo>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedShift}
                onValueChange={itemValue => setSelectedShift(itemValue)}
                style={styles.dropdown}
                dropdownIconColor="white"
              >
                {availableShifts.map(shift => (
                  <Picker.Item
                    label={shift}
                    value={shift}
                    key={shift}
                    color={isDarkTheme ? 'white' : 'black'}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          {filteredSeats.map((seat: any) => (
            <View
              key={seat._id}
              style={[
                styles.seatBox,
                seat.status === 'booked' ? styles.booked : styles.availableSeat,
              ]}
            >
              <Text style={styles.seatText}>{seat.seatNo}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Card2 tint="#03C7BD" number={totalSeats} label="Total Seats" />
          <Card2 tint="#F591B7" number={occupied} label="Occupied" />
          <Card2 tint="#4BDE80" number={available} label="Available" />
          {/* <Card2 tint="#4BDE80" number={`₹${totalIncome || 0}`} label="Total Income" /> */}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
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
    // marginTop: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    margin: 20,
  },
  seatBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  seatText: {
    color: 'white',
    fontWeight: 'bold',
  },
  booked: {
    backgroundColor: '#FF4D4D',
  },
  availableSeat: {
    backgroundColor: '#1C1E2D',
    borderWidth: 1,
    borderColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },
  pickerLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    color: 'white', // Text inside picker
    backgroundColor: '#1C1E2D',
    width: '100%',
  },
  dropdownWrapper: {
    backgroundColor: '#1C1E2D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#777',
    overflow: 'hidden',
    height: 48, // Ensure enough height
    justifyContent: 'center',
  },
});
