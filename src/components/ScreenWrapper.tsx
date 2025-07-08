import { colors } from '../constants/theme'
import { ScreenWrapperProps } from '../types'
import React from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const { height } = Dimensions.get('window')

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS === 'ios' ? height * 0.06 : 50;
    
    return (
        <LinearGradient
            colors={['#484381', '#1E1D3D', '#0F0E1B']}
            start={{ x: 1, y: 0 }} // Top right
            end={{ x: 0, y: 1 }}   // Bottom left
            // locations={[0.1, 0.4]}
            locations={[0.05, 0.2, 0.5]} 
            style={[{
                paddingTop,
                flex: 1,
            }, style]}
        >
            <StatusBar barStyle="light-content" />
            {children}
        </LinearGradient>
    )
}

export default ScreenWrapper

const styles = StyleSheet.create({})