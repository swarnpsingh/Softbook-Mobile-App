import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, RefreshControl } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { useAppContext } from '../contexts/AppContext';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRefreshControl } from '../utils/common';

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
  const { attendance, fetchAttendance, loading } = useAppContext();
  const [filteredAttendance, setFilteredAttendance] = useState<typeof attendance>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { refreshing, onRefresh } = useRefreshControl(() => fetchAttendance(selectedDate));

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
        <ScrollView 
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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