import { Text, View, StyleSheet, Button, Pressable, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useBLE from './useBLE';



const MainScreen = () => {
  
    const {sendEncodedCommand} = useBLE();

  return (
    <SafeAreaView style={styles.container}>
          <Text style={styles.paragraph}>Placar</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('a')}>
              <Text style={styles.buttonText}>Casa + 1</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('b')}>
              <Text style={styles.buttonText}>Visitante + 1</Text>
            </Pressable>
          </View>
          <Text style={styles.paragraph}>Relógio da partida</Text>
          <Pressable style={styles.buttonGameClockStyle} onPress={() => sendEncodedCommand('c')}>
            <MaterialCommunityIcons name="play-pause" size={80} color="black" />
          </Pressable>
          <Text style={styles.paragraph}>Relógio de posse</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonShotClockStyle} onPress={() => sendEncodedCommand('f')}>
              <Text style={styles.buttonText}>14s</Text>
              <MaterialCommunityIcons name="restart" size={50} color="black" />
            </Pressable>
            <Pressable style={styles.buttonShotClockStyle} onPress={() => sendEncodedCommand('e')}>
              <Text style={styles.buttonText}>24s</Text>
              <MaterialCommunityIcons name="restart" size={50} color="black" />
            </Pressable>
          </View>
          <View style={styles.container}>
          <Pressable style={styles.buttonShotClockStyle} onPress={() => sendEncodedCommand('d')}>
            <MaterialCommunityIcons name="play" size={80} color="black" />
          </Pressable>
          </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ecf0f1',
    padding: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonShotClockStyle: {
    backgroundColor: 'violet',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonGameClockStyle: {
    backgroundColor: 'orange',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonHomeStyle: {
    backgroundColor: 'cyan',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonVisitorStyle: {
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 8,
  },
  paragraph: {
    margin: 12,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    margin: 12,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MainScreen;
