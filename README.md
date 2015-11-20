# React Native Console Panel  
A Simple debug panel component to view console message right inside the app ,this will be helpful during your react native development.
This is a pure react native component ,you can use it in both ios and android .



**Xcode / Android Studio is not a must for React Native app development.**  
RN developers can simplify tool chain with this component when coding javascript only . You don't have to open Xcode , android studio or Chrome dev console for viewing js console message. A javascript editor and a emulator/device is all you need.

# Usage
### install from npm :  
`npm install --save react-native-console-panel`

### then in your app's entry component:  

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

### avaiable props:

```javascript
	propTypes:{
        limit:React.PropTypes.number,
        open:React.PropTypes.bool,
    }
```

# TO-DOs  
* Count unread log when panel is closing
* 'clear' button
* system infomation shapshot
* better looking?
* ...

**I'm new to Javascript . Any pull requests is welcomed!**
