//Bibliotecas utilizadas para a representação em displays de quatro dígitos
#include <TM1637Display.h>
#include <SevSeg.h>

//Variáveis e constantes para a precisão de cronometro
unsigned long previousMillis = 0;
unsigned long previousShotClockMillis = 0;
const long interval = 1000;
long shotClockInterval = 1000;

//Constantes referentes as saidas digitais

const int shotClockOnesStartingPin = 10;
const int shotClockTensStartingPin = 2;
const int ledPin = 1;
const int shotClockDotPin = 9;
const int buzzerPin = 0;
const int quarterStartingPin = 43;
const int foulsHomeStartingPin = 50;
const int foulsVisitorStartingPin = 57;
const int timeoutsHomeStartingPin = 64;
const int timeoutsVisitorStartingPin = 67;


//Array para representação dos números no display de 7 segmentos
bool numbers[10][7] = {
  { true, true, true, true, true, true, false },      //0
  { false, true, true, false, false, false, false },  //1
  { true, true, false, true, true, false, true },     //2
  { true, true, true, true, false, false, true },     //3
  { false, true, true, false, false, true, true },    //4
  { true, false, true, true, false, true, true },     //5
  { true, false, true, true, true, true, true },      //6
  { true, true, true, false, false, false, false },   //7
  { true, true, true, true, true, true, true },       //8
  { true, true, true, false, false, true, true }      //9
  //  A     B     C     D      E      F      G
};

//Variáveis internas do relógio
int shotClock, minutesClock, secondsClock, tens, ones;
bool isShotClockRunning, isGameClockRunning, isShotClockUnderTen;

//Variáveis internas do placar
int scoreHome, scoreVisitor, timeoutsHome, timeoutsVisitor, foulsHome, foulsVisitor, quarter;

//Objetos referentes aos displays
TM1637Display gameClockDisplay(20, 17);
SevSeg scoreHomeDisplay, scoreVisitorDisplay;


void setup() {

  //Configura a comunicação serial e bluetooth
  Serial.begin(9600);
  Serial1.begin(9600);

  //Configura os displays de sete segmentos de 4 digitos
  byte numDigits = 4;
  byte scoreHomeDigitPins[] = { 21, 22, 23, 24 };
  byte scoreVisitorDigitPins[] = { 32, 33, 34, 35 };
  byte scoreHomeSegmentPins[] = {
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  };
  byte scoreVisitorSegmentPins[] = {
    36,
    37,
    38,
    39,
    40,
    41,
    42,
  };
  bool resistorsOnSegments = true;     
  byte hardwareConfig = COMMON_ANODE;  
  bool updateWithDelays = false;       
  bool leadingZeros = false;           
  bool disableDecPoint = true;         

  scoreHomeDisplay.begin(hardwareConfig, numDigits, scoreHomeDigitPins, scoreHomeSegmentPins, resistorsOnSegments,
                         updateWithDelays, leadingZeros, disableDecPoint);
  scoreHomeDisplay.setBrightness(10);

  scoreVisitorDisplay.begin(hardwareConfig, numDigits, scoreVisitorDigitPins, scoreVisitorSegmentPins, resistorsOnSegments,
                            updateWithDelays, leadingZeros, disableDecPoint);
  scoreVisitorDisplay.setBrightness(90);

  //Configura o display TM1637
  gameClockDisplay.setBrightness(7, true);

  //Configuração das saídas digitais

  for (int i = 2; i <= 69; i++) {
    pinMode(i, OUTPUT);
  }

  //Configuração inicial das variáveis internas do relógio
  isShotClockRunning = false;
  isGameClockRunning = false;
  secondsClock = 0;
  minutesClock = 10;
  tens = 0;
  ones = 0;

  //Configuração inicial das variáveis internas do placar
  setShotClock(24);
  setScore(true, 0);
  setScore(false, 0);
  setQuarter(1);
  setFouls(true, 0);
  setFouls(false, 0);
  setTimeouts(true, 3);
  setTimeouts(false, 3);

  digitalWrite(ledPin, HIGH);

  //Representação inicial do relógio de partida
  gameClockDisplay.showNumberDecEx(100 * (minutesClock) + secondsClock, 0b01110000);

  Serial.println("End of setup");

}

