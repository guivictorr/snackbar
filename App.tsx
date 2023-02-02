import { StatusBar } from 'expo-status-bar';
import { Box, NativeBaseProvider } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
   <NativeBaseProvider>
      <Box>Hello world</Box> 
   </NativeBaseProvider> 
  );
}
