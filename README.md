# React Native Console Panel  
A Simple debug panel component to view console message right inside the app.  
This will be helpful during your react native development.
This is a pure react native component ,you can use it in both ios and android .

**Xcode / Android Studio is not a must for React Native app development.**  
RN developers can simplify tool chain with this component when coding javascript only.  
You don't have to open any of Xcode , Android Studio or Chrome dev console for viewing js console message. A javascript editor and a emulator/device are all you need.

## Usage
### Install from npm :  
`npm install --save react-native-console-panel`

### Integrate into your app:  

```javascript
//import the component
var ConsolePanel = require('react-native-console-panel').Panel;
...
render:function(){
	return (
		<View style={styles.container}>
        	...
        	<TouchableHighlight style={styles.btn} onPress={this._onPressButton}>
          	<Text>
            Hit me!
          	</Text>
        	</TouchableHighlight>
        
        	//Panel will float above your content
        	//use top,left to control panel's position 
        	<ConsolePanel limit={10} style={{left:20,top:20}}/>
      </View>
      );
```
Now, when you use 'console' to print something , it will be like this:  
![screenshot](path/or/url/to.jpg )

### Avaiable props:

```javascript
	propTypes:{
        limit:React.PropTypes.number,
        open:React.PropTypes.bool,
    }
```

## TO-DOs  
* Count unread log when panel is closing
* 'clear' button
* System infomation shapshot
* Better looking?
* ...

**I'm new to Javascript .So any pull request is welcomed!**