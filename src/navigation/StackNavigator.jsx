import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Detail from '../pages/Detail';

const Stack = createNativeStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}

export default MyStack;
