import React, { Component } from 'react'
import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  Button

 } from 'react-native'
 import init from 'react_native_mqtt';
 import { AsyncStorage } from 'react-native';
 
 init({
   size: 10000,
   storageBackend: AsyncStorage,
   defaultExpires: 1000 * 3600 * 24,
   enableCache: true,
   reconnect: true,
   sync : {
   }
 });

const host = '52.00.00.00'
const port = '8883'
clientID = "clientId-" + parseInt(Math.random() * 100, 10)
const topic = 'AirMonitoring/humidity'
const topic1 = 'AirMonitoring/aircondition'
export default class TestScreen extends Component {

  constructor(){
    super();
    this.onMessageArrived = this.onMessageArrived.bind(this)
    this.onConnectionLost = this.onConnectionLost.bind(this)
    this.turnOn = this.turnOn.bind(this)
    this.turnOff = this.turnOff.bind(this)
    this.onConnect = this.onConnect.bind(this)
    this.MQTTconnect = this.MQTTconnect.bind(this);
    const client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onMessageArrived = this.onMessageArrived;
    client.onConnectionLost = this.onConnectionLost;
    client.MQTTconnect = this.MQTTconnect;
    client.connect({ 
   
      cleanSession : false, 
      onSuccess : this.onConnect, 
      userName: "user",
      password: "pass",
      onFailure : this.onConnectionLost, 

    });

    this.state = {
      message: [''],
      client,
      payload: [],
      isConnected: false,
    };

  }
  onMessageArrived(payload) {
    console.log("onMessageArrived:"+payload.payloadString);
    this.setState({message: [...this.state.message, payload.payloadString]});

  } 
  onConnect = () => {
    const { client } = this.state;
    console.log("Connected!!!!");
    this.setState({isConnected: true, error: ''}); 
    client.subscribe(topic1);
   
  };
  turnOff(){
    const message = new Paho.MQTT.Message("off");
    message.destinationName = "test/on";

    if(this.state.isConnected){
      this.state.client.send(message);    
    }else{
      this.connect(this.state.client)
        .then(() => {
          this.state.client.send(message);
          this.setState({error: '', isConnected: true});
        })
        .catch((error)=> {
          console.log(error);
          this.setState({error: error});
        });
  }
  }
  turnOn(){
    const message = new Paho.MQTT.Message("on");
    message.destinationName = "test/on";

    if(this.state.isConnected){
      this.state.client.send(message);    
    }else{
      this.connect(this.state.client)
        .then(() => {
          this.state.client.send(message);
          this.setState({error: '', isConnected: true});
        })
        .catch((error)=> {
          console.log(error);
          this.setState({error: error});
        });
  }
  }
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost : "+responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false});
    
        this.MQTTconnect();


    }
  }
  MQTTconnect() {
    const client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onMessageArrived = this.onMessageArrived;
    client.connect({ 
      
                onSuccess : this.onConnect,
              
                userName: "user",
                password: "pass",
                onFailure : this.onFailure, 
  
              
    });
  }

  componentDidMount() {
    this.MQTTconnect = this.MQTTconnect.bind(this);
  }
  

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>
          Welcome to React Native MQTT!
        </Text>
        <Text style={styles.instructions}>
          Message: {this.state.message[this.state.message.length - 1]}
        </Text>
        <Text style={{color: 'red'}}>
          {this.state.error}
        </Text>
        { this.state.isConnected ?
            <Text style={{color: 'green'}}>
              Connected
            </Text> : null
        }
         <TextInput
          value={this.state.messageToSend} 
          onChangeText={(value => this.setState({messageToSend: value}))} 
          placeholder="Type hereee..."
          style={styles.input} />
           <Button onPress={this.turnOff.bind(this) } style={{marginBottom: '45'}} title="off" />
           <Button onPress={this.turnOn.bind(this) } title="on" />
      
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'blue',
  },
  input:{
    width: 300
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


