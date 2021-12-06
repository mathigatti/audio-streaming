char dataString[50] = {0};

void setup() {
  Serial.begin(9600); //Starting serial communication
}

void loop() {
  sprintf(dataString,"%02X",0); // convert a value to hexa 
  Serial.println(dataString); // send the data
  delay(5000);
  for (int i = 0 ; i < 5; i++) {
    sprintf(dataString,"%02X",1);
    Serial.println(dataString);
    delay(10000);
  }
}