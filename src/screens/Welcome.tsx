import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView } from 'react-native';
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

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// TOKEN= eBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjUwY2NiOWYwOGE1MDdiNDRmYjA4MCIsImlhdCI6MTc1MTcyMTg5MX0.H00ZOn9_luakIfMMuMToNLUFUGaPBrWrOWNEG8wchYc
const Welcome = ({ navigation }: WelcomeProps) => {
  // Handle case where navigation might not be provided (when used in bottom tabs)
  const handleNavigation = navigation || { replace: () => {} };
  const [roomCount, setRoomCount] = useState<number | null>(null);
  const [shiftCount, setShiftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seats, setSeats] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('A');
  const [selectedShift, setSelectedShift] = useState('morning');

  const [availableRooms, setAvailableRooms] = useState<string[]>([]); // <-- new
  const [availableShifts, setAvailableShifts] = useState<string[]>([]); // <-- new

  const [totalStudents, setTotalStudents] = useState<number>(0);


  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      try {
        const response = await axios.get(
          'http://192.168.0.100:3000/api/v1/seat/allseats',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        
        const seats = response.data.seats;

        const roomSet = new Set<string>();
        const shiftSet = new Set<string>();

        seats.forEach((seat: any) => {
          roomSet.add(seat.room);
          shiftSet.add(seat.shift);
        });
        setAvailableRooms(Array.from(roomSet));
        setAvailableShifts(Array.from(shiftSet));
        setRoomCount(roomSet.size);
        setShiftCount(shiftSet.size);
        setSeats(seats);

        // ✅ Fetch students
    const responseStudents = await axios.get(
        'http://192.168.0.100:3000/api/v1/students/allstudents',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const students = responseStudents.data.students;
      setTotalStudents(students.length); // ✅ Save total students count
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <ScrollView>
        <TopNav2 title="Welcome" />  
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
            <Typo style={{ color: '#989FAB' }}>Welcome to your home.</Typo>
          </View>
        </View>

        {/*Card Section*/}
        <View style={styles.cardContainer}>
          <Card
            icon={require('../assets/home-icon.png')}
            tint="#03C7BD"
            number={roomCount || 0}
            label="Total Rooms"
          />
          <Card
            icon={require('../assets/Clock.png')}
            tint="#F591B7"
            number={shiftCount || 0}
            label="Total Shifts"
          />
          <Card
            icon={require('../assets/Data.png')}
            tint="#D6D446"
            number={totalStudents || 0}
            label="Total Students"
          />
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
                    color="white"
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
                    color="white"
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
          <Card2
            tint="#03C7BD"
            number={totalSeats}
            label="Total Seats"
          />
          <Card2
            tint="#F591B7"
            number={occupied}
            label="Occupied"
          />
          <Card2
            tint="#4BDE80"
            number={available}
            label="Available"
          />
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