void loop() {

  //Verifica o recebimento de algum sinal 
  //serialMessageCheck();
  bluetoothSerialMessageCheck();

  //Prossegue o funcionamento do relógio de partida e posse levando em conta o tempo real decorrido

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    countdownGameClock();
  }
  unsigned long currentShotClockMillis = millis();
  if (currentShotClockMillis - previousShotClockMillis >= shotClockInterval) {
    previousShotClockMillis = currentShotClockMillis;
    countdownShotClock();
  }

  //Atualiza os displays de 4 dígitos (Recomendação da biblioteca)
  scoreHomeDisplay.refreshDisplay();
  scoreVisitorDisplay.refreshDisplay();


}

//Método para verificar as informações recebidas e realizar as ações necessárias
void serialMessageCheck() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    if (command == "add home score") {
      addScore(true);
    } else if (command == "add visitor score") {
      addScore(false);
    } else if (command == "clock") {
      clockStateChange();
    } else if (command == "shot clock resume") {
      resumeShotClock();
    } else if (command == "shot clock reset 24") {
      shotClockReset(true);
    } else if (command == "shot clock reset 14") {
      shotClockReset(false);
    } else if (command == "add home foul") {
      addFoul(true);
    } else if (command == "add visitor foul") {
      addFoul(false);
    } else if (command == "use home timeout") {
      useTimeout(true);
    } else if (command == "use visitor timeout") {
      useTimeout(false);
    } else if (command == "next quarter") {
      nextQuarter();
    } else {
      Serial.println("Command not recognized: " + command);
    }
  } else {
    //Serial.println("Nada recebido");
  }
  
}

void bluetoothSerialMessageCheck() {
  if (Serial1.available()>0) {
    Serial.println("Bluetooth recebido");
    char bluetoothData = Serial1.read();
    if (bluetoothData == 'a') {
      addScore(true);
    } else if (bluetoothData == 'b') {
      addScore(false);
    } else if (bluetoothData == 'c') {
      clockStateChange();
    } else if (bluetoothData == 'd') {
      resumeShotClock();
    } else if (bluetoothData == 'e') {
      shotClockReset(true);
    } else if (bluetoothData == 'f') {
      shotClockReset(false);
    } else if (bluetoothData == 'g') {
      addFoul(true);
    } else if (bluetoothData == 'h') {
      addFoul(false);
    } else if (bluetoothData == 'i') {
      useTimeout(true);
    } else if (bluetoothData == 'j') {
      useTimeout(false);
    } else if (bluetoothData == 'k') {
      nextQuarter();
    } else {
      Serial.println("Command not recognized: " + bluetoothData);
    }

  } else {
    //Serial.println("Nada recebido");
  }
  
}

//Métodos de funcionamento do placar

void nextQuarter() {
  if (quarter <= 4 && minutesClock == 0 && secondsClock == 0) {
    quarter++;
    setFouls(true, 0);
    setFouls(false, 0);
    setTimeouts(true, 3);
    setTimeouts(false, 3);
    minutesClock = 10;
    secondsClock = 0;
    singleDigitRepresent(quarter, quarterStartingPin);
    gameClockDisplay.showNumberDecEx(100 * (minutesClock) + secondsClock, 0b01110000);
  } else {
    Serial.println("Next period not avaliable");
  }
}

void useTimeout(bool isHome) {
  if (isHome) {
    if (timeoutsHome >= 0) {
      timeoutsHome--;
      displayTimeouts(true);
    } else {
      Serial.println("Warning: Home team already out of timeouts");
    }
  } else {
    if (timeoutsVisitor >= 0) {
      timeoutsVisitor--;
      displayTimeouts(false);
    } else {
      Serial.println("Warning: Visitor team already out of timeouts");
    }
  }
}

