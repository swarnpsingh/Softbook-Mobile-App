import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav from '../components/TopNav';
import { getToken } from '../utils/storage';
import axios from 'axios';
import moment from 'moment';

const StudentRecord = () => {
  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    const token = await getToken();
    try {
      const responseStudents = await axios.get(
        'http://192.168.0.101:3000/api/v1/students/allstudents',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(responseStudents.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <TopNav />
      <View style={styles.headerContainer}>
        <Typo size={24} fontWeight="bold">Student Record</Typo>
      </View>

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
          {students.map((student: any, index: number) => {
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
          })}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default StudentRecord;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    // alignItems: 'center',
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
});
