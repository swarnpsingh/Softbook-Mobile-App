import { colors, radius } from '../constants/theme';
import { BackButtonProps } from '../types';
import { verticalScale } from '../utils/styling';
import { CaretLeftIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const BackButton = ({
    style,
    iconSize = 26,
    navigation
}: BackButtonProps & { navigation: any }) => {

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={[styles.button, style]}>
        <CaretLeftIcon 
            size={verticalScale(iconSize)}
            color={colors.white}
            weight='bold'
        />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.neutral600,
        alignSelf: "flex-start",
        borderRadius: radius._12,
        borderCurve: "continuous",
        padding: 5,
    }
})