void addScore(bool isHome) {
  if (isHome) {
    scoreHome++;
    scoreHomeDisplay.setNumber(scoreHome);
  } else {
    scoreVisitor++;
    scoreVisitorDisplay.setNumber(scoreVisitor);
  }
}
void addFoul(bool isHome) {
  if (isHome) {
    if (foulsHome < 4) {
      foulsHome++;
      singleDigitRepresent(foulsHome, foulsHomeStartingPin);
    } else {
      Serial.println("Warning: Home team over foul limit");
    }
  } else {
    if (foulsVisitor < 4) {
      foulsVisitor++;
      singleDigitRepresent(foulsVisitor, foulsVisitorStartingPin);
    } else {
      Serial.println("Warning: Visitor team over foul limit");
    }
  }
}

void setTimeouts(bool isHome, int value) {
  if (value <= 3) {
    if (isHome) {
      timeoutsHome = value;
      displayTimeouts(true);
    } else {
      timeoutsVisitor = value;
      displayTimeouts(false);
    }
  } else {
    Serial.println("Invalid timeouts value");
  }
}

void setScore(bool isHome, int value) {
  if (value >= 0) {
    if (isHome) {
      scoreHome = value;
      scoreHomeDisplay.setNumber(scoreHome);
    } else {
      scoreVisitor = value;
      scoreVisitorDisplay.setNumber(scoreVisitor);
    }
  } else {
    Serial.println("Invalid score value");
  }
}

void setFouls(bool isHome, int value) {
  if (value >= 0 && value <= 4) {
    if (isHome) {
      foulsHome = value;
      singleDigitRepresent(foulsHome, foulsHomeStartingPin);
    } else {
      foulsVisitor = value;
      singleDigitRepresent(foulsVisitor, foulsVisitorStartingPin);
    }
  } else {
    Serial.println("Invalid fouls value");
  }
}

void setQuarter(int value) {
  if (value >= 0 && value <= 4) {
    quarter = value;
    singleDigitRepresent(quarter, quarterStartingPin);
  } else {
    Serial.println("Invalid quarter value");
  }
}

//Métodos de funcionamento do relógio

void countdownGameClock() {
  gameClockDisplay.showNumberDecEx(100 * (minutesClock) + secondsClock, 0b01110000);
  if (isGameClockRunning) {
    if (secondsClock == 0) {
      if (minutesClock > 0) {
        setMinutesClock(minutesClock - 1);
        setSecondsClock(60);
      } else {
        buzzer();
        stopGame();
      }
    }
    //delay(999);
    setSecondsClock(secondsClock - 1);
  }
}

void countdownShotClock() {
  if (isShotClockRunning) {
    setShotClock(shotClock - 1);
    if (shotClock == 10 && !isShotClockUnderTen) {
      isShotClockUnderTen = true;
      shotClockInterval = 100;
      shotClock = 100;
    } else if (shotClock == 0) {
      buzzer();
      stopGame();
      isShotClockUnderTen = false;
      shotClockInterval = 1000;
    }

    
  }
}

void displayShotClock() {
  ones = shotClock % 10;
  tens = shotClock / 10;
  if (isShotClockUnderTen) {
    digitalWrite(shotClockDotPin, LOW);
    singleDigitRepresent(ones, shotClockOnesStartingPin);
    singleDigitRepresent(tens, shotClockTensStartingPin);
  } else {
    digitalWrite(shotClockDotPin, HIGH);
    singleDigitRepresent(ones, shotClockOnesStartingPin);
    singleDigitRepresent(tens, shotClockTensStartingPin);
  }
}

void clockStateChange() {
  if (isGameClockRunning) {
    stopGame();
  } else {
    isGameClockRunning = true;
  }
}

void stopGame() {
  isGameClockRunning = false;
  isShotClockRunning = false;
}

void resumeShotClock() {

  if (shotClock == 0) {
    shotClockReset(24);
  }
  isShotClockRunning = true;
  isGameClockRunning = true;
}

void shotClockReset(bool is24) {
  isShotClockRunning = false;
  isShotClockUnderTen = false;
  shotClockInterval = 1000;
  if (is24) {
    setShotClock(24);
  } else {
    setShotClock(14);
  }
}

