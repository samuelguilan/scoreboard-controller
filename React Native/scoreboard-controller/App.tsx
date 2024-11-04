import { Text, View, StyleSheet, Button, Pressable, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeviceModal from './DeviceConnectionModal';
import useBLE from './BluetoothManager';



const App = () => {
  const { connectedDevice, requestPermissions, scanForPeripherals, connectToDevice, setCommand, setCommandEncoded, allDevices } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const showModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevice ? (
        <>
          <Text style={styles.paragraph}>Placar</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => setCommandEncoded('a')}>
              <Text style={styles.buttonText}>Casa + 1</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => setCommandEncoded('b')}>
              <Text style={styles.buttonText}>Visitante + 1</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => setCommandEncoded('i')}>
              <Text style={styles.buttonText}>Tempo Casa</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => setCommandEncoded('j')}>
              <Text style={styles.buttonText}>Tempo Visitante</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => setCommandEncoded('g')}>
              <Text style={styles.buttonText}>Falta Casa</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => setCommandEncoded('h')}>
              <Text style={styles.buttonText}>Falta Visitante</Text>
            </Pressable>
          </View>
          <Text style={styles.paragraph}>Relógio da partida</Text>
          <Pressable style={styles.buttonGameClockStyle} onPress={() => setCommandEncoded('c')}>
            <MaterialCommunityIcons name="play-pause" size={80} color="black" />
          </Pressable>
          <Text style={styles.paragraph}>Relógio de posse</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonShotClockStyle} onPress={() => setCommandEncoded('f')}>
              <Text style={styles.buttonText}>14s</Text>
              <MaterialCommunityIcons name="restart" size={50} color="black" />
            </Pressable>
            <Pressable style={styles.buttonShotClockStyle} onPress={() => setCommandEncoded('e')}>
              <Text style={styles.buttonText}>24s</Text>
              <MaterialCommunityIcons name="restart" size={50} color="black" />
            </Pressable>
          </View>
          <View style={styles.container}>
          <Pressable style={styles.buttonShotClockStyle} onPress={() => setCommandEncoded('d')}>
            <MaterialCommunityIcons name="play" size={80} color="black" />
          </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Favor conectar ao placar</Text>
          </View>
          <Pressable style={styles.buttonGameClockStyle} onPress={showModal}>
            <Text style={styles.buttonText}>Conectar</Text>
          </Pressable>
        </View>
      )}
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
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

export default App;
