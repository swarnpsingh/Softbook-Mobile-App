import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav from '../components/TopNav';
import TopNav2 from '../components/TopNav2';
import Typo from '../components/Typo';
import Button from '../components/Button';
import { colors } from '../constants/theme';
import { pickPDF } from '../utils/documentPicker';
import { generatePDF } from '../utils/generatePDF';
import reactNativeHTMLToPdf from 'react-native-html-to-pdf';
import { PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import { getToken } from '../utils/storage';
import axios from 'axios';
import moment from 'moment';


type FinalConfirmProps = NativeStackScreenProps<RootStackParamList, 'FinalConfirm'>;

const FinalConfirm = ({ route }: FinalConfirmProps) => {
  // const { admissionData } = route.params;
  const [latestStudent, setLatestStudent] = useState<any>(null);

  const fetchData = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(
        'http://192.168.0.100:3000/api/v1/students/allstudents',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const allStudents = response.data.students;
      const mostRecent = allStudents[allStudents.length - 1]; // change logic if needed
      setLatestStudent(mostRecent);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePDF = async () => {
  
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
          .header { text-align: center; }
          .header h1 { color: #539486; margin: 0; }
          .header h3 { color: #539486; margin: 0; font-size: 14px; }
          .section-title { color: #539486; font-weight: bold; font-size: 16px; margin-top: 20px; }
          .info-table, .rules-table { width: 100%; margin-top: 10px; border-collapse: collapse; }
          .info-table td { padding: 8px; border: 1px solid #ccc; }
          .rules-table td { padding: 6px; }
          .dot { height: 10px; width: 10px; background-color: #539486; border-radius: 50%; display: inline-block; margin-right: 6px; }
          .dot-red { background-color: #FF4D4D; }
          .highlight { background-color: #f0f7f5; padding: 10px; border-left: 4px solid #539486; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PRATAP LIBRARY</h1>
          <h3>A SELF STUDY CENTER</h3>
          <p>H. No.-34-A, Singh Villa, Road No.-19, (Near Noble Public School),</p>
          <p>Bank Colony, Baba Chowk, Keshri Nagar, Patna-800024</p>
          <p>📞 9304161888, 9835491795</p>
        </div>

  
        <div class="section-title">Student Information</div>
        <table class="info-table">
          <tr><td><strong>Student's Name</strong></td><td>${latestStudent?.studentName}</td></tr>
          <tr><td><strong>Father's Name</strong></td><td>${latestStudent?.fatherName}</td></tr>
          <tr><td><strong>Phone No.</strong></td><td>${latestStudent?.phone}</td></tr>
          <tr><td><strong>Shift</strong></td><td>${latestStudent?.shift}</td></tr>
          <tr><td><strong>Seat No.</strong></td><td>${latestStudent?.seatNo}</td></tr>
          <tr><td><strong>ID Proof</strong></td><td>${latestStudent?.idProof}</td></tr>
          <tr><td><strong>Local Address</strong></td><td>${latestStudent?.localAdd}</td></tr>
          <tr><td><strong>Permanent Address</strong></td><td>${latestStudent?.permanentAdd}</td></tr>
          <tr><td><strong>Due Date</strong></td><td>${moment(latestStudent?.dueDate).format('DD/MM/YYYY')}</td></tr>
          <tr><td><strong>Amount</strong></td><td>₹${latestStudent?.amount}</td></tr>
        </table>
  
        <div class="section-title">Rules & Regulations</div>
        <table class="rules-table">
          <tr><td><span class="dot"></span> Please maintain silence in the library.</td></tr>
          <tr><td><span class="dot"></span> Mark your attendance daily in the register.</td></tr>
          <tr><td><span class="dot"></span> Always flush after using washroom.</td></tr>
          <tr><td><span class="dot"></span> For any complaints/suggestions contact on 9304161888 / 9835491795.</td></tr>
        </table>
  
        <div class="section-title">Don'ts</div>
        <table class="rules-table">
          <tr><td><span class="dot dot-red"></span> No discussions/murmuring inside the library.</td></tr>
          <tr><td><span class="dot dot-red"></span> No food items are allowed on the seat.</td></tr>
          <tr><td><span class="dot dot-red"></span> Don't gather in groups outside the library (Strictly Prohibited).</td></tr>
        </table>
      </body>
    </html>
    `;
  
    const options = {
      html: htmlContent,
      fileName: `Receipt_${latestStudent?.studentName.replace(/\s+/g, "_")}`,
      directory: 'Documents',
    };
  
    try {
      const file = await reactNativeHTMLToPdf.convert(options);
      Alert.alert('PDF Generated', `PDF saved at: ${file.filePath}`);
      console.log('PDF Path:', file.filePath);
  
      const shareOptions = {
      title: 'Share Receipt',
      message: `Here is your receipt, ${latestStudent?.studentName}.`,
      url: `file://${file.filePath}`,
      type: 'application/pdf',
    };

    await Share.open(shareOptions);
  
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Something went wrong while generating the PDF.');
    }
  };
  
  

  return (
    <ScreenWrapper>
      <TopNav2 title="Final Confirmation" />
      <ScrollView>
        <View style={styles.container}>
          <Typo size={24} fontWeight="bold" style={styles.title}>
            Final Confirmation
          </Typo>
          
          <View style={styles.confirmationCard}>
            <Typo size={18} fontWeight="bold" style={styles.sectionTitle}>
              Admission Details
            </Typo>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Student Name:</Typo>
              <Typo size={16} style={styles.value}>{latestStudent?.studentName}</Typo>
            </View>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Father's Name:</Typo>
              <Typo size={16} style={styles.value}>{latestStudent?.fatherName}</Typo>
            </View>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Room:</Typo>
              <Typo size={16} style={styles.value}>{latestStudent?.room}</Typo>
            </View>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Seat No:</Typo>
              <Typo size={16} style={styles.value}>{latestStudent?.seatNo}</Typo>
            </View>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Duration:</Typo>
              <Typo size={16} style={styles.value}>{latestStudent?.duration} months</Typo>
            </View>
            
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Amount:</Typo>
              <Typo size={16} style={styles.value}>₹{latestStudent?.amount}</Typo>
            </View>
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>Due Date:</Typo>
              <Typo size={16} style={styles.value}>{moment(latestStudent?.dueDate).format('DD/MM/YYYY')}</Typo>
            </View>
          </View>
          
          <Button style={styles.confirmButton}>
            <Typo size={18} fontWeight="bold" color={colors.black}>
              Confirm Admission
            </Typo>
          </Button>
          
          <Button 
            style={{ ...styles.confirmButton, backgroundColor: colors.neutral700 }}
            onPress={handleGeneratePDF}
          >
            <Typo size={16} fontWeight="bold" color={colors.white}>
              Download PDF
            </Typo>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default FinalConfirm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationCard: {
    backgroundColor: colors.neutral800,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  label: {
    color: colors.textLighter,
    flex: 1,
  },
  value: {
    color: colors.white,
    flex: 1,
    textAlign: 'right',
  },
  confirmButton: {
    marginTop: 20,
  },
}); 