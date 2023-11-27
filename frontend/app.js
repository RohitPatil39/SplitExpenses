import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyScreen from './screens/homeScreen'; // Import your screen
import CreateGroupScreen from './screens/createGroup';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="SplitExpenses" component={MyScreen} />
        <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;