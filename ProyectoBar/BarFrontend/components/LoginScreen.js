import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert } from 'react-native';
import { useFonts } from 'expo-font';



const LoginScreen = ({ navigation }) => { 
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [fontsLoaded] = useFonts({
    'Sen-Regular': require('../assets/fonts/Sen-Regular.ttf'),
  });

  const verificarReserva = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/reservas/telefono/${phoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        // Si el servidor devuelve una reserva, navega a Home
        Alert.alert(`Hola ${name}`, `Tus mesas son:\n${data.reserva.idsEspacios}`);
        navigation.navigate('Home', { idsEspacios: data.reserva.idsEspacios });
      } else {
        // Si el servidor devuelve un error 404 u otro, muestra un mensaje
        Alert.alert('Error', 'Número de teléfono no vinculado a ninguna reserva.');
      }
    } catch (error) {
      console.error('Error al verificar la reserva:', error);
      Alert.alert('Error', 'Hubo un problema al verificar la reserva.');
    }
  };
  
  const handleLogin = () => {
    const regex_phone = "^(\\+\\d{1,3}[- ]?)?\\d{9,10}$";
    const regex = new RegExp(regex_phone);
  
    if (!regex.test(phoneNumber)) {
      Alert.alert('Error', 'Por favor, introduce un número de teléfono válido.');
    } else {
      verificarReserva(); // Llama a verificarReserva si el número de teléfono es válido
    }
  };

  if (!fontsLoaded) {
    return null; // O cualquier otro indicador de carga que prefieras
  }


  return (
        <View style={styles.container}>
          <View style={styles.upperSection}>
          <Image
        source={require('../assets/circle.png')} 
        style={styles.imgCircle}
      />
            <Text style={styles.loginText}>Login</Text>
          </View>
          <View style={styles.lowerSection}>
          <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
      />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Iniciar sesión"
                onPress={handleLogin}
                color="#FF7622"
              />
            </View>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#1E1E2E',
      },
      imgCircle: {
        width: 100, // Establece el ancho de tu imagen
        height: 100, // Establece la altura de tu imagen
        marginTop: 20, // Ajusta según sea necesario
        marginLeft: 20, // Ajusta según sea necesario
      },
      upperSection: {
        flex: 3, // Ajusta esta proporción según necesites
        backgroundColor: '#1E1E2E',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
      },
      lowerSection: {
        flex: 7, // Ajusta esta proporción según necesites
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingTop: 20,
        justifyContent: 'center', // Alinea los hijos verticalmente en el centro
        alignItems: 'center', // Alinea los hijos horizontalmente en el centro
      },
      input: {
        width: '80%', // O el ancho que prefieras
        padding: 15, // Aumenta el padding para hacer los TextInput más altos
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#F0F5FA',
        borderRadius: 12,
      },
      logo: {
        width: 250, // Ajusta el ancho del logo
        height: 110, // Ajusta la altura del logo
        marginBottom: 40, // Espacio entre el logo y los TextInput
        alignSelf: 'center', // Centra el logo horizontalmente
      },
      buttonContainer: {
        width: '80%',
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: '10%',
        fontFamily: 'Sen-Regular'
      },
      loginText: {
        fontSize: 30,
        fontFamily: 'Sen-Regular',
        color:'#FFFFFF' // Asegúrate de tener esta fuente cargada en tu proyecto
      },
    });
    

export default LoginScreen;