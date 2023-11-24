import { Text, View, StyleSheet, Button, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Placar</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.buttonHomeStyle}
          onPress={() => alert('Ponto para equipe da casa adicionado')}>
          <Text style={styles.buttonText}>Casa + 1</Text>
        </Pressable>

        <Pressable
          style={styles.buttonVisitorStyle}
          onPress={() => alert('Ponto para equipe visitante adicionado')}>
          <Text style={styles.buttonText}>Visitante + 1</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.buttonHomeStyle}
          onPress={() => alert('Tempo da equipe da casa debitado')}>
          <Text style={styles.buttonText}>Tempo Casa</Text>
        </Pressable>

        <Pressable
          style={styles.buttonVisitorStyle}
          onPress={() => alert('Tempo da equipe visitante debitado')}>
          <Text style={styles.buttonText}>Tempo Visitante</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.buttonHomeStyle}
          onPress={() => alert('Falta da equipe da casa adicionada')}>
          <Text style={styles.buttonText}>Falta Casa</Text>
        </Pressable>

        <Pressable
          style={styles.buttonVisitorStyle}
          onPress={() => alert('Falta da equipe visitante adicionada')}>
          <Text style={styles.buttonText}>Falta Visitante</Text>
        </Pressable>
      </View>
      <Text style={styles.paragraph}>Relógio da partida</Text>
      <Pressable
        style={styles.buttonGameClockStyle}
        onPress={() => alert('Relógio da partida iniciou/pausou')}>
        <MaterialCommunityIcons name="play-pause" size={100} color="black" />
      </Pressable>

      <Text style={styles.paragraph}>Relógio de posse</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.buttonShotClockStyle}
          onPress={() => alert('Relógio de posse reiniciou para 14 segundos')}>
          <Text style={styles.buttonText}>14s</Text>
          <MaterialCommunityIcons name="restart" size={50} color="black" />
        </Pressable>

        <Pressable
          style={styles.buttonShotClockStyle}
          onPress={() => alert('Relógio de posse reiniciou para 24 segundos')}>
          <Text style={styles.buttonText}>24s</Text>
          <MaterialCommunityIcons name="restart" size={50} color="black" />
        </Pressable>
      </View>
      
      <Text style = {styles.buttonTexts}>  </Text>
        <Pressable
          style={styles.buttonShotClockStyle}
          onPress={() => alert('Relógio de posse resumiu')}>
          <MaterialCommunityIcons name="play" size={100} color="black" />
        </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignItems: 'center',
  },
  buttonShotClockStyle: {
    margin: '20',
    backgroundColor: 'violet',
    alignItems: 'center',
  },
  buttonGameClockStyle: {
    margin: '20',
    backgroundColor: 'orange',
    alignItems: 'center',
  },
  buttonHomeStyle: {
    margin: '20',
    backgroundColor: 'cyan',
    alignItems: 'center',
  },
  buttonVisitorStyle: {
    margin: '20',
    backgroundColor: 'green',
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
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
