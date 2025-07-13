import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, RefreshControl } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { useAppContext } from '../contexts/AppContext';
import moment from 'moment';
import { useRefreshControl } from '../utils/common';

const StudentRecord = () => {
  const { students, fetchStudents, loading } = useAppContext();
  const [filteredStudents, setFilteredStudents] = useState<typeof students>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { refreshing, onRefresh } = useRefreshControl(fetchStudents);

  useEffect(() => {
    if (students.length === 0) fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        (student.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.phone || '').toString().includes(searchQuery) ||
        (student.room || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.seatNo || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const getRowStyle = (dueDate: string) => {
    const today = moment();
    const due = moment(dueDate);
    const daysLeft = due.diff(today, 'days');

    if (daysLeft <= 3) {
      return { style: styles.dangerRow, tag: 'danger' };
    } else if (daysLeft <= 7) {
      return { style: styles.warningRow, tag: 'warning' };
    } else {
      return { style: {}, tag: '' };
    }
  };

  return (
    <ScreenWrapper>
      <TopNav2 title="Student Record" />
      <View style={styles.headerContainer}>
        <Typo size={24} fontWeight="bold">Student Record</Typo>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

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
                <Text style={styles.cell}>Due Date</Text>
              </View>

              {/* Table Rows */}
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const dueDate = moment(student.dueDate).add(1, 'month');
                  const { style: rowStyle } = getRowStyle(student.dueDate);

                  return (
                    <View style={[styles.row, rowStyle]} key={student._id}>
                      <Text style={styles.cell}>{index + 1}</Text>
                      <Text style={styles.cell}>{student.studentName}</Text>
                      <Text style={styles.cell}>{student.room}</Text>
                      <Text style={styles.cell}>{student.shift}</Text>
                      <Text style={styles.cell}>{student.seatNo}</Text>
                      <Text style={styles.cell}>{student.phone}</Text>
                      <Text style={styles.cell}>{moment(student.dueDate).format('DD/MM/YYYY')}</Text>
                    </View>
                  );
                })
              ) : (
                <View style={styles.noRecordsContainer}>
                  <Typo style={styles.noRecordsText}>
                    No students found matching your search
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

export default StudentRecord;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
  },
  searchInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#1C1E2D',
  },
  tableContainer: {
    minWidth: 700,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
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
  dangerRow: {
    backgroundColor: '#FF4D4D30', // semi-transparent red
  },
  warningRow: {
    backgroundColor: '#FFA50030', // semi-transparent orange
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