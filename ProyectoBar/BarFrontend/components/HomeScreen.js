import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Componentes de pantalla simulados
const MenuScreen = () => null;
const DrinksScreen = () => null;
const CartScreen = () => null;

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => { // Removido `size` ya que vamos a definir un tamaño personalizado
            let iconName;
  
            if (route.name === 'Menu') {
              iconName = focused ? 'restaurant' : 'restaurant-outline'; // Actualizado para nombres unificados
            } else if (route.name === 'Bebidas') {
              iconName = focused ? 'wine' : 'wine-outline'; // Actualizado para nombres unificados
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline'; // Actualizado para nombres unificados
            }
  
            // Retorna el componente de icono con tamaño personalizado
            return <Ionicons name={iconName} size={30} color={color} />; // Tamaño ajustado a 30
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Menu" component={MenuScreen} />
        <Tab.Screen name="Bebidas" component={DrinksScreen} />
        <Tab.Screen name="Carrito" component={CartScreen} />
      </Tab.Navigator>
    );
  };
  

export default HomeScreen;