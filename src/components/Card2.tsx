import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type CardProps = {
  number: number | string;
  label: string;
  tint?: string; // optional
  style?: any; // allow custom style

};

const { width } = Dimensions.get('window');

const Card: React.FC<CardProps> = ({ number, label, tint, style }) => {
  return (
    <View style={[styles.shadowWrapper, style]}>
      <LinearGradient
        colors={['#4BDE80', '#03C7BD', '#F591B7', '#D6D446']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.cardInner}>
          {/* <Image
            source={icon}
            style={[styles.icon, tint && { tintColor: tint }]}
          /> */}
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  shadowWrapper: {
    width: '28%',
    margin: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  gradientBorder: {
    borderRadius: 16,
    padding: 2,
  },
  cardInner: {
    backgroundColor: '#1C1E2D',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    marginBottom: 10,
    // tintColor: '#03C7BD',
  },
  number: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
