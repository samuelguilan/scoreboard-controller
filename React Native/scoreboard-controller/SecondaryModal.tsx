import { Text, View, StyleSheet, Button, Pressable, SafeAreaView, Modal } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeviceModal from './DeviceConnectionModal';
import useBLE from './BluetoothManager';



const App = () => {
  const { connectedDevice, requestPermissions, scanForPeripherals, connectToDevice, sendEncodedCommand, allDevices } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSecondaryModalVisible, setIsSecondaryModalVisible] = useState<boolean>(false);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const hideSecondaryModal = () => {
    setIsSecondaryModalVisible(false);
  };

  const showModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  const showSecondaryModal = async () => {
    setIsSecondaryModalVisible(true);
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
          <Pressable style={styles.buttonGameClockStyle} onPress={showSecondaryModal}>
            <Text style={styles.buttonText}>Controles da mesa</Text>
          </Pressable>
          <Text style={styles.paragraph}>Placar</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('a')}>
              <Text style={styles.buttonText}>Casa + 1</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('b')}>
              <Text style={styles.buttonText}>Visitante + 1</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('i')}>
              <Text style={styles.buttonText}>Tempo Casa</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('j')}>
              <Text style={styles.buttonText}>Tempo Visitante</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('g')}>
              <Text style={styles.buttonText}>Falta Casa</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('h')}>
              <Text style={styles.buttonText}>Falta Visitante</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSecondaryModalVisible}
        onRequestClose={() => {
          setIsSecondaryModalVisible(!isSecondaryModalVisible);
        }}>
          <View style={styles.container}>
          <Pressable style={styles.buttonPeriodStyle} onPress={() => sendEncodedCommand('k')}>
              <Text style={styles.buttonText}>Próximo período</Text>
            </Pressable>
          </View>
          <View style={styles.teamContainer}>
            <Text style = {styles.paragraph}>Casa</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('i')}>
              <Text style={styles.buttonText}>Debitar tempo</Text>
            </Pressable>
            <Pressable style={styles.buttonHomeStyle} onPress={() => sendEncodedCommand('g')}>
              <Text style={styles.buttonText}>Falta da casa</Text>
            </Pressable>
            </View>
          </View>
          <View style={styles.teamContainer}>
          <Text style = {styles.paragraph}>Visitante</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('j')}>
              <Text style={styles.buttonText}>Debitar tempo</Text>
            </Pressable>
            <Pressable style={styles.buttonVisitorStyle} onPress={() => sendEncodedCommand('h')}>
              <Text style={styles.buttonText}>Falta do visitante</Text>
            </Pressable>
          </View>
          </View>
          <Pressable style={styles.buttonPeriodStyle} onPress={() => setIsSecondaryModalVisible(!isSecondaryModalVisible)}>
              <Text style={styles.buttonText}>Controle do placar</Text>
            </Pressable>
          </Modal>
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
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ecf0f1',
    padding: 1,
    alignItems: 'center',
    borderRadius: 8,
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
  buttonPeriodStyle: {
    backgroundColor: 'violet',
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
