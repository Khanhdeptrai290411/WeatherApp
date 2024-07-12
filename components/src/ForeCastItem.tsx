import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { weatherForecast } from '../src/Weather';
import dayjs from 'dayjs';
import {BlurView} from 'expo-blur'

const ForeCastItem = ({ forecast }: { forecast: weatherForecast }) => {
  return (
    <BlurView intensity={30} style={styles.container}>

      <Text style={styles.temp}>{Math.round(forecast.main.temp)}°C</Text>
      <Text style={styles.date}>{dayjs(forecast.dt * 1000).format('ddd ha')} </Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    aspectRatio:3/4, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'hidden',
    borderColor:'white',
    borderWidth:2,
  },
  temp: {
    fontSize: 35,
    fontWeight: '900',
    color: 'white',
  },
  date:{
    fontSize: 16,
    color:'ghostwhite',
    fontWeight:'600'
  }

});

export default ForeCastItem;
