/**
 * Base On Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var ConsolePanel = require('react-native-console-panel').Panel;

var consolepanel = React.createClass({
  componentWillMount:()=>{
    console.log('componentWillMount');
  },
  _onPressButton:()=>{
    var r = Math.round(Math.random()*10/2);
    switch(r){
      case 0:
        console.log('Button Hit!');
        break;
      case 1:
        console.warn('Button Hit!');
        break;
      case 2:
        console.error('Button Hit!');
        break;
      case 3:
        console.info('Button Hit!');
        break;
      default:
        console.debug('Button Hit!');
        break;
    }
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
        <TouchableHighlight style={styles.btn} onPress={this._onPressButton}>
          <Text>
            Hit me!
          </Text>
        </TouchableHighlight>
        <ConsolePanel limit={10} style={{left:20,top:20}}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  btn:{
    width:100,
    height:50,
    backgroundColor:'grey',
    alignItems:'center',
    justifyContent:'center'
  }
});

AppRegistry.registerComponent('consolepanel', () => consolepanel);
