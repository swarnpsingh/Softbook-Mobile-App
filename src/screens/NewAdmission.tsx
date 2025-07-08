import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav from '../components/TopNav';
import TopNav2 from '../components/TopNav2';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { pickPDF, pickImage, pickDocument } from '../utils/documentPicker';

// Simple document picker simulation

type NewAdmissionProps = NativeStackScreenProps<
  RootStackParamList,
  'NewAdmission'
>;

const NewAdmission = ({ navigation }: NewAdmissionProps) => {
  const [isLoading] = useState(false);
  const [data, setData] = useState({
    studentName: '',
    fatherName: '',
    localAdd: '',
    permanentAdd: '',
    room: '',
    shift: '',
    seatNo: '',
    phone: '',
    amount: '',
    paymentMode: 'Online',
    duration: '',
    idProof: 'Aadhar Card',
    idUpload: '',
    image: '',
    libraryId: '',
    dueDate: '',
  });

  return (
    <ScreenWrapper>
      <ScrollView>
        <TopNav2 title="New Admission" />
        <View style={styles.container}>
          <Typo size={24} fontWeight="bold" style={styles.title}>
            New Admission
          </Typo>
          <View style={styles.formContainer}>
            <Typo size={16} fontWeight="bold" style={styles.formTitle}>
              Student Credentials
            </Typo>

            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Full Name
              </Typo>
              <Input
                placeholder="Swarn Pratap Singh"
                value={data.studentName}
                onChangeText={text => setData({ ...data, studentName: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Father's Name
              </Typo>
              <Input
                placeholder="Mr. Sanjay Kumar Singh"
                value={data.fatherName}
                onChangeText={text => setData({ ...data, fatherName: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Street Address
              </Typo>
              <Input
                placeholder="Enter your address here"
                value={data.localAdd}
                onChangeText={text => setData({ ...data, localAdd: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Permanent Address
              </Typo>
              <Input
                placeholder="Enter your address here"
                value={data.permanentAdd}
                onChangeText={text => setData({ ...data, permanentAdd: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Mobile Number
              </Typo>
              <Input
                placeholder="82100XXXXXX"
                value={data.phone}
                onChangeText={text => setData({ ...data, phone: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Duration (months)
              </Typo>
              <Input
                placeholder="1"
                value={data.duration}
                onChangeText={text => setData({ ...data, duration: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                ID Proof
              </Typo>
              <Input
                placeholder="Aadhar Card/Passport/Driving License"
                value={data.idProof}
                onChangeText={text => setData({ ...data, idProof: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                ID Upload
              </Typo>
              <TouchableOpacity
                style={styles.uploadContainer}
                onPress={async () => {
                  const result = await pickImage();
                  if (result) {
                    setData(prevData => ({ ...prevData, idUpload: result.uri }));
                  }
                }}
              >
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadIcon}>📁</Text>
                  <Text style={styles.uploadText}>
                    {data.idUpload ? 'Document Selected' : 'Tap to upload document'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Image Upload
              </Typo>
              <TouchableOpacity
                style={styles.uploadContainer}
                onPress={async () => {
                  const result = await pickImage();
                  if (result) {
                    setData(prevData => ({ ...prevData, image: result.uri }));
                  }
                }}
              >
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>
                    {data.image ? 'Image Selected' : 'Tap to upload image'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Amount Paid
              </Typo>
              <Input
                placeholder="Rs. 500"
                value={data.amount}
                onChangeText={text => setData({ ...data, amount: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Typo size={16} fontWeight="bold" style={styles.formLabel}>
                Payment Method
              </Typo>
              <Input
                placeholder="UPI/Bank Transfer/Cash"
                value={data.paymentMode}
                onChangeText={text => setData({ ...data, paymentMode: text })}
              />
            </View>
            <Button
              style={styles.button}
              loading={isLoading}
              onPress={() =>
                navigation.navigate('SeatSelection', { admissionData: data })
              }
            >
              <Typo size={21} fontWeight={'700'} color={colors.black}>
                Proceed to Seat Selection
              </Typo>
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default NewAdmission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 15,
  },
  formTitle: {
    marginBottom: 10,
  },
  formContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  formLabel: {
    marginBottom: 5,
  },
  formGroup: {},
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationInput: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 10,
  },
  plusButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  minusButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.neutral300,
    minHeight: 48,
    justifyContent: 'center',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadText: {
    fontSize: 16,
    color: colors.neutral600,
    flex: 1,
  },
  button: {
    marginTop: 20,
  },
});
