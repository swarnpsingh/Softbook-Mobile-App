import { colors } from '../constants/theme'
import { ScreenWrapperProps } from '../types'
import React from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'


const { height } = Dimensions.get('window') // Get the height of the device screen

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => { //
  // Define a functional component that takes style and children as props
  // style is an optional prop for custom styles, children are the components to be wrapped
  // This component is used to provide a consistent layout and styling for screens in the app
    let paddingTop = Platform.OS === 'ios' ? height * 0.06 : 50; // Set padding top based on platform and screen height
  return (
    <View style={[{
        paddingTop,
        // paddingHorizontal: 8,
        flex: 1,
        backgroundColor: '#101826',
    }, style] // Merge the styles passed in props with the default styles
    }>
      <StatusBar
        barStyle="light-content"
        />
        {children} 
    </View> // Render the children components inside the View
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})