void setSecondsClock(int value) {
  if (value >= 0 && value <= 60) {
    secondsClock = value;
  } else {
    Serial.println("Invalid seconds value");
  }
}
void setMinutesClock(int value) {
  if (value >= 0 && value <= 12) {
    minutesClock = value;
  } else {
    Serial.println("Invalid minutes value");
  }
}

void setShotClock(int value) {
  shotClock = value;
  displayShotClock();
}

//Método para a ativação dos segmentos correspondentes a um número
void singleDigitRepresent(int value, int startingDigit) {
  for (int i = 0; i <= 6; i++) {
    if (numbers[value][i]) {
      digitalWrite((i + startingDigit), LOW);
    } else {
      digitalWrite((i + startingDigit), HIGH);
    }
  }
}

//Método para ativação de LEDs de tempo técnico
void displayTimeouts(bool isHome) {
  if (isHome) {
    for (int i = 0; i < 3; i++) {
      if (i < timeoutsHome) {
        digitalWrite(timeoutsHomeStartingPin + i, LOW);
      } else {
        digitalWrite(timeoutsHomeStartingPin + i, HIGH);
      }
    }
  } else {
    for (int i = 0; i < 3; i++) {
      if (i < timeoutsVisitor) {
        digitalWrite(timeoutsVisitorStartingPin + i, LOW);
      } else {
        digitalWrite(timeoutsVisitorStartingPin + i, HIGH);
      }
    };
  }
}
//Método para a ativação do led de aviso e buzzer
void buzzer() {
  Serial.println("buzz");
  digitalWrite(ledPin, LOW);
  analogWrite(buzzerPin, 255);
  tone(buzzerPin,1500,500);
  delay(500);
  digitalWrite(ledPin, HIGH);
  analogWrite(buzzerPin, 0);
}



/*
//Código a ser usado em caso ausência de bibliotecas




//Método para a ativação dos segmentos correspondentes a um número
void represent(int value, int startingDigit) {
  for (int i = 0; i <= 6; i++) {
    if (numbers[value][i]) {
      digitalWrite((i + startingDigit), HIGH);
    } else {
      digitalWrite((i + startingDigit), LOW);
    }
  }
}

void displayMinutes(){
    ones = minutesClock%10;
    tens = minutesClock/10;

    
    //represent(ones,minutesClockOnesStartingPin);
    //represent(tens,minutesClockTensStartingPin);
    Serial.println(minutesClock);  
}

void displaySeconds(){
  ones = secondsClock%10;
  tens = secondsClock/10;
  if(secondsClock>=10){
    //represent(ones,secondsClockOnesStartingPin);
    //represent(tens,secondsClockTensStartingPin);
    
    Serial.println(secondsClock);
  }else{
    digitalWrite(dotPin, HIGH);
    for(int i=10; i>=0; i--){
      //represent(ones,secondsClockOnesStartingPin);
      //represent(i,secondsClockTensStartingPin);
      delay(99);
    }
  }
  
}

void countdownGameMinutesClock(){
  if(isGameClockRunning){
    
      displayMinutes();
      delay(59999);
      setMinutesClock(minutesClock-1);
    
  }
}

void countdownGameSecondsClock(){
  if(isGameClockRunning){
    
      displaySeconds();
      if(secondsClock == 0){ //Verifica se há expiração do relógio
      isGameClockRunning = false;
      }
      delay(999);
      setSecondsClock(secondsClock-1);
    
  }
}

void displayShotClock() {

  ones = shotClock % 10;
  tens = shotClock / 10;
  if (shotClock >= 10) {

    singleDigitRepresent(ones, shotClockOnesStartingPin);
    singleDigitRepresent(tens, shotClockTensStartingPin);
    digitalWrite(shotClockDotPin, HIGH);
    Serial.println(shotClock);
    //delay(999);

  } else {

    digitalWrite(shotClockDotPin, LOW);
    isShotClockUnderTen = true;
    digitalWrite(shotClockDotPin, HIGH);
  }
}

*/