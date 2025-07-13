import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import Typo from '../components/Typo';
import Button from '../components/Button';
import { colors } from '../constants/theme';
import { useAppContext } from '../contexts/AppContext';
import reactNativeHTMLToPdf from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import moment from 'moment';
import RNFS from 'react-native-fs';

type FinalConfirmProps = NativeStackScreenProps<
  RootStackParamList,
  'FinalConfirm'
>;

const FinalConfirm = ({ route }: FinalConfirmProps) => {
  const { adminProfile, fetchAdminProfile } = useAppContext();
  const { admissionData } = route.params;

  // Fetch admin profile on mount if not already loaded
  useEffect(() => {
    if (!adminProfile) fetchAdminProfile();
  }, []);

  // Use the admission data passed from SeatSelection instead of fetching from backend
  const currentStudent = admissionData;
  
  // Calculate due date based on duration if not provided
  const calculateDueDate = () => {
    if (currentStudent?.dueDate) {
      return currentStudent.dueDate;
    }
    
    if (currentStudent?.duration) {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + parseInt(currentStudent.duration));
      return dueDate.toISOString();
    }
    
    return new Date().toISOString();
  };
  
  const dueDate = calculateDueDate();

  // Function to convert image URI to base64
  const convertImageToBase64 = async (imageUri: string): Promise<string | null> => {
    try {
      if (!imageUri) return null;
      
      console.log('Converting image URI:', imageUri);
      
      // Check if it's a local file URI
      if (imageUri.startsWith('file://') || imageUri.startsWith('/')) {
        // Remove file:// prefix if present
        const cleanUri = imageUri.replace('file://', '');
        console.log('Reading local file:', cleanUri);
        const base64 = await RNFS.readFile(cleanUri, 'base64');
        console.log('Successfully converted local file to base64');
        return base64;
      } else if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        // It's a remote URL - we can't convert this to base64 easily
        console.log('Image is a remote URL, cannot convert to base64:', imageUri);
        return null;
      } else {
        console.log('Unknown image URI format:', imageUri);
        return null;
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    // Convert image to base64 if it exists
    let imageBase64 = null;
    
    // Try to get image from image field first, then fallback to idUpload
    const imageToUse = currentStudent?.image || currentStudent?.idUpload;
    
    if (imageToUse) {
      imageBase64 = await convertImageToBase64(imageToUse);
    }

    const htmlContent = `
    <html>

<head>
  <style>
    .page {
      background-color: #ffffff;
      padding: 20px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: -10px;
      margin-bottom: 10px;
      max-width: 60%
    }

    .header-row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .library-name {
      font-size: 22px;
      font-weight: bold;
      color: #539486;
    }

    .sub-header {
      font-size: 13px;
      font-weight: bold;
      color: #539486;
    }

    .address-text {
      font-size: 10px;
      color: #539486;
      font-weight: 500;
      text-align: center;
      /* medium */
    }

    .divider {
      height: 1px;
      width: 100%;
      background-color: #539486;
      margin-top: -20px;
    }

    .date-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      align-self: flex-start;
      padding-left: 10px;
    }

    .date-text {
      font-size: 12px;
      font-weight: 500;
      /* medium */
      color: #539486;
    }

    .date-value {
      font-size: 13px;
      font-weight: 600;
      /* semibold */
    }

    .student-info {
      margin-top: -10px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      margin-bottom: 20px;
      align-self: flex-start;
    }

    .info-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 21px;
      width: 100%;
    }

    .info-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background-color: rgba(83, 148, 134, 0.05);
      padding: 13px;
      border-radius: 8px;
      width: 100%;
    }

    .info-item {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
    }

    .info-label {
      font-size: 12px;
      font-weight: 500;
      /* medium */
      color: #539486;
    }

    .info-value {
      font-size: 13px;
      font-weight: normal;
    }

    .address-container {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
      background-color: rgba(83, 148, 134, 0.05);
      padding: 13px;
      border-radius: 8px;
    }

    .payment-container {
      display: flex;
      flex-direction: row;
      gap: 25px;
      width: 100%;
    }

    .payment-item {
      background-color: rgba(83, 148, 134, 0.1);
      padding: 13px;
      border-radius: 8px;
      border-left: 4px solid #539486;
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
    }

    .payment-text {
      font-size: 13px;
      font-weight: bold;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #539486;
      text-align: center;
      margin-bottom: 14px;
    }

    .rules-container {
      background-color: rgba(83, 148, 134, 0.05);
      padding: 13px;
      border-radius: 8px;
      gap: 8px;
      width: 100%;
    }

    .rule-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }

    .rule-text {
      font-size: 11px;
    }

    .photo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: flex-start;
      width: 17%;
    }

    .photo-frame {
      width: 80px;
      height: 100px;
      background-color: rgba(83, 148, 134, 0.1);
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #539486;
      margin-bottom: 5px;
    }

    .photo-label {
      font-size: 8px;
      color: #539486;
      font-weight: 500;
      /* medium */
    }

    .button-container {
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .print-button {
      width: 150px;
      background-color: #539486;
      color: #ffffff;
      padding: 10px;
      border-radius: 10px;
      font-size: 21px;
      font-weight: 600;
      /* semibold */
      border: none;
      cursor: pointer;
    }

    .whatsapp-button {
      display: flex;
      flex-direction: row;
      background-color: #539486;
      color: #ffffff;
      padding: 10px;
      border-radius: 10px;
      gap: 10px;
      border: none;
      cursor: pointer;
    }

    .mobile-warning {
      color: red;
      font-weight: bold;
      font-size: 24px;
    }

    .back-button {
      width: 150px;
      background-color: #539486;
      color: white;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 30px;
      align-self: flex-start;
      margin-left: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      border: none;
      cursor: pointer;
  </style>
</head>

<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-row">
        <div style="display: flex; flex-direction: column;">
          <div class="library-name">${adminProfile?.libraryName}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px;">
          <!-- <img src="" alt="Map icon" style="width: 10px; height: 10px;"> -->
          <div class="address-text">📍${adminProfile?.libraryAddress}</div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px;">
          <!-- <img src="" alt="Phone icon" style="width: 10px; height: 10px;"> -->
          <div class="address-text">📞 ${adminProfile?.phone}</div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Date -->
    <div class="date-container">
      <div class="date-text">Date : </div>
      <div class="date-value">${moment().format('DD/MM/YYYY')}</div>
    </div>

    <!-- Student Info -->
    <div class="student-info">
      <div class="info-row">
        <div class="info-container">
          <div class="info-item">
            <div class="info-label">Student's Name : </div>
            <div class="info-value">${currentStudent?.studentName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Father's Name : </div>
            <div class="info-value">${currentStudent?.fatherName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone No. : </div>
            <div class="info-value">${currentStudent?.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Shift : </div>
            <div class="info-value">${currentStudent?.shift}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Seat No. : </div>
            <div class="info-value">${currentStudent?.seatNo}</div>
          </div>
          <div class="info-item">
            <div class="info-label">ID Proof : </div>
            <div class="info-value">${currentStudent?.idProof}</div>
          </div>
        </div>

        <div class="photo-container">
          <div class="photo-frame">
            ${imageBase64 ? 
              `<img src="data:image/jpeg;base64,${imageBase64}" alt="Student photo" style="width: 100%; height: 100%; border-radius: 5px; object-fit: cover;">` :
              currentStudent?.image && (currentStudent.image.startsWith('http://') || currentStudent.image.startsWith('https://')) ?
              `<img src="${currentStudent.image}" alt="Student photo" style="width: 100%; height: 100%; border-radius: 5px; object-fit: cover;">` :
              currentStudent?.idUpload && (currentStudent.idUpload.startsWith('http://') || currentStudent.idUpload.startsWith('https://')) ?
              `<img src="${currentStudent.idUpload}" alt="Student photo" style="width: 100%; height: 100%; border-radius: 5px; object-fit: cover;">` :
              `<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 5px;">
                <span style="font-size: 12px; color: #999;">No Photo</span>
              </div>`
            }
          </div>
          <div class="photo-label">Student Photo</div>
        </div>
      </div>

      <div class="address-container">
        <div class="info-label">Local Address : </div>
        <div style="font-size: 12px; font-weight: normal;">${currentStudent?.localAdd}</div>
      </div>
      <div class="address-container">
        <div class="info-label">Permanent Address : </div>
        <div style="font-size: 12px; font-weight: normal;">${currentStudent?.permanentAdd}</div>
      </div>
      <div class="payment-container">
        <div class="payment-item">
          <div class="info-label">Due Date : </div>
          <div class="payment-text">${moment(dueDate).format('DD/MM/YYYY')}</div>
        </div>
        <div class="payment-item">
          <div class="info-label">Amount : </div>
          <div class="payment-text">${currentStudent?.amount}</div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Rules -->
    <div style="align-self: flex-start; width: 100%;">
      <div class="section-title">Rules & Regulations</div>
      <div class="rules-container">
        <div class="rule-item">
          <!-- <img src="" alt="Check icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ✅ Please maintain silence in the library.
          </div>
        </div>
        <div class="rule-item">
          <!-- <img src="" alt="Check icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ✅ Mark your attendance daily in the register.
          </div>
        </div>
        <div class="rule-item">
          <!-- <img src="" alt="Check icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ✅ Always flush after using washroom.
          </div>
        </div>
        <div class="rule-item">
          <!-- <img src="" alt="Check icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ✅ For any complaints/suggestions contact on this no. 9304161888/9835491795.
          </div>
        </div>
      </div>
    </div>

    <div style="height: 1px; width: 100%; background-color: #539486;"></div>

    <!-- Don'ts -->
    <div style="align-self: flex-start; width: 100%;">
      <div class="section-title">Don'ts</div>
      <div class="rules-container">
        <div class="rule-item">
          <!-- <img src="" alt="Cancel icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ❌ No discussions/murmurning inside the library.
          </div>
        </div>
        <div class="rule-item">
          <!-- <img src="" alt="Cancel icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ❌ No food items are allowed to have on the seat.
          </div>
        </div>
        <div class="rule-item">
          <!-- <img src="" alt="Cancel icon" style="width: 10px; height: 10px;"> -->
          <div class="rule-text">
            ❌ Don't gather in groups outside the library. (Strictly Prohibited)
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
    `;

    const options = {
      html: htmlContent,
      fileName: `Receipt_${currentStudent?.studentName.replace(/\s+/g, '_')}`,
      directory: 'Documents',
    };

    try {
      const file = await reactNativeHTMLToPdf.convert(options);
      Alert.alert('PDF Generated', `PDF saved at: ${file.filePath}`);
      console.log('PDF Path:', file.filePath);

      const shareOptions = {
        title: 'Share Receipt',
        message: `Here is your receipt, ${currentStudent?.studentName}.`,
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
              <Typo size={16} style={styles.label}>
                Student Name:
              </Typo>
              <Typo size={16} style={styles.value}>
                {currentStudent ? currentStudent.studentName : ''}
              </Typo>
            </View>

            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Father's Name:
              </Typo>
              <Typo size={16} style={styles.value}>
                {currentStudent ? currentStudent.fatherName : ''}
              </Typo>
            </View>

            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Room:
              </Typo>
              <Typo size={16} style={styles.value}>
                {currentStudent ? currentStudent.room : ''}
              </Typo>
            </View>

            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Seat No:
              </Typo>
              <Typo size={16} style={styles.value}>
                {currentStudent ? currentStudent.seatNo : ''}
              </Typo>
            </View>

            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Duration:
              </Typo>
              <Typo size={16} style={styles.value}>
                {currentStudent ? currentStudent.duration : ''} months
              </Typo>
            </View>

            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Amount:
              </Typo>
              <Typo size={16} style={styles.value}>
                ₹{currentStudent ? currentStudent.amount : ''}
              </Typo>
            </View>
            <View style={styles.detailRow}>
              <Typo size={16} style={styles.label}>
                Due Date:
              </Typo>
              <Typo size={16} style={styles.value}>
                {moment(dueDate).format('DD/MM/YYYY')}
              </Typo>
            </View>
          </View>

          {/* <Button style={styles.confirmButton}>
            <Typo size={18} fontWeight="600" color={colors.white}>
              Confirm Admission
            </Typo>
          </Button> */}

          <Button
            style={{
              ...styles.confirmButton,
            }}
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
