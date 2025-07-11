import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import Typo from '../components/Typo';
import axios from 'axios';
import { getToken } from '../utils/storage';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import { colors } from '../constants/theme';
import mime from 'mime';
import { useAppContext } from '../contexts/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

const SeatSelection = ({ route, navigation }: Props) => {
  const { admissionData } = route.params;

  // Use context
  const {
    seats,
    availableRooms,
    availableShifts,
    fetchAllSeats,
    loading,
  } = useAppContext();

  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Fetch seats on mount if not already loaded
  useEffect(() => {
    if (seats.length === 0) {
      fetchAllSeats();
    }
  }, []);

  // Set default room/shift when data loads
  useEffect(() => {
    if (availableRooms.length > 0 && !selectedRoom) {
      setSelectedRoom(availableRooms[0]);
    }
    if (availableShifts.length > 0 && !selectedShift) {
      setSelectedShift(availableShifts[0]);
    }
  }, [availableRooms, availableShifts]);

  const filteredSeats = seats.filter(
    (seat: any) =>
      seat.room === selectedRoom && seat.shift === selectedShift,
  );

  const availableSeats = filteredSeats.filter((s: any) => s.status !== 'booked');

  const handleSubmit = async () => {
    if (!selectedSeat) {
      Alert.alert('Error', 'Please select a seat.');
      return;
    }

    // Validate required fields
    const requiredFields = ['studentName', 'fatherName', 'phone', 'amount', 'duration'];
    const missingFields = requiredFields.filter(field => !admissionData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', `Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
  
    const updatedData = {
      ...admissionData,
      room: selectedRoom,
      shift: selectedShift,
      seatNo: selectedSeat,
    };
  
    console.log('Submitting data:', updatedData);
  
    const formData = new FormData();
  
    Object.entries(updatedData).forEach(([key, value]) => {
      // Only append if value is not null/undefined
      if (value !== null && value !== undefined && key !== 'idUpload' && key !== 'image') {
        formData.append(key, value);
        console.log(`Added to FormData: ${key} = ${value}`);
      }
    });
  
    // Append idUpload (file) if it exists
    if (updatedData.idUpload) {
      const idUploadFile = {
        uri: updatedData.idUpload,
        type: mime.getType(updatedData.idUpload) || 'application/octet-stream',
        name: updatedData.idUpload.split('/').pop() || 'document.pdf',
      };
      formData.append('idUpload', idUploadFile as any);
      console.log('Added ID upload file:', idUploadFile);
    }
  
    // Optional: Append image if it exists
    if (updatedData.image) {
      const imageFile = {
        uri: updatedData.image,
        type: mime.getType(updatedData.image) || 'application/octet-stream',
        name: updatedData.image.split('/').pop() || 'image.jpg',
      };
      formData.append('image', imageFile as any);
      console.log('Added image file:', imageFile);
    }
  console.log(formData)
    try {
      const token = await getToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');
      
      const response = await axios.post(
        'https://softbook-backend.onrender.com/api/v1/students/admission',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
  
      console.log('API Response:', response.data);
      Alert.alert('Success', 'Admission successful');
      navigation.navigate('FinalConfirm', { admissionData: updatedData });
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Please check your input or try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      Alert.alert('Submission Failed', errorMessage);
    }
  };
  

  return (
    <ScreenWrapper>
      <TopNav2 title="Seat Selection" />
      <ScrollView>
        <View style={styles.container}>
          <Typo size={24} fontWeight="bold" style={{ marginBottom: 20 }}>
            Seat Selection
          </Typo>

          {/* Room & Shift Dropdowns */}
          <View style={styles.pickerContainer}>
            <View style={styles.dropdownContainer}>
              <Typo style={styles.pickerLabel}>Room</Typo>
              <View style={styles.dropdownWrapper}>
                <Picker
                  selectedValue={selectedRoom}
                  onValueChange={value => {
                    setSelectedRoom(value);
                    setSelectedSeat(null); // Reset seat when room/shift changes
                  }}
                  style={styles.dropdown}
                  dropdownIconColor="white"
                >
                  {availableRooms.map(room => (
                    <Picker.Item label={room} value={room} key={room} color="white" />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.dropdownContainer}>
              <Typo style={styles.pickerLabel}>Shift</Typo>
              <View style={styles.dropdownWrapper}>
                <Picker
                  selectedValue={selectedShift}
                  onValueChange={value => {
                    setSelectedShift(value);
                    setSelectedSeat(null); // Reset seat when room/shift changes
                  }}
                  style={styles.dropdown}
                  dropdownIconColor="white"
                >
                  {availableShifts.map(shift => (
                    <Picker.Item label={shift} value={shift} key={shift} color="white" />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Seat Grid */}
          <View style={styles.gridContainer}>
            {filteredSeats.map((seat: any) => {
              const isBooked = seat.status === 'booked';
              const isSelected = seat.seatNo === selectedSeat;

              return (
                <TouchableOpacity
                  key={seat._id}
                  disabled={isBooked}
                  style={[
                    styles.seatBox,
                    isBooked
                      ? styles.booked
                      : isSelected
                      ? styles.selectedSeat
                      : styles.availableSeat,
                  ]}
                  onPress={() => setSelectedSeat(seat.seatNo)}
                >
                  <Text style={styles.seatText}>{seat.seatNo}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button onPress={handleSubmit} style={{ marginTop: 20 }}>
            <Typo size={18} fontWeight="600" color={colors.white}>
              Confirm Seat Selection
            </Typo>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SeatSelection;

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  seatBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: 'white',
    borderWidth: 1,
  },
  selectedSeat: {
    backgroundColor: '#4BDE80',
    borderWidth: 2,
    borderColor: 'white',
  },
});
