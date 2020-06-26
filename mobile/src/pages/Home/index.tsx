import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, Picker, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {

    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const navigation = useNavigation();

    useEffect(() => {
      axios
        .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then( response => {
          const ufInitials = response.data.map(uf => uf.sigla);
        
          setUfs(ufInitials);
        });
    }, []);
  
    useEffect(() => {
      if(selectedUf === '0'){
        return;
      }
      axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then( response => {
          const cityNames = response.data.map(city => city.nome);
        
          setCities(cityNames);
        });
    }, [selectedUf]);

    function handleNavigateToPoints() {
      navigation.navigate('Points', {
        selectedUf,
        selectedCity
      });
    }
 
    return (
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}

            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu market place de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Picker
                      selectedValue={selectedUf}
                      style={styles.input}
                      onValueChange={(itemValue) => setSelectedUf(itemValue)}
                    >
                      <Picker.Item label="Selecione um estado" value="0" />
                      {ufs.map(uf => {
                        return (
                          <Picker.Item key={uf} label={uf} value={uf} />
                        )
                      })}
                    </Picker>
                    <Picker
                      selectedValue={selectedCity}
                      style={styles.input}
                      onValueChange={(itemValue) => setSelectedCity(itemValue)}
                    >
                      <Picker.Item label="Selecione uma cidade" value="0" />
                      {cities.map(city => {
                        return (
                          <Picker.Item key={city} label={city} value={city} />
                        )
                      })}
                    </Picker>
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                      <View style={styles.buttonIcon}>
                        <Text>
                          <Icon name="corner-down-right" color="#FFF" size={24}/>
                        </Text>
                      </View>
                      <Text style={styles.buttonText}>
                        Entrar
                      </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 54,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      marginBottom: 20,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 45,
      backgroundColor: '#FFF',
      textDecorationColor: '#6C6C80',
      borderRadius: 40,
      marginBottom: 10,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 10,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;