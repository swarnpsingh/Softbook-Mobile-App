import { colors } from '../constants/theme'
import { ScreenWrapperProps } from '../types'
import React from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'


const { height } = Dimensions.get('window') // Get the height of the device screen

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => { //
  // Define a functional component that takes style and children as props
  // style is an optional prop for custom styles, children are the components to be wrapped
  // This component is used to provide a consistent layout and styling for screens in the app
    let paddingTop = Platform.OS === 'ios' ? height * 0.06 : 50; // Set padding top based on platform and screen height
  return (
    <LinearGradient
      colors={['#303A9', '#0F0E1B']}
      start={{ x: 0.8, y: 0.1 }}
      end={{ x: 0, y: 1 }}
      style={[{ flex: 1, paddingTop }, style]}
    >
      <StatusBar barStyle="light-content" />
      {children}
    </LinearGradient>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})