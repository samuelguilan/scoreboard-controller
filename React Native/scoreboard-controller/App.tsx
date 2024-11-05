import { Text, View, StyleSheet, Pressable, SafeAreaView, Modal, Alert, Animated } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeviceModal from './DeviceConnectionModal';
import useBLE from './BluetoothManager';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonWithAnimationProps {
  text?: string;
  icon?: string;
  style?: object;
  onPress: () => void;
}

const useScaleAnimation = () => {
  const scaleValue = useState(new Animated.Value(1))[0];

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return { scaleValue, onPressIn, onPressOut };
};

const App: React.FC = () => {
  const { connectedDevice, requestPermissions, scanForPeripherals, connectToDevice, sendEncodedCommand, allDevices } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSecondaryModalVisible, setIsSecondaryModalVisible] = useState<boolean>(false);
  const [isResetConfirmationVisible, setIsResetConfirmationVisible] = useState<boolean>(false);

  const hideModal = () => setIsModalVisible(false);
  const hideSecondaryModal = () => setIsSecondaryModalVisible(false);

  const showModal = async () => {
    await scanForDevices();
    setIsModalVisible(true);
  };

  const showSecondaryModal = () => setIsSecondaryModalVisible(true);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) scanForPeripherals();
  };

  const handleResetMatch = () => setIsResetConfirmationVisible(true);

  const confirmResetMatch = () => {
    setIsResetConfirmationVisible(false);
    sendEncodedCommand('l'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevice ? (
        <>
          <ButtonWithAnimation
            text="Controles da mesa"
            icon="bulletin-board"
            style={styles.mainButton}
            onPress={showSecondaryModal}
          />

          <Text style={styles.sectionTitle}>Pontuação</Text>
          <View style={styles.scoreButtons}>
            <ButtonWithAnimation
              text="Casa pontua"
              icon="plus"
              style={styles.teamButton}
              onPress={() => sendEncodedCommand('a')}
            />
            <ButtonWithAnimation
              text="Visitante pontua"
              icon="plus"
              style={styles.teamButton}
              onPress={() => sendEncodedCommand('b')}
            />
          </View>

          <Text style={styles.sectionTitle}>Relógio da partida</Text>
          <ButtonWithAnimation
            text="Resumir ou pausar"
            icon="play-pause"
            style={styles.clockButton}
            onPress={() => sendEncodedCommand('c')}
          />

          <Text style={styles.sectionTitle}>Relógio de posse</Text>
          <View style={styles.clockButtons}>
            <ButtonWithAnimation
              text="14 s"
              icon="restart"
              style={styles.resetClockButton}
              onPress={() => sendEncodedCommand('f')}
            />
            <ButtonWithAnimation
              text="24 s"
              icon="restart"
              style={styles.resetClockButton}
              onPress={() => sendEncodedCommand('e')}
            />
          </View>

          <ButtonWithAnimation
            icon="play"
            text="Resumir"
            style={styles.resetClockButton}
            onPress={() => sendEncodedCommand('d')}
          />
        </>
      ) : (
        <View style={styles.connectionContainer}>
          <Text style={styles.infoText}>Favor conectar ao placar</Text>
          <ButtonWithAnimation
            text="Conectar"
            icon= 'bluetooth-connect'
            style={styles.connectButton}
            onPress={showModal}
          />
        </View>
      )}

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />

      {/* Secondary Modal */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={isSecondaryModalVisible}
        onRequestClose={hideSecondaryModal}
      >
        <View style={styles.modalContainer}>
          {/* Reset Match Button */}
          <ButtonWithAnimation
            text="Reiniciar partida"
            style={styles.resetButton}
            onPress={handleResetMatch}
          />

          <ButtonWithAnimation
            text="Próximo período"
            style={styles.modalButton}
            onPress={() => sendEncodedCommand('k')}
          />

          <View style={styles.teamSections}>
            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>Casa</Text>
              <ButtonWithAnimation
                text="Debitar tempo"
                style={styles.teamButton}
                onPress={() => sendEncodedCommand('i')}
              />
              <ButtonWithAnimation
                text="Falta da casa"
                style={styles.teamButton}
                onPress={() => sendEncodedCommand('g')}
              />
            </View>

            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>Visitante</Text>
              <ButtonWithAnimation
                text="Debitar tempo"
                style={styles.teamButton}
                onPress={() => sendEncodedCommand('j')}
              />
              <ButtonWithAnimation
                text="Falta do visitante"
                style={styles.teamButton}
                onPress={() => sendEncodedCommand('h')}
              />
            </View>
          </View>

          <ButtonWithAnimation
            text="Controles do placar"
            icon="scoreboard-outline"
            style={styles.closeModalButton}
            onPress={hideSecondaryModal}
          />
        </View>
      </Modal>

      {/* Reset Confirmation Dialog */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isResetConfirmationVisible}
        onRequestClose={() => setIsResetConfirmationVisible(false)}
      >
        <View style={styles.confirmationDialogContainer}>
          <View style={styles.confirmationDialog}>
            <Text style={styles.confirmationText}>Tem certeza que quer reiniciar a partida?</Text>
            <View style={styles.confirmationButtons}>
              <ButtonWithAnimation
                text="Sim"
                style={styles.confirmButton}
                onPress={confirmResetMatch}
              />
              <ButtonWithAnimation
                text="Não"
                style={styles.cancelButton}
                onPress={() => setIsResetConfirmationVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Reusable ButtonWithAnimation component with TypeScript typing
const ButtonWithAnimation: React.FC<ButtonWithAnimationProps> = ({ text, icon, style, onPress }) => {
  const { scaleValue, onPressIn, onPressOut } = useScaleAnimation();

  return (
    <AnimatedPressable
      style={[style, { transform: [{ scale: scaleValue }] }]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {icon && <MaterialCommunityIcons name={icon} size={30} color="white" />}
      {text && <Text style={styles.buttonText}>{text}</Text>}
    </AnimatedPressable>
  );
};








const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f0f4f8',
  },
  mainButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    margin: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginVertical: 10,
  },
  scoreButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    textAlign: 'center',
    marginVertical: 10,
  },
  clockButton: {
    backgroundColor: '#FF9500',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  clockButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  resetClockButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  teamButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  connectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  teamSections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  closeModalButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  confirmationDialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationDialog: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  
});

export default App;
