import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { verticalScale } from '../utils/styling';
import { colors } from '../constants/theme';
import Typo from './Typo';

const TopNav = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* <Ionicons 
          name="chevron-back"
          size={verticalScale(26)}
          color={colors.white}
        /> */}
        <Image source={require('../assets/Icon.png')}  style={styles.logo} />
      </TouchableOpacity>
      <Typo style={styles.title}>Pratap Tech Solutions</Typo>
    </View>
  )
}

export default TopNav

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
    color: 'white',
  },
  logo: {
    width: 45,
    height: 45,
  }
})
