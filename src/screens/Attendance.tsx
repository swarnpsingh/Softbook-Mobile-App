import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { getToken } from '../utils/storage';
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AttendanceRecord {
  _id: string;
  student: {
    studentName: string;
    room: string;
    shift: string;
    seatNo: string;
    phone: string;
  };
  date: string;
}

const Attendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async (date: Date) => {
    setLoading(true);
    const token = await getToken();
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await axios.get(
        `http://192.168.0.100:3000/api/v1/attendance/admin?date=${formattedDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendance(response.data.attendance);
      setFilteredAttendance(response.data.attendance);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAttendance(attendance);
    } else {
      const filtered = attendance.filter(record => 
        (record.student?.studentName || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAttendance(filtered);
    }
  }, [searchQuery, attendance]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <ScreenWrapper>
      <TopNav2 title="Attendance" />
      <View style={styles.headerContainer}>
        <Typo size={24} fontWeight="bold">Attendance Records</Typo>
      </View>

      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search student..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        
        <View style={styles.dateContainer}>
          <Typo size={16} style={styles.dateText}>
            {moment(selectedDate).format('DD/MM/YYYY')}
          </Typo>
          <Text 
            style={styles.datePickerText}
            onPress={() => setShowDatePicker(true)}
          >
            Change Date
          </Text>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <Typo style={styles.loadingText}>Loading...</Typo>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={styles.cell}>Sl. No.</Text>
              <Text style={styles.cell}>Name</Text>
              <Text style={styles.cell}>Room</Text>
              <Text style={styles.cell}>Shift</Text>
              <Text style={styles.cell}>Seat</Text>
              <Text style={styles.cell}>Phone</Text>
            </View>

            {/* Table Rows */}
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record, index) => (
                <View style={styles.row} key={record._id}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>
                    {record.student?.studentName || 'Unknown'}
                  </Text>
                  <Text style={styles.cell}>{record.student?.room || '-'}</Text>
                  <Text style={styles.cell}>{record.student?.shift || '-'}</Text>
                  <Text style={styles.cell}>{record.student?.seatNo || '-'}</Text>
                  <Text style={styles.cell}>{record.student?.phone || '-'}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noRecordsContainer}>
                <Typo style={styles.noRecordsText}>
                  No attendance records found
                </Typo>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#1C1E2D',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginRight: 10,
  },
  datePickerText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  tableContainer: {
    minWidth: 700,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerRow: {
    backgroundColor: '#1C1E2D',
  },
  cell: {
    width: 100,
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  noRecordsContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#999',
  },
});

export default Attendance;