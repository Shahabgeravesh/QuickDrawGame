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
import TutorialScreen from './screens/TutorialScreen';

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
            gestureEnabled: false, // Disable swipe gestures globally for game screens
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
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Viewing" 
            component={ViewingScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Guessing" 
            component={GuessingScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen}
          />
          <Stack.Screen 
            name="Tutorial" 
            component={TutorialScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
