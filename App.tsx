import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './context/GameContext';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import DrawingScreen from './screens/DrawingScreen';
import ViewingScreen from './screens/ViewingScreen';
import GuessingScreen from './screens/GuessingScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
            animationEnabled: true,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Lobby" 
            component={LobbyScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Drawing" 
            component={DrawingScreen}
          />
          <Stack.Screen 
            name="Viewing" 
            component={ViewingScreen}
          />
          <Stack.Screen 
            name="Guessing" 
            component={GuessingScreen}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
