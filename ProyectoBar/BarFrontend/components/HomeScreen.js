import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Componentes de pantalla simulados
import MenuScreen from './MenuScreen';
import DrinksScreen from './DrinksScreen';
import CartScreen from './CartScreen';


const Tab = createBottomTabNavigator();

const HomeScreen = ({ route,navigation }) => {
  // Extraer idsEspacios de route.params
  console.log(route)
  console.log(navigation)
  const { idsEspacios } = route.params; // Asegurándonos de que no sea undefined
  console.log(idsEspacios)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Bebidas') {
            iconName = focused ? 'wine' : 'wine-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* Pasar idsEspacios como parámetro inicial a MenuScreen y DrinksScreen */}
      <Tab.Screen name="Menu" children={() => <MenuScreen idsEspacios={idsEspacios} />} />
      <Tab.Screen name="Bebidas" children={() => <DrinksScreen idsEspacios={idsEspacios} />} />
      <Tab.Screen name="Carrito" component={CartScreen} />
    </Tab.Navigator>
  );
};
  

export default HomeScreen;