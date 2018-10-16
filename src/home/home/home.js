import React, { Component } from 'react';
import {
    Text,
    View,
    Linking,
    ToastAndroid,
    ScrollView,
    TouchableNativeFeedback,
    RefreshControl,
    Alert,
    Vibration,
    NativeModules,
    AsyncStorage
} from 'react-native';
import styles from './style.js';
import { StackNavigator } from 'react-navigation';
import Sound from 'react-native-sound';
import { connect } from 'react-redux';
import {
    setNewOrder,
    setDoneOrder,
    setCleanWare,
    setTableDelivery,
    isRefreshing,
    setShopInfo,
    isLogin,
    getNotice,
    appVersion
} from '../../redux/actions';
import ReconnectingWebSocket from 'reconnecting-websocket';
import HeaderFun from './child-components/HeaderFun';
import DataList from './child-components/DataList';
import Empty from '../../global/components/empty/index';
import preventDoublePress from '../../global/preventDoublePress';
import { empty } from '../../global/global';
import headerRightIcon from '../../global/components/headerRightIcon/style';

//  数组排序
function down(x, y) {
    return (x.number < y.number) ? 1 : -1
}

//  反向数组排序
function reseverdown(x, y) {
    return (x.number > y.number) ? 1 : -1
}

//  首页
class HomeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: 0,
            printOpcity: true,
            webSocketKey: null,
            sockTime: 3
        }
    }

    //  头部导航
    static navigationOptions = ({ navigation }) => ({
        
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#aaa', true)}
                onPress={() => preventDoublePress.onPress(() => navigation.state.params.search())}>
                <View style={headerRightIcon.headRightView}>
                    <Text style={headerRightIcon.headRightIcon}>&#xe627;</Text>
                </View>
            </TouchableNativeFeedback>
        ),
        tabBarLabel: 4
    });



    /* 生命周期  节点动态渲染 */
    componentDidMount = () =>{
        this.props.dispatch(isRefreshing(true))
        this.getLoginState()
        this.props.navigation.setParams({search: this.search})
        //  定时器 六十秒内容没有介绍到内容就刷新数据
        this.setSockTime = setInterval(() => {
            this.getNewData()
        }, 60000);
        
    }
    componentWillUnmount = () => {
        this.setSockTime && clearInterval(this.setSockTime);
    }
    //  长连接
    setWebSocket(ws) {
        webSockConnect.onopen = (e) => {
            //  连接成功
            this.sockconnect()
            ToastAndroid.show('长连接成功', ToastAndroid.SHORT);
        }
        webSockConnect.onmessage = (e) => {
            // 接收到了一个消息
            Vibration.vibrate(400, true);
            const s = new Sound(require('../../static/mp3/3.wav'), (e) => {
                if (e) {
                    console.log('播放失败' + JSON.stringify(e));
                    return;
                }
                s.play(() => s.release());
            });
            ToastAndroid.show('新订单来啦', ToastAndroid.SHORT);
            if (JSON.parse(e.data).data.state == 2) {
                //  如果订单状态为2(已接单) 则添加到代收餐具
                this.props.counter.cleanWare.unshift(JSON.parse(e.data).data)
                this.props.dispatch(setCleanWare(this.props.counter.newOrder))
            } else {
                //  否则添加到新订单
                this.props.counter.newOrder.unshift(JSON.parse(e.data).data)
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
            }
        }
        webSockConnect.onclose = (c, e) => {
            ToastAndroid.show('长连接已关闭', ToastAndroid.SHORT);
            if (this.props.counter.isLogin) {
                webSockConnect.onopen = (e) => {
                    //  连接成功
                    this.sockconnect()
                    ToastAndroid.show('长连接成功', ToastAndroid.SHORT);
                }
            }
        }
    }
    //  长连接请求钥匙
    sockconnect() {
        fetch(getURL + 'IsLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((res) => {
                this.props.dispatch(isRefreshing(false))
                if (res.error == 0) {
                    //  长连接
                    webSockConnect.send(res.webSocket)
                    this.getNewData()
                    this.fetch()
                }
            }).catch((error) => {
                this.getNewData()
                this.fetch()
                ToastAndroid.show('长连接异常', ToastAndroid.SHORT);
            })
    }
    //  获取登录状态
    getLoginState() {
        fetch(getURL + 'IsLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((res) => {
                this.props.dispatch(isRefreshing(false))
                if (res.error == 0) {
                    this.props.dispatch(isRefreshing(false))
                    this.props.dispatch(isLogin(true))
                    //  连接打印机
                    AsyncStorage.getItem('blueAddress', (error, value) => {
                        if (value != null) {
                            //获取已配对的蓝牙列表
                            NativeModules.BluetoothPrinterModule.ReturnBluetoothDevice((bluetoothList) => {
                                for (let i in bluetoothList) {
                                    if (bluetoothList[i].address == value) {
                                        NativeModules.BluetoothPrinterModule.SetBluetooth(value)
                                    }
                                }
                            })
                        }
                    });
                    this.getNewData()
                    if (!window.webSockConnect) {
                        global.webSockConnect = new ReconnectingWebSocket(websocktPath);
                    }
                    this.setWebSocket()
                    this.fetch()
                } else if (res.error == 10) {
                    this.props.dispatch(isRefreshing(false))
                    this.props.dispatch(isLogin(true))
                } else {
                    this.props.navigation.navigate('Login');
                }
            }).catch((error) => {
                this.props.dispatch(isRefreshing(false))
                this.getNewData()
                this.fetch()
                ToastAndroid.show('网络异常', ToastAndroid.SHORT);
            })
    }

    //  获取最新订单
    getNewData() {
        fetch(getURL + 'GetOrderList1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                res.data = res.data.sort(sortTime)
                this.props.dispatch(setNewOrder(Object.assign([], res.data)))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
    }

    //  数据请求
    fetch() {
        //  获取店铺信息
        fetch(getURL + 'GetShop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    this.props.dispatch(setShopInfo(res.data))
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
            })
        //  获取已完成订单
        fetch(getURL + 'GetOrderList3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: 1
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                res.data = res.data.sort(sortTime)
                this.props.dispatch(setDoneOrder(res.data.data))
            } else if (res.error == 1000) {
                ToastAndroid.show(res.data,ToastAndroid.SHORT);
                this.props.dispatch(setDoneOrder([]))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        //  获取代收餐具订单
        fetch(getURL + 'CollectTableware', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setCleanWare(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })

        //  获取桌面上菜订单
        fetch(getURL + 'GetServingOrderList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setTableDelivery(res.data))
            } else if (res.error == 1000){
                ToastAndroid.show(res.data,ToastAndroid.SHORT);
                this.props.dispatch(setTableDelivery([]))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })

        
        //  获取消息
        fetch(getURL + 'GetMassage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                this.props.dispatch(getNotice(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })

        //  更新版本
        fetch(getURL + 'GetVersion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platform: 'Android',
                version: APPVersion
            })
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                this.props.dispatch(appVersion(res.data))
                if (res.data.your_version.version != res.data.current_version.version && res.data.current_version.state == 0) {
                    Alert.alert(
                        '',
                        '版本更新',
                        [
                            {
                                text: '确认', onPress: () => {
                                    Linking.canOpenURL(res.data.current_version.download_url).then(supported => {
                                        if (!supported) {
                                            null
                                        } else {
                                            return Linking.openURL(res.data.current_version.download_url);
                                        }
                                    }).catch(err => null);
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else if (res.data.your_version.version != res.data.current_version.version && res.data.current_version.state == 1) {
                    Alert.alert(
                        '',
                        '有新的版本，是否要更新',
                        [
                            { text: '取消', onPress: () => null, style: 'cancel' },
                            {
                                text: '确认', onPress: () => {
                                    Linking.openURL(res.data.current_version.download_url).catch((err) => { null })
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }
        })
    }
    //  跳转到通知页面
    notice = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Notice') : this.props.navigation.navigate('Login')
    }
    //  搜索页面跳转
    search = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Search') : this.props.navigation.navigate('Login')
    }
    //  点击事件 获取数据 跳到订单详情页面
    toDetail = (item, index) => {
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            tag: item.order_state == 4 ? 'refund' : 'home',
        });
    }
    //  代收餐具 桌面上菜  已完成 页面路由
    headerIconPress = (e) => {
        if (this.props.counter.isLogin) {
            switch (e) {
                case 0:
                    this.props.navigation.navigate('CleanWare')
                    break;
                case 1:
                    this.props.navigation.navigate('Delivery')
                    break;
                default:
                    this.props.navigation.navigate('Complete')
            }
        } else {
            this.props.navigation.navigate('Login')
        }
    }
    //  打印订单
    PrintOrder = (item, index) => {
        if (item.order_state != 4) {
            Alert.alert(
                '打印',
                '是否要打印订单',
                [
                    { text: '忽略', onPress: () => this.Shipment(item, index,0) },
                    { text: '取消', onPress: () => null, style: 'cancel' },
                    {
                        text: '确认', onPress: () => {
                            //  打印机是否已连接
                            NativeModules.BluetoothPrinterModule.IsOk((c) => {
                                if (c.error == 1) {
                                    ToastAndroid.show('打印机未连接', ToastAndroid.SHORT);
                                    this.props.navigation.navigate('Print');
                                } else {
                                    //  打印机连接成功则打印订单
                                    this.Shipment(item, index,1)
                                }
                            })
                        }
                    },
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                '警告',
                '确认退单后钱将直接退回给用户，确认退单？',
                [
                    { text: '取消', onPress: () => null, style: 'cancel' },
                    { text: '确认', onPress: () => this.ConfirmBack(item, index) },
                ],
                { cancelable: false }
            )
        }
    }
    //  提交打印数据，出单
    Shipment = (item, index,state) => {
        fetch(getURL + 'Shipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: item.order_id })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                //打印
                state == 1 ? NativeModules.BluetoothPrinterModule.Print(JSON.stringify(item), this.props.counter.shop.shop_name, this.props.counter.shop.wx_payment_code) : null
                //  删除订单
                this.props.counter.newOrder.splice(index, 1)
                //  如果是桌面点餐就添加到桌面点餐列表
                this.props.counter.tableDelivery.push(item)
                this.props.dispatch(setTableDelivery(this.props.counter.tableDelivery))
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show('打印成功', ToastAndroid.SHORT);
            } else if (res.error == 10) {
                //  删除订单
                this.props.counter.newOrder.splice(index, 1)
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    //  退单
    ConfirmBack(item, index) {
        fetch(getURL + 'ConfirmBack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: item.order_id })
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                this.props.counter.newOrder.splice(index, 1)
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show('退单成功', ToastAndroid.SHORT);
            } else if (res.error == 10) {
                this.props.counter.newOrder.splice(index, 1)
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            console.log(error);
            
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  下拉刷新事件
    onRefresh() {
        this.props.dispatch(isRefreshing(true))
        this.getLoginState()
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表头部组件
    listHeaderComponent = (d) => {
        return (
            <View style={{ backgroundColor: '#FFF', borderBottomColor: '#eee', borderBottomWidth: 0.8, paddingTop: 12, paddingBottom: 10,marginTop:10 }}>
                <Text style={{ paddingLeft: 12 }}>待处理订单数 {d}</Text>
            </View>
        )
    }
    /* 渲染 */
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.counter.refreshing}
                            onRefresh={() => this.onRefresh()}
                            enabled={true}
                            colors={refreshColor}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}
                >
                    <HeaderFun
                        search={this.search}
                        notice={this.notice}
                        noticeView={this.props.counter.notice}
                        completed={this.props.counter.doneOrder.length}
                        ware={this.props.counter.cleanWare.length}
                        table={this.props.counter.tableDelivery.length}
                        headerIconPress={this.headerIconPress}
                    />
                    {
                        this.props.counter.newOrder.length > 0 ? 
                            <DataList
                                data={this.props.counter.newOrder}
                                toDetail={this.toDetail}
                                PrintOrder={this.PrintOrder}
                                printOpcity={true}
                                itemSeparatorComponent={this.itemSeparatorComponent}
                                listHeaderComponent={this.listHeaderComponent}
                            />:
                            <Empty content={empty(this.props.counter.refreshing, this.props.counter.newOrder, '暂无内容')} />
                    }
                    
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(HomeContainer);




