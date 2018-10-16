import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Platform,
  BackHandler
} from 'react-native';
import StackNavigator from './router/StackNavigator';
import { Provider } from 'react-redux';
import store from './src/redux/store';
// import ReconnectingWebSocket from 'reconnecting-websocket';

console.disableYellowBox = true;
console.warn('YellowBox is disabled.');


export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      lastBackPressed: 0
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.BackHandler);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.BackHandler);
    }
  }


  //  物理返回键 事件触发
  BackHandler = () => {
    if (this.state.lastBackPressed && this.state.lastBackPressed + 2000 >= Date.now()) {
      BackHandler.exitApp()
      return false
    }
    this.state.lastBackPressed = Date.now()
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
    return true
  }

  render() {
    return (
      <Provider store={store}>
        <View style={styles.app}>
          <StackNavigator />
        </View>
      </Provider>
    );
  }
}


const styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'row'
  }
});


global.beforeRouter = 'https://street.li-go.com/';
//  数据请求路径
global.getURL = beforeRouter+'public/index.php/shopping/Shopmanagement/';

//  图片路径
global.shopImg = beforeRouter+'public/static/images/';
  
//  注册路径
global.regPath = beforeRouter+'public/index.php/shopping/Registration/'

//  长连接地址
global.websocktPath = 'ws://street.li-go.com:8868/Merchat';
//  版本号
global.APPVersion = '1.0.0';


//  价格补全
global.getFloatStr = (num) => {
  num += '';
  num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  
  if (/^0+/) //清除字符串开头的0  
    num = num.replace(/^0+/, '');
  if (!/\./.test(num)) //为整数字符串在末尾添加.00  
    num += '.00';
  if (/^\./.test(num)) //字符以.开头时,在开头添加0  
    num = '0' + num;
  num += '00';        //在字符串末尾补零  
  num = num.match(/\d+\.\d{2}/)[0];
  return num
};


//  获取订单状态
global.getOrderState = (s) => {
  if (s == 1) {
    return '已下单'
  } else if (s == 2) {
    return '已接单'
  } else if (s == 3) {
    return '已结单'
  } else if (s == 4) {
    return '退单中'
  } else {
    return '已退单'
  }
}

//  获取订单类型
global.getOrderType = (v) => {
  if (v == 1) {
    return '桌上点餐'
  } else if (v == 2) {
    return '预定点餐'
  } else if (v == 3) {
    return '线上点餐'
  } else if (v == 4) {
    return '前台点餐'
  } else {
    return '其他点餐'
  }
}

//  获取运输状态
global.getTransportState = (v) => {
  if (v == 0) {
    return '待出货'
  } else if (v == 1) {
    return '出货中'
  } else if (v == 2) {
    return '运输中'
  } else if (v == 3) {
    return '配送中'
  } else if (v == 4) {
    return '已接收'
  } else {
    return '已退货'
  }
}

//  数据流
global.formdata = (d) => {
  let fd = new FormData()
  for (let i in d) {
    fd.append(i, d[i])
  }
  return fd
}

//  价格数字验证
global.validate = (num) => {
  var reg = /^\d+(?=\.{0,1}\d+$|$)/
  return reg.test(num);
}

//  去空格
global.Trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//  数组编号排序
global.sortDown = (x, y) => {
  return (x.goods_id < y.goods_id) ? -1 : 1
}

//  时间排序
global.sortTime = (x, y) => {
  return (x.date < y.date) ? 1 : -1
}

//  下拉刷新的提示颜色
// global.refreshColor = ['#0aa394', '#00ff00', '#0000ff']
// global.refreshColor = ['#0aa394']
global.refreshColor = ['#222']


// 号码验证
global.checkPhone = (num) =>{
  let reg = /^1[3456789]\d{9}$/
  return reg.test(num);
}
