/**
 * Created by sospartan on 11/18/15.
 */

'use strict';

var React = require("react-native");
var {
    View,
    Text,
    StyleSheet,
    PanResponder,
    TouchableWithoutFeedback
    } = React;

const PANEL_BACKGROUND = 'rgba(51,72,94,0.6)';
const PANEL_BACKGROUND_SELECTED = 'rgba(51,72,94,0.9)';


var styles = StyleSheet.create({
    container:{
        top: 0,
        left: 0,
        right: 0,
        width:200,
        position:'absolute',
        backgroundColor:PANEL_BACKGROUND,
    },
    bar:{
        backgroundColor:'rgba(128,128,128,0.4)',
        padding:2,
    },
    barText:{
        fontSize:12,
        color:'white',
        marginLeft:6,
    },
    btn:{
        position:'absolute',
        right:0,
        top:0,
        backgroundColor:'black',
        padding:2,
    },
    btnText:{
        fontSize:12,
        color:'white',
    },
    content:{
        padding:2,
    },
    contentText:{

        fontSize:10
    },
    log:{
      color:'lime',
    },
    debug:{
        color:'skyBlue',
    },
    info:{
        color:'white'
    },
    warn:{
        color:'peachPuff',
    },
    error:{
        color:'tomato',
    },
    touchOverlay:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:'transparent'
    }
});

var component = React.createClass({
    propTypes:{
        limit:React.PropTypes.number,
        open:React.PropTypes.bool,
    },
    getDefaultProps:()=>{
        return {
            limit:10,
            open:true,
        };
    },
    getInitialState:function(){
        return {
            dataSource:consolePanelStack.data,
            isOpen:this.props.open,
        };
    },
    _pickStyle:(level)=>{
        switch(level){
            case 'warn':
                return styles.warn;
            case 'error':
                return styles.error;
            case 'info':
                return styles.info;
            case 'debug':
                return styles.debug;
            case 'log':
                return styles.log;
            default:
                return null;
        }
    },
    _panResponder:{},
    panel:null,
    panelStyle:{left:0,top:0},
    _onStartShouldSetPanResponder: function(evt,gestureState){
        return true;
    },
    _onMoveShouldSetPanResponder: function(evt,gestureState){
        return true;
    },
    _onPanResponderGrant: function(evt,gestureState){
        this.panel.setNativeProps({style:{backgroundColor:PANEL_BACKGROUND_SELECTED}});
    },
    _onPanResponderMove: function(evt,gestureState){
        this.panel.setNativeProps({style:{left:this.panelStyle.left+gestureState.dx,top:this.panelStyle.top+gestureState.dy}});
    },
    _onPanResponderEnd:function(evt,gestureState){
        this.panelStyle.left += gestureState.dx;
        this.panelStyle.top += gestureState.dy;
        this.panel.setNativeProps({style:{backgroundColor:PANEL_BACKGROUND}});
    },
    componentWillMount:function(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._onStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
            onPanResponderGrant: this._onPanResponderGrant,
            onPanResponderMove: this._onPanResponderMove,
            onPanResponderRelease: this._onPanResponderEnd,
            onPanResponderTerminate: this._onPanResponderEnd,
        });
    },
    componentDidMount:function(){
        consolePanelStack.bindUpdateListener(()=>{
            this.setState({dataSource:consolePanelStack.data.slice(0,this.props.limit)});
        });
        console.log(Object.keys(this.panel.props.style));
        this.panelStyle.left = this.panel.props.style[1].left;
        this.panelStyle.top = this.panel.props.style[1].top;
    },
    render:function(){
        var content = [];
        for(let row of this.state.dataSource){
           content.push(<Text style={[this._pickStyle(row.level),styles.contentText]}>{row.text}</Text>) ;
        }
        return (
            <View
                ref={(ref)=>this.panel=ref}
                {...this.props} style={[styles.container,this.props.style]} >
                <View style={styles.bar} >
                    <Text style={styles.barText}>console</Text>
                </View>
                <View style={styles.content}>
                {this.state.isOpen?content:null}
                </View>
                <View style={styles.touchOverlay} {...this._panResponder.panHandlers}/>
                <View style={styles.btn}>
                    <TouchableWithoutFeedback  onPress={()=>this.setState({isOpen:!this.state.isOpen})}>
                        <Text style={styles.btnText}>{this.state.isOpen?'close':'open'}</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
});



(function(global){
    var ConsoleStack = function(limit:number){
        this.limit = limit;
        this.data = [];
        this.listeners = [];
        this.waiting = false;
    }

    function timestamp(){
        var d = new Date();
        var formatter = (len)=>{
            return (input)=>{
                var str = String(input);
                var strLen = str.length;
                return '0'.repeat(len-strLen)+input;
            }
        };
        let f2 = formatter(2);
        return f2(d.getHours())
            +':'+f2(d.getMinutes())
            +':'+f2(d.getSeconds())
            +'.'+formatter(3)(d.getMilliseconds());
    }

    ConsoleStack.prototype.add = function(type,obj){
        var raw = timestamp()+'('+type.substr(0,1).toUpperCase()+'):'+formatToString(obj);
        if(this.data.unshift({level:type,text:raw})>this.limit){
            this.data.pop;
        }
        if(this.waiting){
           return;
        }
        this.timeout = setTimeout(()=>{

            for(let callback of this.listeners){
                callback();
                clearTimeout(this.timeout);
                this.waiting = false;
            }
        },500);
        this.waiting = true;
    }

    ConsoleStack.prototype.toString = function(){
        return formatToString(this.data);
    }

    ConsoleStack.prototype.bindUpdateListener = function(callback){
        this.listeners.push(callback);
    }


    function formatToString(obj){

        if(obj=== null || obj === undefined ||typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'function' ){
            return '"'+String(obj)+'"';
        }else if(obj instanceof Date){
            return 'Date('+obj.toISOString()+')';
        }else if(Array.isArray(obj)){
           return 'Array('+obj.length+')[' + obj.map((elem,i)=>{formatToString(elem)}).join(',')+']';
        }else if(obj.toString){
            return 'object{'+obj.toString()+'}';
        }else{
            return 'unknown data';
        }
    }



    function proxyStockConsole(console,consoleStack){
        const methods = ['log','debug','error','info','warn'];

        for(let m of methods){
            var stockM = console[m];
            var newName = '_'+m;
            if(console[newName]){
                continue;
            }
            console[newName] = stockM;
            console[m] = function(){
                consoleStack.add(m,arguments[0]);
                stockM.apply(this,arguments)
            };
        }
    }

    if(!global.consolePanelStack){

        global.consolePanelStack = new ConsoleStack(50);
        proxyStockConsole(global.console,consolePanelStack);
    }
})(this);


module.exports = {
    Panel:component
};