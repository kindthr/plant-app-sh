import React, { Component } from 'react'
import { StyleSheet , ImageBackground, Text, View } from 'react-native'
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
const topic = 'EnergyMonitoring/current'
const topic1 = 'EnergyMonitoring/voltage'
const topic2 = 'EnergyMonitoring/power'
const reconnectTimeout = 3000;

export default class CardContent extends Component {

  constructor(){
    super();
    this.onMessageArrived = this.onMessageArrived.bind(this)
    this.onConnectionLost = this.onConnectionLost.bind(this)
    this.MQTTconnect = this.MQTTconnect.bind(this);
    this.onConnect = this.onConnect.bind(this)
    this.onFailure = this.onFailure.bind(this)
    const client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onMessageArrived = this.onMessageArrived;
    client.onFailure = this.onFailure;
    client.MQTTconnect = this.MQTTconnect;
    client.connect({ 
                
                onSuccess : this.onConnect, 
                userName: "user",
                password: "pass",
                onFailure : this.onFailure, 
          
  
              
    });

    this.state = {
      message: [''],
      client,
      payload: [],
      items: [],
      current: [],
      voltage: [],
      power: [],
      messageToSend:'',
      isConnected: false,
    };

  }

  componentDidMount() {
    this.MQTTconnect = this.MQTTconnect.bind(this);
  }
  onFailure(responseObject) {
    if (responseObject.errorCode !== 0) {
    console.log("Connection Attempt to host"+ host +" Failed");
    //setTimeout(this.MQTTconnect, 2000);
  }
  }
  MQTTconnect() {
    const client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onMessageArrived = this.onMessageArrived;
    client.connect({ 
      
                onSuccess : this.onConnect,
              
                userName: "admin",
                password: "admin",
                onFailure : this.onFailure, 
  
              
    });
  }

  onMessageArrived(payload) {
    console.log("onMessageArrived:"+payload.payloadString);
    this.setState({message: [...this.state.message, payload.payloadString]});

    if(payload.destinationName === 'EnergyMonitoring/current')
    { this.setState({current: payload.payloadString}) } 
    if(payload.destinationName === 'EnergyMonitoring/voltage')
    { this.setState({voltage: payload.payloadString}) } 
    if(payload.destinationName === 'EnergyMonitoring/power')
    { this.setState({power: payload.payloadString}) }     

    this.setState({items: [
      { name: 'Courant', value: this.state.current, unit: ' a', color: '#35EB00' },
      { name: 'Tension', value: this.state.voltage, unit: ' V', color: '#E92626' },
      { name: 'Puissance', value: this.state.power, unit: ' W', color: '#FFD204' }
    ]})
      console.log("Courant : "+this.state.current)
      console.log("Voltage : "+this.state.voltage)
      console.log("Power : "+this.state.power)
  } 
  onConnect = () => {
    const { client } = this.state;
    console.log("Connected!!!!");
    this.setState({isConnected: true, error: ''});
    client.subscribe(topic, qos=1);
    client.subscribe(topic1, qos=1);
    client.subscribe(topic2, qos=1);
  };

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost : "+responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false});
      this.MQTTconnect();
   
    }
  }


  render() {
 
 
        return (

        <>
      <ImageBackground
                style={styles.tinyHeader}
                source={require('../assets/images/centralHeader.jpg')}
                >

                </ImageBackground>
                <Text style={styles.title}> Centrale de mesure</Text>
              
                  <View style={styles.container1}></View>
                  <View style={styles.container}></View>
                  {/* Add map here */}
                  {this.state.items.map(item =>(<View key={Math.random()}>
                  <View style={{ width: 13,
                          height: 3,
                          top: 186,
                          left: 105,
                          backgroundColor: item.color}} ></View>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                  <Text style={styles.unit}>{item.unit}</Text>
                  </View>)
                      )}
             <Text style={styles.title1}> Energie consommée</Text>
           
      </>

    
       
    )
                  }
}

const styles = StyleSheet.create({
    tinyHeader : {
      position: 'absolute',
      width: 469,
      height: 313,
      top: -120
    },
    title : {
      position: 'absolute',
      top: 213,
      left: 42,
      fontSize: 24,
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 28,
      textAlign: 'center',
      color: '#56365C'
    },
    title1 : {
        position: 'absolute',
        top: 390,
        left: 42,
        fontSize: 24,
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 28,
        textAlign: 'center',
        color: '#56365C'
      },
    container : {
    
      width: 259,
      height: 104,
      left: 62,
      top: 267,
      backgroundColor: '#fff',
      borderRadius: 20
    },
    container1 : { 
      position: 'absolute',
      width: 259,
      height: 104,
      left: 68,
      top: 272,
      backgroundColor: 'rgba(206, 59, 237, 0.2)',
      borderRadius: 20
    },
   

    text : { 
      left: 130,
      top: 175,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: 17,
      marginBottom: -10
     
    },
    value : { 
      left: 215,
      top: 166,
      marginBottom: -10
    },
    unit : {
      fontWeight: 'bold',
      fontSize: 14,
      left: 265,
      top: 156,
      marginBottom: -10
       }
  })
  
        {/** { data.map(item =>(<>
                    <Text
                        key={item}
                        style={{
                            fontFamily: "RobotoBold",
                            color: "#272f49",
                            paddingLeft: 75,
                            fontSize: 16,
                        }}
                >
                 {item.Temperature} a
                </Text>
            </>)
            )}
    )
}*/} 