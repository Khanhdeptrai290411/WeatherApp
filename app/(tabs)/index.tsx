import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Weather from '../../components/src/Weather';  // Cập nhật đường dẫn cho chính xác

const Stack = createNativeStackNavigator();

const App = () => {
  return (
<Weather></Weather>
  );
};

export default App;
