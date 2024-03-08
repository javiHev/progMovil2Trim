import React , { useState }from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Componentes de pantalla simulados
import MenuScreen from './MenuScreen';
import DrinksScreen from './DrinksScreen';
import CartScreen from './CartScreen';


const Tab = createBottomTabNavigator();

const HomeScreen = ({ route }) => {
  const { idsEspacios, telefono } = route.params; // Asegurándonos de que no sea undefined
  const [totalMenu, setTotalMenu] = useState(0);
  const [totalDrinks, setTotalDrinks] = useState(0);
  console.log(`Espacios: ${idsEspacios},Telefono ${telefono}`)

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
      <Tab.Screen name="Menu" children={() => <MenuScreen setTotalMenu={setTotalMenu} idsEspacios={idsEspacios} telefono={telefono} />} />
      <Tab.Screen name="Bebidas" children={() => <DrinksScreen setTotalDrinks={setTotalDrinks} idsEspacios={idsEspacios} telefono={telefono} />} />
      <Tab.Screen name="Carrito">
        {() => <CartScreen totalMenu={totalMenu} totalDrinks={totalDrinks} telefono={telefono} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export default HomeScreen;