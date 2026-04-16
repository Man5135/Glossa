import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import  RegistrationScreen  from './src/screens/RegistrationScreen/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import LessonScreen from './src/screens/LessonScreen/LessonScreen';

const Stack = createStackNavigator();

export default function App(){
  
  return(
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Registration'
      screenOptions={{headerShown: false}}
      >
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='Registration' component={RegistrationScreen}/>
        <Stack.Screen name='HomeScreen' component={HomeScreen}/>
        <Stack.Screen name='LessonScreen' component={LessonScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}