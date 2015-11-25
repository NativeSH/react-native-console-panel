/**
 * index.js
 * Copyright (c) 2015 Alibaba Group Holding Limited
 * Authors:
 *  sospartan <sospartan@alibaba-inc.com> (https://github.com/sospartan)
 *
 * This file is part of react native console panel.
 *
 * react native console panel is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * react native console panel is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with react native console panel.  If not, see <http://www.gnu.org/licenses/>.
 */

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
        top: 10,
        left: 10,
        right: 0,
        width:200,
        position:'absolute',
        backgroundColor:PANEL_BACKGROUND,
    },
    bar:{
        backgroundColor:'rgba(128,128,128,0.4)',
    },
    barText:{
        fontSize:12,
        color:'white',
        marginLeft:6,
    },
    bottomBarBtnText:{
        color:'white',
        fontSize:10,
        alignSelf:'flex-end',
    },
    btn:{
        position:'absolute',
        right:0,
        top:0,
        backgroundColor:'black',
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

var ConsolePanel = React.createClass({
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
            dataSource:[],
            isOpen:this.props.open,
            unreadCount:0,
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
    _resetPosition:function(){
        this.panelStyle.left = 0;
        this.panelStyle.top = 0;
        this.panel.setNativeProps({style:{left:0,top:0}});
    },
    _onPanResponderEnd:function(evt,gestureState){
        this.panelStyle.left += gestureState.dx;
        this.panelStyle.top += gestureState.dy;
        this.panel.setNativeProps({style:{backgroundColor:PANEL_BACKGROUND}});
    },
    componentWillMount:function(){
        if(!global.consolePanelStack){
            _setup(global,false);
        }

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
            this.setState({
                dataSource:consolePanelStack.getData(this.props.limit),
                unreadCount:consolePanelStack.getUnreadCount()
            });
        });
        this.panelStyle.left = this.panel.props.style[1]?this.panel.props.style[1].left:10;
        this.panelStyle.top = this.panel.props.style[1]?this.panel.props.style[1].top:10;
    },
    _clearAll:function(){
        consolePanelStack.clear();
        if(this.panelStyle.left<0||this.panelStyle.top<0){
            this._resetPosition();
        }
    },
    render:function(){
        var content = [];
        if(this.state.isOpen) {
            for (let row of this.state.dataSource) {
                content.push(<Text style={[this._pickStyle(row.level),styles.contentText]}>{row.text}</Text>);
            }
            if (this.state.dataSource.length < 3) {
                content.push(<Text
                    style={[styles.log,styles.contentText]}>{String('\n'.repeat(3 - this.state.dataSource.length))}</Text>);
            }
        }
        return (
            <View
                ref={(ref)=>this.panel=ref}
                {...this.props} style={[styles.container,this.props.style]} >
                <View style={styles.bar} >
                    <Text style={styles.barText}>Console{this.state.unreadCount>0?'('+this.state.unreadCount+')':null}</Text>
                </View>
                {this.state.isOpen?
                    <View style={styles.content}>
                        {content}
                    </View>:null}
                <View style={styles.touchOverlay} {...this._panResponder.panHandlers}/>
                {this.state.isOpen?<View style={styles.bar}>
                    <TouchableWithoutFeedback onPress={this._clearAll}>
                        <Text style={styles.bottomBarBtnText}>clear</Text>
                    </TouchableWithoutFeedback>
                </View>:null}
                <View style={styles.btn}>
                    <TouchableWithoutFeedback  onPress={()=>{
                        consolePanelStack.enableUnreadCount(this.state.isOpen);
                        consolePanelStack.resetUnreadCount();
                        this.setState({
                            isOpen:!this.state.isOpen,
                            unreadCount:0
                        });
                    }
                    }>
                        <Text style={styles.btnText}>{this.state.isOpen?'close':' open'}</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
});


var _setup = function(_global,_keepYellowBox) {
    (function (global, keepYellowBox) {
        var ConsoleStack = function (limit:number) {
            this.limit = limit;
            this.data = [];
            this.listeners = [];
            this.waiting = false;
            this.unreadEnabled = false;
            this.unreadCount = 0;
        }

        function timestamp() {
            var d = new Date();
            var formatter = (len)=> {
                return (input)=> {
                    var str = String(input);
                    var strLen = str.length;
                    return '0'.repeat(len - strLen) + input;
                }
            };
            let f2 = formatter(2);
            return f2(d.getHours())
                + ':' + f2(d.getMinutes())
                + ':' + f2(d.getSeconds())
                + '.' + formatter(3)(d.getMilliseconds());
        }

        ConsoleStack.prototype.clear = function () {
            this.data.splice(0, this.data.length);
            this.notifyListeners();
        }

        ConsoleStack.prototype.notifyListeners = function () {
            if (this.waiting) {
                return;
            }
            this.timeout = setTimeout(()=> {

                for (let callback of this.listeners) {
                    callback();
                    clearTimeout(this.timeout);
                    this.waiting = false;
                }
            }, 500);
            this.waiting = true;
        }

        ConsoleStack.prototype.add = function (type, obj) {
            var raw = timestamp() + '(' + type.substr(0, 1).toUpperCase() + '):' + limitString(formatToString(obj),2,150);
            if (this.data.unshift({level: type, text: raw}) > this.limit) {
                this.data.pop;
            }
            this.notifyListeners();
            if (this.unreadEnabled) {
                this.unreadCount++;
            }
        }

        ConsoleStack.prototype.toString = function () {
            return formatToString(this.data);
        }

        ConsoleStack.prototype.getData = function (limit) {
            return this.data.slice(0, limit);
        }

        ConsoleStack.prototype.bindUpdateListener = function (callback) {
            this.listeners.push(callback);
        }

        ConsoleStack.prototype.getUnreadCount = function () {
            return this.unreadCount;
        }

        ConsoleStack.prototype.enableUnreadCount = function (enable) {
            this.unreadEnabled = enable;
        }

        ConsoleStack.prototype.resetUnreadCount = function () {
            this.unreadCount = 0;
        }

        function limitString(input,lineLimit,charLimit){
            let changed = input.length>charLimit;
            input = input.substr(0,charLimit);
            let lines = input.split('\n');
            if(lines.length>lineLimit){
                changed = true;
                lines.splice(lineLimit,lines.length-lineLimit);
            }
            let newContent = lines.join('\n');
            return newContent+(changed?'...':'');
        }


        function formatToString(obj) {

            if (obj === null || obj === undefined || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'function') {
                return '"' + String(obj) + '"';
            } else if (obj instanceof Date) {
                return 'Date(' + obj.toISOString() + ')';
            } else if (Array.isArray(obj)) {
                return 'Array(' + obj.length + ')[' + obj.map((elem)=>formatToString(elem)) + ']';
            } else if (obj.toString) {
                return 'object{' + obj.toString() + '}';
            } else {
                return 'unknown data';
            }
        }


        function proxyStockConsole(console, consoleStack, keepYellow) {
            //disable yellowbox added in v0.16
            if (keepYellow === false ) {
                console.disableYellowBox = true;
            }
            const {log,error,info,warn} = console;

            const proxy = (f,name)=>{
                console[name] = function(){
                    consoleStack.add(name, arguments[0]);
                    f.apply(console, arguments)
                };
                console['_'+name] = f;
            };
            proxy(log,'log');
            proxy(warn,'warn');
            proxy(error,'error');
            proxy(info,'info');

        }

        if (!global.consolePanelStack) {
            let consolePanelStack = new ConsoleStack(50);
            global.consolePanelStack = consolePanelStack;
            proxyStockConsole(global.console, consolePanelStack, keepYellowBox);
        }
    })(_global, _keepYellowBox);
};




module.exports = {
    keepYellowbox:()=>{
        _setup(this,true);
        return {
            Panel:ConsolePanel,
            displayWhenDev:()=>__DEV__?<ConsolePanel/>:null,
            displayIgnoreDevVariable:()=><ConsolePanel/>
        };
    },
    Panel:ConsolePanel,
    displayWhenDev:()=>{
        _setup(this,false);
        return __DEV__?<ConsolePanel/>:null;
    },
    displayIgnoreDevVariable:()=>{
        _setup(this,false);
        return <ConsolePanel/>
    },
};