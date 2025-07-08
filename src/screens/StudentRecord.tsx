import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { getToken } from '../utils/storage';
import axios from 'axios';
import moment from 'moment';

type Student = {
  _id: string;
  studentName: string;
  room: string;
  shift: string;
  seatNo: string;
  phone: string;
  dueDate: string;
};

const StudentRecord = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const token = await getToken();
    try {
      const responseStudents = await axios.get(
        'http://192.168.0.100:3000/api/v1/students/allstudents',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(responseStudents.data.students);
      setFilteredStudents(responseStudents.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchData();
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
              filteredStudents.map((student: any, index: number) => {
                const dueDate = moment(student.dueDate).add(1, 'month');
                const { style: rowStyle, tag } = getRowStyle(student.dueDate);

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