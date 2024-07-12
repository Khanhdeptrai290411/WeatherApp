import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import ForeCastItem from './ForeCastItem';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_API = `c7ffa6be377a3302dbabee32234a6480`;

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}
type weatherState = {
  name: string;
  main: MainWeather;
  weather: [
    {
      id: string,
      main: string,
      description: string,
      icon: string
    }
  ],
};

export type weatherForecast = {
  main: MainWeather
  dt: number;
}

const Weather = () => {
  const [weather, setWeather] = useState<weatherState>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const [forecast, setForecast] = useState<weatherForecast[]>();
  const [searchTerm, setSearchTerm] = useState<string>('');

  //fetch weather
  const fetchWeather = async (cityName?: string) => {
    let url = `${BASE_URL}/weather?appid=${OPEN_WEATHER_API}&units=metric`;
    if (cityName) {
      url += `&q=${cityName}`;
    } else if (location) {
      url += `&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;
    } else {
      return;
    }

    const results = await fetch(url);
    const data = await results.json();
    setWeather(data);
  };
  //fetch forecast
  const fetchForeCast = async () => {
    if (!location) {
      return;
    }

    const results = await fetch(`${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_API}&units=metric`);
    const data = await results.json();
    setForecast(data.list);
  };

  useEffect(() => {
    fetchWeather();
    fetchForeCast();
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSearch = () => {
    fetchWeather(searchTerm);
  };

  if (!weather) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground source={{ uri: 'https://i.pinimg.com/564x/6b/f0/03/6bf00353acb97adfc092c1f7d997387d.jpg' }} style={styles.container}>
      
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city"
            placeholderTextColor="lightgray"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Ionicons
          style={styles.icon}
            name="search"
            size={24}
            color="white"
            onPress={handleSearch}// Call handleSearch with searchTerm
      
          />
        </View>

        <LottieView source={weather.main.temp < 20 ? require('../../assets/lottie/rain.json') : require('../../assets/lottie/sunny.json')} style={{
          width: 150,
          aspectRatio: 1,
        }}
          loop
          autoPlay
        />
        <Text style={styles.location}>{weather.name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
        <Text style={styles.location}>{weather.weather[0].description}</Text>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 200, marginBottom: 40, }}
        data={forecast}
        horizontal
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
        renderItem={({ item }) =>
          <ForeCastItem forecast={item}></ForeCastItem>
        }
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  icon:{
marginRight:10
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor:'white',
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    marginLeft:10,
    height: 40,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'white',
    width: '80%'
  },
  location: {
    fontSize: 30,
    fontWeight: '400',
    color: 'lightgray',
  },
  temp: {
    fontSize: 150,
    color: 'white',
    fontWeight: "900",

  }
});

export default Weather;
