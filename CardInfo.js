  
import React, { Component } from 'react'
import { FlatGrid } from 'react-native-super-grid'
import { StyleSheet, Text, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
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
const topic2 = 'AirMonitoring/temperature'
const topic3 = 'EnergyMonitoring/energy'

export default class CardInfo extends Component {

  constructor(){
    super();
    this.onMessageArrived = this.onMessageArrived.bind(this)
    this.onConnectionLost = this.onConnectionLost.bind(this)
    this.onFailure = this.onFailure.bind(this)
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
                onFailure : this.onFailure, 
    });

    this.state = {
      message: [''],
      client,
      payload: [],
      items: [],
      humidity: [],
      airCondition: [],
      temperature: [],
      energy: [],
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
                timeout: 30
  
              
    });
  }

  onMessageArrived(payload) {
    
    this.setState({message: [...this.state.message, payload.payloadString]});

    if(payload.destinationName === 'AirMonitoring/humidity')
    { this.setState({humidity: payload.payloadString}) } 
    if(payload.destinationName === 'AirMonitoring/aircondition')
    { this.setState({airCondition: payload.payloadString}) } 
    if(payload.destinationName === 'AirMonitoring/temperature')
    { this.setState({temperature: payload.payloadString}) } 
    if(payload.destinationName === 'EnergyMonitoring/energy')
    { this.setState({energy: payload.payloadString}) } 
    

    this.setState({items: [
      { name: 'Température', code: this.state.temperature + " ° C", icon: "thermometer" },
      { name: 'Humidité', code: this.state.humidity + ' %', icon: 'droplet'},
      { name: 'Concentrations en CO2', code: this.state.airCondition + ' ppm', icon: 'wind' },
      { name: 'Energie consommée', code: this.state.energy + " kwh", icon: 'zap' }]})
      console.log("Humidity : "+this.state.humidity)
      console.log("Temperature : "+this.state.temperature)
      console.log("Co2 : "+this.state.airCondition)
  } 
  onConnect = () => {
    const { client } = this.state;
    console.log("Connected!!!!");
    this.setState({isConnected: true, error: ''});
    client.subscribe(topic, qos=1);
    client.subscribe(topic1, qos=1);
    client.subscribe(topic2, qos=1);
    client.subscribe(topic3, qos=1);
    
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
             <View>
                  <FlatGrid
                    itemDimension={130}
                    data={this.state.items}
                    style={styles.gridView}
                    spacing={10}
                    renderItem={({ item }) => (
                      <View style={styles.container}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.text}>{item.code}</Text>
                      <View style={styles.iconContainer}>
                    <Feather name={item.icon} size={22} style={styles.icon} /> 
                      </View>
                      </View>
                                 )}
                  />
             </View>
          );
        }
      }
  const styles = StyleSheet.create({

          gridView: {

            marginTop: 255,
            marginBottom: -750,
            flex: 1,
            marginLeft: 27
          },
        
          container: {

            justifyContent: 'flex-end',
            width: 144,
            height: 102,
            backgroundColor: '#fff',
            borderRadius: 15, 
          },
          title : {
         
            fontWeight: '400',
            fontStyle: 'normal', 
            fontSize: 12,
            lineHeight: 14.55,
            textAlign: 'center',
            marginBottom: 20, 
          },
          text : {

            marginRight: 'auto',
            marginLeft: 'auto',
            fontWeight: '400',
            fontStyle: 'normal', 
            fontSize: 13,
            lineHeight: 14.55,
            textAlign: 'center',
            color: '#8A868D',
            marginBottom: 23
          },
          iconContainer : {
          
            position: 'absolute',
            width: 42,
            height: 40,
            left: 109,
            top: 65,
            right: 244,
            backgroundColor: '#EBC30C',
            borderTopLeftRadius: 15,
            borderBottomEndRadius: 15
          },
          icon : {

           color: '#fff',
           position: 'absolute',
           left: 11,
           top: 8
          }
        
        });
     

*/